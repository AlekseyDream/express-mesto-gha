const express = require('express');
const mongoose = require('mongoose');
const { ERROR_CODE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '649870f348dd83ba10731c03',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Неправильный путь' });
});
app.listen(PORT);
