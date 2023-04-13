const express = require('express');
const ratingsController = require('../controllers/ratings');
const isAuth = require('../middlewares/isAuth');
const validation = require('../middlewares/validation');
const router = express.Router();

// POST /ratings/:bookId
router.post('/:bookId', isAuth, validation.validateRatingData, ratingsController.addRating);

module.exports = router;
