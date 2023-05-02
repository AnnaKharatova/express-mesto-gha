const Card = require('../models/card');
const mongoose = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      res.status(200).send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log(name)
  Card.create({ name, link, owner })
    .then(card => {
      res.status(200).send({ card });
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
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(res.status(404).send({ message:'Не найдена карточка с указанным _id.'}))
  .then((card) => {
    res.send(card);
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
  })

module.exports.removeCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(res.status(404).send({ message:'Не найдена карточка с указанным _id.'}))
  .then((card) => {
    res.send(card);
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