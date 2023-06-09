const mongoose = require('mongoose');

const { Schema } = mongoose;
const bookShelfSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shelfName: {
    type: String,
    enum: ['WANT_TO_READ', 'CURRENTLY_READING', 'READ'],
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
});

module.exports = mongoose.model('BookShelf', bookShelfSchema);
