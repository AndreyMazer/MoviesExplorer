const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  director: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  duration: {
    type: Number,
    required: [true, "Поле обязательно к заполнению"],
  },
  year: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  description: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  image: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  trailerLink: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  thumbnail: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Поле обязательно к заполнению"],
  },
  movieId: {
    type: Number,
    required: [true, "Поле обязательно к заполнению"],
  },
  nameRU: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
  nameEN: {
    type: String,
    required: [true, "Поле обязательно к заполнению"],
  },
});

module.exports = mongoose.model("movie", movieSchema);
