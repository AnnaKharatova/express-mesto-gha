const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).json({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const {id} = req.params.userId;
  User.findById(id).orFail()
    .then((user) => {
      res.status(200).send(user);

    })
    .catch((err) => {
      if(err.name === 'DocumentNotFoundError'){
        return res.status(404).json({message:  'Пользователь не найден'});
        }
      if(err.name === 'CastError'){
      return res.status(400).json({message: 'Переданы некорректные данные'});
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
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
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
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
