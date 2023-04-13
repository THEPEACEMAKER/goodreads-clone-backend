const User = require('../models/user');
const Book = require('../models/book');
const asyncWrapper = require('../utils/asyncWrapper');

exports.addToShelf = async (req, res, next) => {
  console.log('1');
  const {
    body: { bookId, shelf },
    userId,
  } = req;
  console.log(userId);
  try {
    const user = await User.findById(userId).populate('books.book');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
  console.log('2');

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      return next(error);
    }
  console.log('3');

    // const existingBook = user.books.find((book) => book.book._id.toString() === bookId);
    // if (existingBook) {
    //   const error = new Error('Book already exists in user shelves');
    //   error.statusCode = 400;
    //   return next(error);
    // }

  console.log('4');
    console.log(shelf);
    user.books.push({ book: bookId, shelf });
    const userw = await user.save();
    console.log(userw.books);
  
    console.log('5');

    return res.status(200).json({ message: 'Book Added to Shelf successfully' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.updateShelf = async (req, res, next) => {
  const {
    body: { shelf },
    params: { bookId },
    userId,
  } = req;

  const result = User.findOneAndUpdate(
    { _id: userId, 'books.book': bookId },
    { $set: { 'books.$.shelf': shelf } },
    { new: true, runValidators: true }
  );

  const [updateErr, updateData] = await asyncWrapper(result);
  if (updateErr) {
    if (!updateErr.statusCode) {
      updateErr.statusCode = 500;
    }
    return next(updateErr);
  }

  if (!updateData) {
    const error = new Error('Not found');
    error.statusCode = 404;
    return next(error);
  }

  return res.json({ message: 'User shelf updated successfully', updateData });
};

exports.deleteFromShelf = async (req, res, next) => {
  const {
    body: { bookId },
    userId,
  } = req;

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      const error = new Error('User Not found');
      error.statusCode = 404;
      return next(error);
    }
    const bookCountBeforeDel = user.books.length;

    const userData = await User.findByIdAndUpdate(
      userId,
      { $pull: { books: { book: bookId , shelf} } },
      { new: true }
    );

    if (bookCountBeforeDel === userData.books.length) {
      const error = new Error('Book Not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({ message: 'Book removed from user books', user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
