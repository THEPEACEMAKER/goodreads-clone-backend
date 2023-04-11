const express = require('express');
const ratingsController = require('../controllers/ratings');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// POST /ratings/:bookId
router.post('/:bookId', isAuth, ratingsController.addRating);

module.exports = router;
