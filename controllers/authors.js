const Author = require('../models/author');
const asyncWrapper = require('../utils/asyncWrapper');
const clearImage = require('../utils/clearImage');

exports.add = async (req, res, next) => {
  const {
    body: { firstName, lastName, dob },
  } = req;
  if (!req.file) {
    imageUrl = 'http://localhost:3000/images/default_author.jpg';
    // const error = new Error('No image file provided');
    // error.statusCode = 422;
    // return next(error);
  } else imageUrl = `http://localhost:3000/images/${req.file.filename}`;

  const author = new Author({
    firstName,
    lastName,
    dob,
    imageUrl,
  });

  const [authorErr, authorData] = await asyncWrapper(author.save());
  if (authorErr) {
    if (!authorErr.statusCode) {
      authorErr.statusCode = 500;
    }
    return next(authorErr);
  }
  res.status(201).json({ message: 'Author Created Successfully!', authorId: authorData._id });
};

exports.delete = async (req, res, next) => {
  const {
    params: { authorId },
  } = req;
  const author = Author.findByIdAndDelete(authorId);
  const [authorErr, authorData] = await asyncWrapper(author);
  if (authorErr) {
    if (!authorErr.statusCode) {
      authorErr.statusCode = 500;
    }
    return next(authorErr);
  }
  if (!authorData) {
    const error = new Error('Author Not Found');
    error.statusCode = 404;
    return next(error);
  }
  clearImage(authorData.imageUrl);
  res.status(200).json({ message: 'Author Deleted successfully!', author: authorData });
};

exports.update = async (req, res, next) => {
  const {
    params: { authorId },
    body: { firstName, lastName, dob },
  } = req;
  let updates = {};
  let imageUrl = req.body.image;
  if (req.file) {
    console.log(req.file);
    imageUrl = req.file.filename;
  }
  if (!imageUrl) {
    updates = { firstName, lastName, dob };
    // const error = new Error('No image file provided');
    // error.statusCode = 422;
    // return next(error);
  } else {
    updates = { firstName, lastName, dob, imageUrl };
  }

  const author = Author.findByIdAndUpdate(authorId, updates);
  const [authorErr, authorData] = await asyncWrapper(author);
  if (authorErr) {
    if (!authorErr.statusCode) {
      authorErr.statusCode = 500;
    }
    return next(authorErr);
  }
  if (!authorData) {
    const error = new Error('Author Not Found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Author Updated successfully!', author: authorData });
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
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Authors found', authors, totalAuthors });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getById = async (req, res, next) => {
  const {
    params: { authorId },
  } = req;
  const author = Author.findById(authorId);
  const [authorErr, authorData] = await asyncWrapper(author);
  if (authorErr) {
    if (!authorErr.statusCode) {
      authorErr.statusCode = 500;
    }
    return next(authorErr);
  }
  if (!authorData) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  res.status(200).json({ message: 'Author found successfully!', author: authorData });
};
