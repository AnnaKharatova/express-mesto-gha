const router = require('express').Router();
const { getCards, deleteCard, createCard, addCardLike, removeCardLike } = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i).required(),
  }),
}),  createCard);
router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', removeCardLike);

module.exports = router;
