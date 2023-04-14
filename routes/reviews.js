const express = require('express');
const reviewsController = require('../controllers/reviews');
const isAuth = require('../middlewares/isAuth');
const reviewValidation = require('../middlewares/validation/review');

const router = express.Router();

router.post('/', isAuth, reviewValidation.validateAddReviewData, reviewsController.add);
router.delete('/:reviewId', reviewsController.delete);
router.patch('/:reviewId', reviewValidation.validateUpdateReviewData, reviewsController.update);
router.get('/:bookId', reviewsController.getReviewsByBookId);

module.exports = router;
