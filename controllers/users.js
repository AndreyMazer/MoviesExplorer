const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ServerError,
} = require('../errors/errors');
const { SUCCESSFUL_ANSWER } = require('../data/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(new ServerError('На сервере произошла ошибка'));
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(SUCCESSFUL_ANSWER).send({
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с данным email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(new ServerError('На сервере произошла ошибка'));
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(new ServerError('На сервере произошла ошибка'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserReference(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные email или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.status(SUCCESSFUL_ANSWER).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
