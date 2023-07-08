const mongoose = require('mongoose');
const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const InaccurateDataError = require('../errors/InaccurateDataError');
const NotPermissionError = require('../errors/NotPermissionError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(ERROR_CODE.CREATED).res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new InaccurateDataError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new NotPermissionError('Нельзя трогать чужие карточки');
      }
      card.deleteOne().then(() => {
        res.status(ERROR_CODE.OK).send({
          message:
            'Спасибо что воспользовались моими услугами и удалили карточку, которую я любил',
        });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new InaccurateDataError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new InaccurateDataError('Передан несуществующий id карточки'),
        );
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new InaccurateDataError('Передан несуществующий id карточки'),
        );
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
