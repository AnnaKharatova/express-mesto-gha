const router = require('express').Router();
const { getCards, deleteCard, createCard, addCardLike, removeCardLike } = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', addCardLike);
router.delete('/:cardId/likes', removeCardLike);

module.exports = router;
