const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');
const {
  userAvatarValidate, userInfoValidate, userIdValidate,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getUserById);
router.get('/users/:userId', userIdValidate, getUserById);
router.patch('/users/me', userInfoValidate, updateUser);
router.patch('/users/me/avatar', userAvatarValidate, updateUserAvatar);

module.exports = router;
