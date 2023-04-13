const express = require('express');
const reviewsController = require('../controllers/reviews');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/', isAuth, reviewsController.add);
router.delete('/:reviewId', reviewsController.delete);
router.patch('/:reviewId',  reviewsController.update);
router.get('/:bookId', reviewsController.getReviewsByBookId);

module.exports = router;
