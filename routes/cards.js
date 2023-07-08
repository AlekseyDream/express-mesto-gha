const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardIdValidate, cardValidate } = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', cardValidate, createCard);
router.delete('/cards/:cardId', cardIdValidate, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidate, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = router;
