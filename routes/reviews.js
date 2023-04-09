const express = require('express');
const reviewsController = require('../controllers/reviews');

const router = express.Router();

router.post('/', reviewsController.add);


module.exports = router;