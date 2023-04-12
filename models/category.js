/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const categorySchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
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

module.exports = mongoose.model('Category', categorySchema);
