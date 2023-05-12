const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).json({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const id = req.params.userId;
  User.findById(id).orFail()
    .then((user) => {
      res.status(200).send(user);

    })
    .catch((err) => {
      if(err.name === 'DocumentNotFoundError'){
        return res.status(404).send({message:  'Пользователь не найден'});
        }
      if(err.name === 'CastError'){
      return res.status(400).send({message: 'Переданы некорректные данные'});
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
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
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).send({ message: 'Email уже используется' });
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
  });
}
module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,  runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true,  runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          error: {
            code: 400,
            message: 'Переданы некорректные данные'
          }
        });
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы почта или пароль' });
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }
          const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          }).send();
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
