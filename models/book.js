/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const bookSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    description: {
      type: String,
      minLength: 10,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    shelfName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
