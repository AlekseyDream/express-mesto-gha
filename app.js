const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '56497157b4690c6534e40830e',
  };

  next();
});

app.use(router);
app.listen(PORT);
