const asyncWrapper = require('../utils/asyncWrapper');
const Review = require('../models/review');
const Book = require('../models/book');
const User = require('../models/user');

exports.add = async (req, res, next) => {
  const userId = req.user._id;
  const bookId = req.params.bookId;
  const { title, content } = req.body;

  try {
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);
    if (!book) {
      const error = new Error('book not found');
      error.status = 404;
      return next(error);
    }

    if (!user) {
      const error = new Error('user not found');
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
      return next(err);
    }
  }

  const review = new Review({
    title,
    content,
    user: userId,
    book: bookId,
  });

  const [reviewErr, reviewData] = await asyncWrapper(review.save());
  if (reviewErr) {
    if (!reviewErr.statusCode) {
      reviewErr.status = 500;
    }
    return next(reviewErr);
  }
  res.status(201).json({ message: 'Review Added Successfully!', review: reviewData });
};

exports.update = async (req, res, next) => {
    const userId = req.userId;
    const {
      params: { reviewId },
      body: { title, content},
    } = req;
    let updates = {title, content};
    const review = Review.findOneAndUpdate({_id:reviewId,user:userId}, updates);
    const [reviewErr, reviewData] = await asyncWrapper(review);
    if (reviewErr) {
      if (!reviewErr.statusCode) {
        reviewErr.statusCode = 500;
      }
      return next(reviewErr);
    }
    if (!reviewData) {
      const error = new Error('Review Not Found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Review Updated successfully!', review: reviewData });
  };

exports.delete = async (req, res, next) => {
    const userId = req.userId;
    const {
      params: { reviewId },
    } = req;
    const review = Review.findOneAndDelete({_id:reviewId,user:userId});
    const [reviewErr, reviewData] = await asyncWrapper(review);
    if (reviewErr) {
      if (!reviewErr.statusCode) {
        reviewErr.statusCode = 500;
      }
      return next(reviewErr);
    }
    if (!reviewData) {
      const error = new Error('Review Not Found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ message: 'Review Deleted successfully!', review: reviewData });
  };

exports.getReviewsByBookId = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  const { bookId } = req.params;
  let total = await Review.find({ author: authorId }).count();
  let reviews = Review.find({ book: bookId })
    .skip((page - 1) * perPage)
    .limit(perPage);
  const [reviewsErr, reviewsData] = await asyncWrapper(reviews);
  if (reviewsErr) {
    if (!reviewsErr.statusCode) {
      reviewsErr.status = 500;
    }
    return next(reviewsErr);
  }
  res
    .status(200)
    .json({
      message: 'successfully found Reviews',
      authorReviews: reviewsData,
      totalReviews: total,
    });
};

exports.getReviewsByBookId = async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  const {bookId}=req.params;
  const total = await Review.find({book:bookId}).count();
  const populateOptions = {
    user: { path: 'user', select: 'firstName lastName'},
  };
  let reviews = Review.find({book:bookId}).skip((page - 1) * perPage)
  .limit(perPage).populate(populateOptions.user);
  const [reviewsErr,reviewsData] = await asyncWrapper(reviews);
  if(reviewsErr) {
    if(!reviewsErr.statusCode){
      reviewsErr.statusCode=500;
    }
    return next(reviewsErr);
  }
  res
    .status(200)
    .json({ message: 'successfully found Reviews', bookReviews: reviewsData, totalReviews: total });
};
