const express = require('express');
const ratingsController = require('../controllers/ratings');
const isAuth = require('../middlewares/isAuth');
const ratingValidation = require('../middlewares/validation/rating');
const router = express.Router();

// POST /ratings/:bookId
router.post('/:bookId', isAuth, ratingValidation.validateRatingData, ratingsController.addRating);

module.exports = router;
