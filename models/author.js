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
});

module.exports = mongoose.model('Author', authorSchema);
