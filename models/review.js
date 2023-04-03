/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      minLnegth: 3,
      required: true,
    },
    content: {
      type: String,
      minLnegth: 3,
      required: true,
    },
    rating: {
      type: Number,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
