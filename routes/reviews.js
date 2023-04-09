const express = require('express');
const reviewsController = require('../controllers/reviews');

const router = express.Router();

router.post('/', reviewsController.add);
router.delete('/:reviewId', reviewsController.delete);
router.patch('/:reviewId', reviewsController.update);

module.exports = router;