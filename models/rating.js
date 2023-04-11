const mongoose = require('mongoose');

const { Schema } = mongoose;
const ratingSchema = new Schema(
  {
    rate: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rating', ratingSchema);
