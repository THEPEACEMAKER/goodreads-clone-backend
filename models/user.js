/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 15,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    books: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
        },
        shelf: {
          enum: ['WANT TO READ', 'CURRENTLY READING', 'READ'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
