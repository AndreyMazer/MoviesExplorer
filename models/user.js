const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UnauthorizedError = require("../errors/unauthorizedError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Минимальное количество символов - 2"],
    maxlength: [30, "Максимальное количество символов - 30"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserReference = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неверные email или пароль")
        );
      }
      
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Неверные email или пароль")
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
