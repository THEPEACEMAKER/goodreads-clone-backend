const Category = require('../models/category');
const Author = require('../models/author');
const Book = require('../models/book');
const asyncWrapper = require('../utils/asyncWrapper');
const clearImage = require('../utils/clearImage');
const BookShelf = require('../models/shelf');
const cloudinary = require('../utils/cloudinary');

exports.add = async (req, res, next) => {
  if (!req.file) {
    const error = new Error('No image file provided');
    error.status = 422;
    throw error;
  }

  try {
    const { name, description, categoryId, authorId } = req.body;
    const [category, author, image] = await Promise.all([
      Category.findById(categoryId),
      Author.findById(authorId),
      cloudinary.uploader.upload(req.file.path),
    ]);

    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    if (!author) {
      const error = new Error('Author not found');
      error.status = 404;
      throw error;
    }

    imageUrl = image.secure_url;

    const book = new Book({
      name,
      description,
      imageUrl,
      category: categoryId,
      author: authorId,
    });

    const bookData = await book.save();

    // Increase booksCount of author and category
    author.booksCount += 1;
    category.booksCount += 1;

    // Save updated author and category objects
    await Promise.all([author.save(), category.save()]);

    res.status(201).json({ message: 'Book Created Successfully!', bookId: bookData._id });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId).populate('author').populate('category');

    if (!book) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }

    const author = book.author;
    const category = book.category;

    // Delete the book
    const deletedBook = await Book.findByIdAndDelete(bookId);
    //Delete from book shelf
    await BookShelf.deleteMany({ book: bookId });
    // Decrease booksCount of author and category
    author.booksCount -= author.booksCount > 0 ? 1 : 0;
    category.booksCount -= category.booksCount > 0 ? 1 : 0;

    // Save updated author and category objects
    await Promise.all([author.save(), category.save()]);

    clearImage(deletedBook.imageUrl.split('/').pop().split('.')[0]);

    res.status(200).json({ message: 'Book deleted successfully!', book: deletedBook });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const {
    body: { name, description, categoryId, authorId },
    params: { bookId },
  } = req;

  let imageUrl = req.body.image;
  if (req.file) {
    cloudinary.uploader.upload(req.file.path);
    imageUrl = image.secure_url;
  }
  if (!imageUrl) {
    const error = new Error('No image file provided');
    error.status = 422;
    return next(error);
  }

  try {
    const [book, author, category] = await Promise.all([
      Book.findById(bookId).populate('author').populate('category'),
      Author.findById(authorId),
      Category.findById(categoryId),
    ]);

    if (!book) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }

    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    if (!author) {
      const error = new Error('Author not found');
      error.status = 404;
      throw error;
    }

    const shouldUpdateCategoryCount = book.category._id.toString() !== categoryId;
    const shouldUpdateAuthorCount = book.author._id.toString() !== authorId;

    if (shouldUpdateCategoryCount) {
      const oldCategory = await Category.findById(book.category);
      oldCategory.booksCount -= oldCategory.booksCount > 0 ? 1 : 0;
      await oldCategory.save();
      category.booksCount += 1;
      await category.save();
    }

    if (shouldUpdateAuthorCount) {
      const oldAuthor = await Author.findById(book.author);
      oldAuthor.booksCount -= oldAuthor.booksCount > 0 ? 1 : 0;
      await oldAuthor.save();
      author.booksCount += 1;
      await author.save();
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { name, description, category: categoryId, author: authorId, imageUrl },
      { new: true }
    )
      .populate('author')
      .populate('category');

    res.status(200).json({ message: 'Book Updated Successfully!', book: updatedBook });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.get = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  const userId = req.user ? req.user._id : undefined;

  try {
    const populateOptions = {
      category: { path: 'category', select: 'name' },
      author: { path: 'author', select: 'firstName lastName' },
    };

    const totalBooks = await Book.find().countDocuments();
    let books = await Book.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate(populateOptions.category)
      .populate(populateOptions.author);

    if (books.length === 0) {
      const error = new Error('Page not found');
      error.status = 404;
      return next(error);
    }

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const bookShelf = await BookShelf.findOne({ user: userId, book: book._id });
      if (bookShelf) {
        book.shelfName = bookShelf.shelfName;
      }
    }

    res.status(200).json({ message: 'Books found', books, totalBooks });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    return next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  const {
    params: { bookId },
    query: { populate },
  } = req;
  const userId = req.user ? req.user._id : undefined;
  const populateFields = populate ? populate.split(' ') : []; // Adel: for when we need to get the book with its reviews, will need some testing
  const populateOptions = {
    category: { path: 'category', select: '' },
    author: { path: 'author', select: '' },
  };
  if (populateFields.includes('reviews')) {
    populateOptions.reviews = { path: 'reviews', populate: { path: 'user' } };
  }
  const book = Book.findById(bookId)
    .populate(populateOptions.author)
    .populate(populateOptions.category);
  const [bookErr, bookData] = await asyncWrapper(book);
  if (bookErr) {
    if (!bookErr.status) {
      bookErr.status = 500;
    }
    return next(bookErr);
  }
  if (!bookData) {
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);
  }

  const bookShelf = await BookShelf.findOne({ user: userId, book: bookData._id });
  if (bookShelf) {
    bookData.shelfName = bookShelf.shelfName;
  }
  res.status(200).json({ message: 'Book found successfully!', book: bookData });
};

exports.searchBooksByName = async (req, res, next) => {
  const searchQuery = req.query.name;

  try {
    const books = await Book.find({ name: { $regex: searchQuery, $options: 'i' } })
      .limit(6)
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'author', select: 'firstName lastName' });

    res.status(200).json({ message: 'Books found', books });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    return next(err);
  }
};

exports.getPopularBooks = async (req, res, next) => {
  try {
    const populateOptions = {
      category: { path: 'category', select: 'name' },
      author: { path: 'author', select: 'firstName lastName' },
    };

    const books = await Book.find()
      .sort({ avgRating: 'desc', ratingsCount: 'desc' })
      .limit(5)
      .populate(populateOptions.category)
      .populate(populateOptions.author);

    res.status(200).json({ message: 'Popular books found', books });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    return next(err);
  }
};
