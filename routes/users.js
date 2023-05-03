const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;