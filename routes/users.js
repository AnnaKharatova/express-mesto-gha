const router = require('express').Router();
const { getUsers, getUserById, updateUserProfile, updateUserAvatar, getUser } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const { urlRegex }  = require('../utils/constants')

router.get('/', getUsers);
router.get('/me', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), getUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserProfile);
router.patch('/me/avatar',  celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex).required()
  }),
}), updateUserAvatar);

module.exports = router;