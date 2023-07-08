const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler');
const { signinValidate, signupValidate } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(helmet());
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
