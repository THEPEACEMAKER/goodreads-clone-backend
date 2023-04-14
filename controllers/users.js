const User = require('../models/user');
const Book = require('../models/book');
const BookShelf = require('../models/shelf');

exports.addToShelf = async (req, res, next) => {
  const { bookId, shelf } = req.body;
  const userId = req.user._id;

  try {
    // Check if user and book exist
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if book already exists in shelf
    let bookShelf = await BookShelf.findOne({ user: userId, book: bookId });

    // Update or delete book shelf if it already exists, otherwise add it to the shelf
    if (bookShelf) {
      if (shelf === 'NONE') {
        await BookShelf.deleteOne({ _id: bookShelf._id });
        return res.status(200).json({ message: 'Book removed from shelf successfully' });
      } else {
        bookShelf.shelfName = shelf;
        bookShelf = await bookShelf.save();
        return res.status(200).json({ message: 'Book updated on shelf successfully' });
      }
    } else {
      bookShelf = new BookShelf({ user: userId, book: bookId, shelfName: shelf });
      bookShelf = await bookShelf.save();
      return res.status(200).json({ message: 'Book added to shelf successfully' });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

// http://localhost:3000/user/books
// http://localhost:3000/user/books?shelf=READ
// http://localhost:3000/user/books?shelf=CURRENTLY_READING
// http://localhost:3000/user/books?shelf=WANT_TO_READ
exports.getUserBooks = async (req, res, next) => {
  const userId = req.user._id;
  let { shelf, page = 1, perPage = 10 } = req.query;

  const query = { user: userId };
  if (shelf) {
    query.shelfName = shelf;
  }

  try {
    const bookShelves = await BookShelf.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('book');

    const books = bookShelves.map((bookShelf) => {
      const book = bookShelf.book;
      const shelfName = bookShelf.shelfName;
      return {
        ...book._doc,
        shelfName: shelfName,
      };
    });
    const totalBooks = await BookShelf.countDocuments(query);

    return res.status(200).json({ books, totalBooks });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
