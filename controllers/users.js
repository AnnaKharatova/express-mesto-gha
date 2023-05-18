const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, NotFoundError, BadRequestError, ConflictError } = require('../utils/errors/index-errors')

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id).orFail()
    .then((user) => {
      res.status(200).send(user);

    })
    .catch((err) => {
      if(err.name === 'DocumentNotFoundError'){
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
        }
      return next() /*res.status(500).send({ message: 'На сервере произошла ошибка' })*/;
    });
};

module.exports.createUser = (req, res,next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
  .then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next( new ConflictError('Email уже используется' ));
      }
      return next() /*res.status(500).json({ message: 'На сервере произошла ошибка' });*/
    });
  });
}
module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,  runValidators: true })
    .then((user) => {
      /*if (!user) {
        return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
      }*/
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next() /*res.status(500).json({ message: 'На сервере произошла ошибка' });*/
    });
};


module.exports.getUser = (req, res, next) => {
  const userId = req.user._id
  console.log(userId)
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send({ user });
    })
    .catch(next);
};


/*module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
  .then((user) => {
    res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next() /*res.status(500).json({ message: 'На сервере произошла ошибка' });
  });
};*/

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true,  runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next() /*res.status(500).json({ message: 'На сервере произошла ошибка' });*/
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next (new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next (new UnauthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})
          res.cookie('jwt', token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: true,
          })
          res.send({ token })
        })
        .catch(next)
    })
};
