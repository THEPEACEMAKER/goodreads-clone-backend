const asyncWrapper = require('../utils/asyncWrapper');
const Category = require('../models/category');

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
      categoryErr.statusCode = 500;
    }
    return next(categoryErr);
  }
  res.status(201).json({ message: 'Category Created Successfully!', categoryId: categoryData._id });
};

exports.delete = async (req, res, next) => {
  const {
    params: { categoryId },
  } = req;
  const category = Category.findOneAndDelete({ _id: categoryId });
  const [deleteErr, deleteData] = await asyncWrapper(category);
  if (deleteErr) {
    if (!deleteErr.statusCode) {
      deleteErr.statusCode = 500;
    }
    return next(deleteErr);
  }
  if (!deleteData) {
    const error = new Error('Category Not Found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category Deleted successfully!', category: deleteData });
};

exports.update = async (req, res, next) => {
  const {
    params: { categoryId },
    body: { name },
  } = req;
  const category = Category.findOneAndUpdate({ _id: categoryId }, { name });
  const [updateErr, updateData] = await asyncWrapper(category);
  if (updateErr) {
    if (!updateErr.statusCode) {
      updateErr.statusCode = 500;
    }
    return next(updateErr);
  }
  if (!updateData) {
    const error = new Error('Category Not Found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category Updated successfully!', category: updateData });
};

exports.update = async (req, res, next) => {
  const {
    params: { categoryId },
    body: { name },
  } = req;
  const category = Category.findOneAndUpdate({ _id: categoryId }, { name });
  const [updateErr, updateData] = await asyncWrapper(category);
  if (updateErr) {
    if (!updateErr.statusCode) {
      updateErr.statusCode = 500;
    }
    return next(updateErr);
  }
  if (!updateData) {
    const error = new Error('Category Not Found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Category Updated successfully!', category: updateData });
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
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Categories found', categories, totalCategories });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
