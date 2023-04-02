/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const categorySchema = new Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
});

module.exports = mongoose.model('Book', categorySchema);
