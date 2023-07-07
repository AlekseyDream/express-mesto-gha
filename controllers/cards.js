const Card = require('../models/card');
const { ERROR_CODE } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
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
      if (err instanceof CastError) {
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
  const likeMethod = req.method === 'PUT' ? '$addToSet' : '$pull';
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [likeMethod]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        return next(
          new InaccurateDataError('Передан несуществующий id карточки'),
        );
      }
      return next(err);
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE.NOT_FOUND).send({
          message: 'Not Found.',
        });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятии лайка.',
        });
      } else {
        res.status(ERROR_CODE.SERVER_ERROR).send({
          message: 'Internal Server Error.',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
