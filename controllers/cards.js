const mongoose = require('mongoose');
const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
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
    .then((card) => res.status(ERROR_CODE.CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequestError(
            'Некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Недопустимая операция');
      }
      card.deleteOne().then(() => {
        res.status(ERROR_CODE.OK).send({
          message: 'Карточка удалена',
        });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequestError(
            'Некорректные данные при удалении карточки',
          ),
        );
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const likeMethod = req.method === 'PUT' ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [likeMethod]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequestError('Передан несуществующий id карточки'),
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
};
