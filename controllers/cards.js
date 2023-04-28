const Card = require('../models/card');

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
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
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
