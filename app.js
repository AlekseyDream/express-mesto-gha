const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '56497157b4690c6534e40830e',
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Неправильный путь' });
});
app.listen(PORT);
