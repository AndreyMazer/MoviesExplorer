const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { reqLog, errLog } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;

const app = express();
app.use(express.json());
app.use(reqLog);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(router);
app.use(errors());
app.use(errLog);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
