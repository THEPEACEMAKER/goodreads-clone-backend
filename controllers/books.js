const Category = require('../models/category');
const Author = require('../models/author');
const Book = require('../models/book');
const asyncWrapper = require('../utils/asyncWrapper');
const clearImage = require('../utils/clearImage');

exports.add = async (req, res, next) => {
  const {
    body: { name, description, categoryId, authorId },
  } = req;

  try {
    const category = await Category.findById(categoryId);
    const author = await Author.findById(authorId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      return next(error);
    }

    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      return next(err);
    }
  }

  if (!req.file) {
    const error = new Error('No image file provided');
    error.statusCode = 422;
    return next(error);
  }
  const imageUrl = `http://localhost:3000/images/${req.file.filename}`;

  const book = new Book({
    name,
    description,
    imageUrl,
    category: categoryId,
    author: authorId,
  });

  const [bookErr, bookData] = await asyncWrapper(book.save());
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.statusCode = 500;
    }
    return next(bookErr);
  }
  res.status(201).json({ message: 'Book Created Successfully!', bookId: bookData._id });
};

exports.delete = async (req, res, next) => {
  const {
    params: { bookId },
  } = req;
  const book = Book.findByIdAndDelete(bookId);
  const [bookErr, bookData] = await asyncWrapper(book);
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.statusCode = 500;
    }
    return next(bookErr);
  }
  if (!bookData) {
    const error = new Error('Book Not Found');
    error.statusCode = 404;
    return next(error);
  }
  clearImage(bookData.imageUrl);
  res.status(200).json({ message: 'Book Deleted successfully!', book: bookData });
};

exports.update = async (req, res, next) => {
  const {
    body: { name, categoryId, authorId },
    params: { bookId },
  } = req;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = `http://localhost:3000/images/${req.file.filename}`;
  }
  if (!imageUrl) {
    const error = new Error('No image file provided');
    error.statusCode = 422;
    return next(error);
  }
  try {
    const category = await Category.findById(categoryId);
    const author = await Author.findById(authorId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      return next(error);
    }

    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      return next(err);
    }
  }

  const book = Book.findByIdAndUpdate(
    bookId,
    { name, categoryId, authorId, imageUrl },
    { new: true }
  );
  const [bookErr, bookData] = await asyncWrapper(book);
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.statusCode = 500;
    }
    return next(bookErr);
  }
  if (!bookData) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
    s;
  }

  res.status(200).json({ message: 'Book Updated Successfully!', book: bookData });
};

exports.get = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 10;
  try {
    const populateOptions = {
      category: { path: 'category', select: 'name -_id' },
      author: { path: 'author', select: 'firstName lastName -_id' },
    };
    const totalBooks = await Book.find().countDocuments();
    let books = await Book.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate(populateOptions.category)
      .populate(populateOptions.author);

    if (books.length === 0) {
      const error = new Error('Page not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Books found', books, totalBooks });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  const {
    params: { bookId },
    query: { populate },
  } = req;
  const populateFields = populate ? populate.split(' ') : []; // Adel: for when we need to get the book with its reviews, will need some testing
  const populateOptions = {
    category: { path: 'category', select: '' },
    author: { path: 'author', select: '' },
  };
  if (populateFields.includes('reviews')) {
    populateOptions.reviews = { path: 'reviews', populate: { path: 'user' } };
  }
  const book = Book.findById(bookId).populate(populateOptions.author).populate(populateOptions.category);
  const [bookErr, bookData] = await asyncWrapper(book);
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.statusCode = 500;
    }
    return next(bookErr);
  }
  if (!bookData) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Book found successfully!', book: bookData });
};
