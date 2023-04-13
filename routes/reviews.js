const express = require('express');
const reviewsController = require('../controllers/reviews');
const isAuth = require('../middlewares/isAuth');
const validation = require('../middlewares/validation');

const router = express.Router();

router.post('/', isAuth, validation.validateReviewData, reviewsController.add);
router.delete('/:reviewId', reviewsController.delete);
router.patch('/:reviewId', reviewsController.update);
router.get('/:bookId', reviewsController.getReviewsByBookId);

module.exports = router;
