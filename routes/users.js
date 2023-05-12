const router = require('express').Router();
const { getUsers, getUserById, updateUserProfile, updateUserAvatar, getUser } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserProfile);
router.patch('/me/avatar',  celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i)
  }),
}), updateUserAvatar);

module.exports = router;