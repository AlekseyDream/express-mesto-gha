const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');
const {
  userAvatarValidate, userInfoValidate, userIdValidate,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserById);
router.get('/:userId', userIdValidate, getUserById);
router.patch('/me', userInfoValidate, updateUser);
router.patch('/me/avatar', userAvatarValidate, updateUserAvatar);

module.exports = router;
