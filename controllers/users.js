const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params
  User.findById(id).orFail(res.status(400).send({ message: 'Переданы некорректные данные' }))
    .then((user) => {
      return res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      res.status(200).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          res.status(400).json({
            error: {
              code: 400,
              message: 'Переданы некорректные данные'
            }
          }));
      }
      return next(res.status(500).send({ message: 'На сервере произошла ошибка' }));
    });
}

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true,  runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
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
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
