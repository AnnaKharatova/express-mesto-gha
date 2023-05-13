const Card = require('../models/card');
const mongoose = require('mongoose');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      res.status(200).send({ data: cards });
    })
    .catch(() => res.status(500).json({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).json({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;
  Card.findById(cardId).orFail()
  .then((card) => {
    if (req.user._id !== card.owner.toString()) {
      return res.status(403).json({message: 'Попытка удалить чужую карточку'});
    }
    return card.findByIdAndRemove(cardId)
  })
  .then(() => res.send({ message: 'Карточка успешно удалена' }))
  .catch((err) => {
    if(err.name === 'DocumentNotFoundError'){
      return res.status(404).json({message:  'Карточка с указанным _id не найдена.'});
      }
    if(err.name === 'CastError'){
    return res.status(400).json({message: 'Переданы некорректные данные при удалении карточки'});
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  });
}

module.exports.addCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }).orFail()
  .then((card) => {

    res.status(200).send(card)
  })
  .catch((err) => {
    if(err.name === 'DocumentNotFoundError'){
      return res.status(404).json({message:  'Карточка с указанным _id не найдена.'});
      }
    if(err.name === 'CastError'){
    return res.status(400).json({message: 'Переданы некорректные данные'});
    }
    return res.status(500).json({ message: 'Произошла ошибка' });
  })

module.exports.removeCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail()
.then((card) => {
  res.status(200).send(card)
})
.catch((err) => {
  if(err.name === 'DocumentNotFoundError'){
    return res.status(404).json({message:  'Карточка с указанным _id не найдена.'});
    }
  if(err.name === 'CastError'){
  return res.status(400).json({message: 'Переданы некорректные данные'});
  }
  return res.status(500).json({ message: 'Произошла ошибка' });
})