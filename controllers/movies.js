const Movie = require('../models/movie');
const {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} = require('../errors/errors');
const { SUCCESSFUL_ANSWER } = require('../data/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(SUCCESSFUL_ANSWER).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(new ServerError('На сервере произошла ошибка'));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Кино не найдено');
      }
      if (movie.owner.toString() === req.user._id) {
        movie
          .deleteOne(movie)
          .then((movies) => res.send(movies))
          .catch(next);
      } else {
        next(new ForbiddenError('Вы не можете удалить чужое кино'));
      }
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return next(new NotFoundError('Кино не найдено'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
