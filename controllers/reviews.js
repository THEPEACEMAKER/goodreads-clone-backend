const asyncWrapper = require('../utils/asyncWrapper');
const Reviews = require('../models/review');
const Book = require('../models/book');
const User = require('../models/user');




// exports.add = async (req, res, next) => {
//     const { title, content, rating, userId, bookId } = req.body;
  
//     try {
//       const book = await Book.findById(bookId);
//       const user = await User.findById(userId);
  
//       if (!book) {
//         return res.status(404).json({ message: 'book not found' });
//       }
  
//       if (!user) {
//         return res.status(404).json({ message: 'user not found' });
//       }
  
//       const review = new Reviews({
//         title,
//         content,
//         rating,
//         user: userId,
//         book: bookId,
//       });
  
//       const savedReview = await review.save();
  
//       res.status(201).json({
//         message: 'Review Added Successfully!',
//         review: savedReview,
//       });
//     } catch (err) {
//       next(err);
//     }
//   };


exports.add = async (req, res, next) => {
    const { title, content, rating, userId, bookId } = req.body;
    
    try {
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);
        if (!book) {
          const error = new Error('book not found');
          error.statusCode = 404;
          return next(error);
        }
    
        if (!user) {
          const error = new Error('user not found');
          error.statusCode = 404;
          return next(error);
        }
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
          return next(err);
        }
      }

    const reviews = new Reviews({
        title,
        content,
        rating,
        user: userId,
        book: bookId,
    });

    const [reviewErr, reviewData] = await asyncWrapper(reviews.save());
    if (reviewErr) {
        if (!reviewErr.statusCode) {
        reviewErr.statusCode = 500;
        }
        return next(reviewErr);
    }
    res.status(201).json({ message: 'Review Added Successfully!', review: reviewData });



};




    // db.query(query)
    //   .then(() => {
    //     res.sendStatus(201);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     res.sendStatus(500);
    //   });


