const asyncWrapper = require('../utils/asyncWrapper');
const Rating = require('../models/rating');
const Book = require('../models/book');

exports.addRating = async (req, res, next) => {
  const userId = req.userId;
  const bookId = req.params.bookId;
  const { rate } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      return next(error);
    }

    const existingRating = await Rating.findOne({ userId, bookId });
    if (existingRating) {
      // Update existing rating
      const [ratingErr, savedRating] = await asyncWrapper(
        Rating.findByIdAndUpdate(existingRating._id, { rate }, { new: true })
      );
      if (ratingErr) {
        if (!ratingErr.statusCode) {
          ratingErr.statusCode = 500;
        }
        return next(ratingErr);
      }
    } else {
      // Create new rating
      const rating = new Rating({ rate, userId, bookId });
      const [ratingErr, savedRating] = await asyncWrapper(rating.save());
      if (ratingErr) {
        if (!ratingErr.statusCode) {
          ratingErr.statusCode = 500;
        }
        return next(ratingErr);
      }
    }

    // Recalculate the average rating for the book
    const ratings = await Rating.find({ bookId });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((total, r) => total + r.rate, 0);
    const avgRating = totalRatings === 0 ? 0 : sumRatings / totalRatings;

    // Update the book's average rating
    book.avgRating = avgRating;
    const [ratingErr, savedBook] = await asyncWrapper(book.save());
    if (ratingErr) {
      if (!ratingErr.statusCode) {
        ratingErr.statusCode = 500;
      }
      return next(ratingErr);
    }

    res.status(201).json({ message: 'Rating added successfully' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
