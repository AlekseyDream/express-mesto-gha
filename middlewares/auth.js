const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
    return;
  }

  req.user = payload;

  next();
};
