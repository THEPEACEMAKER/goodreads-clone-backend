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
    imageUrl: {
      type: String,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
      },
    ],
    avgRating: {
      type: Number,
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
