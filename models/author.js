/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const authorSchema = new Schema({
  firstName: {
    type: String,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  booksCount: {
    type: Number,
    default: 0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Author', authorSchema);
