const asyncWrapper = require('../utils/asyncWrapper');
const Category = require('../models/category');
const Book = require('../models/book');
const BookShelf = require('../models/shelf');

exports.add = async (req, res, next) => {
  const {
    body: { name },
  } = req;

  const category = new Category({
    name,
  });

  const [categoryErr, categoryData] = await asyncWrapper(category.save());
  if (categoryErr) {
    if (!categoryErr.statusCode) {
      categoryErr.status = 500;
    }
    return next(categoryErr);
  }
  res.status(201).json({ message: 'Category Created Successfully!', categoryId: categoryData._id });
};

exports.delete = async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;

  const categoryBook = Book.findOne({ category: categoryId });
  const [bookErr, bookData] = await asyncWrapper(categoryBook);
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.status = 500;
    }
    return next(bookErr);
  }
  if (bookData) {
    const error = new Error('This category has some books and cannot be deleted.');
    error.status = 409;
    return next(error);
  }

  const category = Category.findByIdAndDelete(categoryId);
  const [categoryErr, categoryData] = await asyncWrapper(category);
  if (categoryErr) {
    if (!categoryErr.statusCode) {
      categoryErr.status = 500;
    }
    return next(categoryErr);
  }
  if (!categoryData) {
    const error = new Error('Category Not Found');
    error.status = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category Deleted successfully!', category: categoryData });
};

exports.update = async (req, res, next) => {
  const {
    params: { categoryId },
    body: { name },
  } = req;
  const category = Category.findByIdAndUpdate(categoryId, { name });
  const [categoryErr, categoryData] = await asyncWrapper(category);
  if (categoryErr) {
    if (!categoryErr.statusCode) {
      categoryErr.status = 500;
    }
    return next(categoryErr);
  }
  if (!categoryData) {
    const error = new Error('Category Not Found');
    error.status = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category Updated successfully!', category: categoryData });
};

exports.get = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = 10;

  try {
    const totalCategories = await Category.find().countDocuments();
    const categories = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (categories.length === 0) {
      const error = new Error('Page not found');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Categories found', categories, totalCategories });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    return next(err);
  }
};

exports.getById = async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;
  const category = Category.findById(categoryId);
  const [categoryErr, categoryData] = await asyncWrapper(category);
  if (categoryErr) {
    if (!categoryErr.statusCode) {
      categoryErr.status = 500;
    }
    return next(categoryErr);
  }
  if (!categoryData) {
    const error = new Error('Category not found');
    error.status = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category found successfully!', category: categoryData });
};

exports.getBooksByCategory = async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  const userId = req.user ? req.user._id : undefined;
  const totalBooks = await Book.find({ category: categoryId }).count();
  const books = Book.find({ category: categoryId }).skip((page-1)*perPage).limit(perPage).populate('author');
  const [bookErr, bookData] = await asyncWrapper(books);
  if (bookErr) {
    if (!bookErr.statusCode) {
      bookErr.status = 500;
    }
    return next(bookErr);
  }
  if (!bookData) {
    const error = new Error('Category not found');
    error.status = 404;
    return next(error);
  }

  for (let i = 0; i < bookData.length; i++) {
    const bookShelf = await BookShelf.findOne({ user: userId, book: bookData[i]._id });
    if (bookShelf) {
      bookData[i].shelfName = bookShelf.shelfName;
    }
  }

  res.status(200).json({ message: 'Category Books found successfully!', books: bookData , totalBooks: totalBooks });
};
