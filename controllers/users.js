const User = require('../models/user');
const { ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(ERROR_CODE.OK).send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE.SERVER_ERROR).send({
        message: 'Internal Server Error.',
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFound') {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Not Found.' });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error.',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(ERROR_CODE.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error.',
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Not Found.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error.',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: 'Not Found.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error.',
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
