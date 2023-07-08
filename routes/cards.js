const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard,
} = require('../controllers/cards');
const { cardIdValidate, cardValidate } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidate, createCard);
router.delete('/:cardId', cardIdValidate, deleteCard);
router.put('/:cardId/likes', cardIdValidate, likeCard);
router.delete('/:cardId/likes', cardIdValidate, likeCard);

module.exports = router;
