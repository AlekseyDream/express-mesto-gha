const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { signinValidate, signupValidate } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);
app.use(router);
app.use(auth);
app.use(helmet());
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});
app.listen(PORT);
