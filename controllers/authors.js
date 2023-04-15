const Author = require('../models/author');
const Book = require('../models/book');
const asyncWrapper = require('../utils/asyncWrapper');
const clearImage = require('../utils/clearImage');
const BookShelf = require('../models/shelf');
const cloudinary = require('../utils/cloudinary');

exports.add = async (req, res, next) => {
  const {
    body: { firstName, lastName, dob },
  } = req;

  try {
    if (!req.file) {
      imageUrl = 'http://localhost:3000/images/default_author.jpg';
    } else {
      const image = await cloudinary.uploader.upload(req.file.path);
      imageUrl = image.secure_url;
      const author = new Author({
        firstName,
        lastName,
        dob,
        imageUrl,
      });

      await author.save();
      res.status(201).json({ message: 'Author Created Successfully!', authorId: author._id });
    }
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const {
    params: { authorId },
  } = req;
  try {
    const authorBook = await Book.findOne({ author: authorId });
    if (authorBook) {
      const error = new Error('This author has some books and cannot be deleted.');
      error.status = 409;
      throw error;
    }

    const author = await Author.findByIdAndDelete(authorId);

    if (!author) {
      const error = new Error('Author Not Found');
      error.status = 404;
      throw error;
    }
    clearImage(author.imageUrl.split("/").pop().split(".")[0]);
    res.status(200).json({ message: 'Author Deleted successfully!', author });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const {
    params: { authorId },
    body: { firstName, lastName, dob },
  } = req;
  let updates = {};
  let imageUrl = req.body.image;

  try {
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path);
      imageUrl = image.secure_url;
    }
    if (!imageUrl) {
      updates = { firstName, lastName, dob };
    } else {
      updates = { firstName, lastName, dob, imageUrl };
    }

    const author = await Author.findByIdAndUpdate(authorId, updates);
    if (!author) {
      const error = new Error('Author Not Found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: 'Author Updated successfully!', author: author });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.get = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 10;

  try {
    const totalAuthors = await Author.find().countDocuments();
    const authors = await Author.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (authors.length === 0) {
      const error = new Error('Page not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Authors found', authors, totalAuthors });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  const {
    params: { authorId },
  } = req;

  try {
    const author = await Author.findById(authorId);
    if (!author) {
      const error = new Error('Author not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: 'Author found successfully!', author: author });
  } catch (error) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getAuthorBooks = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  const { authorId } = req.params;
  const userId = req.user ? req.user._id : undefined;
  try {
    const total = await Book.find({ author: authorId }).count();
    const books = await Book.find({ author: authorId })
      .populate({
        path: 'author',
        select: 'firstName lastName -_id',
      })
      .skip((page - 1) * perPage)
      .limit(perPage);
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const bookShelf = await BookShelf.findOne({ user: userId, book: book._id });
      if (bookShelf) {
        book.shelfName = bookShelf.shelfName;
      }
    }
    res
      .status(200)
      .json({ message: 'successfully found Books', authorBooks: books, totalBooks: total });
  } catch (error) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
