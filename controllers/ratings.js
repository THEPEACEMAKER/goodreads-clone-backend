const asyncWrapper = require('../utils/asyncWrapper');
const Rating = require('../models/rating');
const Author = require('../models/author');
const Category = require('../models/category');
const Book = require('../models/book');

exports.addRating = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const { rate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.status = 404;
      throw error;
    }

    const existingRating = await Rating.findOne({ userId, bookId });
    let rating;

    if (existingRating) {
      // Update existing rating
      existingRating.rate = rate;
      rating = existingRating;
      isNewRating = false;
    } else {
      // Create new rating
      rating = new Rating({ rate, userId, bookId });
      isNewRating = true;
    }

    const [savedRating, savedAuthor, savedCategory, savedBook] = await Promise.all([
      rating.save(),
      updateAuthorCategoryRatings(book, isNewRating),
      updateBook(book, isNewRating),
    ]);

    res.status(201).json({ message: 'Rating added successfully' });
  } catch (err) {
    next(err);
  }
};

async function updateAuthorCategoryRatings(book, isNewRating) {
  if (!isNewRating) {
    return Promise.resolve();
  }

  const [author, category] = await Promise.all([
    Author.findById(book.author),
    Category.findById(book.category),
  ]);

  author.ratingsCount += 1;
  category.ratingsCount += 1;

  return Promise.all([author.save(), category.save()]);
}

async function updateBook(book, isNewRating) {
  const ratings = await Rating.find({ bookId: book._id });
  const totalRatings = ratings.length;
  const sumRatings = ratings.reduce((total, r) => total + r.rate, 0);
  const avgRating = totalRatings === 0 ? 0 : sumRatings / totalRatings;

  book.avgRating = avgRating;

  if (isNewRating) {
    book.ratingsCount += 1;
  }

  return book.save();
}
