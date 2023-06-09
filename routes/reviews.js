const express = require('express');
const reviewsController = require('../controllers/reviews');
const isAuth = require('../middlewares/isAuth');
const reviewValidation = require('../middlewares/validation/review');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();

router.post('/:bookId', isAuth, reviewValidation.validateAddReviewData, reviewsController.add);
router.delete('/:reviewId', isAuth, reviewsController.delete);
router.patch(
  '/:reviewId',
  reviewValidation.validateUpdateReviewData,
  isAuth,
  reviewsController.update
);
router.get('/:bookId', isLoggedIn, reviewsController.getReviewsByBookId);

module.exports = router;
