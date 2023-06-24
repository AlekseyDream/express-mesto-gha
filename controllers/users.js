const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({
        message: 'На сервере произошла ошибка1',
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.message === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(404).send({
          message: '',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка2',
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(405)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка3',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному id не найден.' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      } else {
        res.status(500).send({
          message: 'На сервере произошла ошибка4',
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
