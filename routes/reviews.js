const express = require('express');
const reviewsController = require('../controllers/reviews');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/', isAuth, reviewsController.add);
router.delete('/:reviewId', isAuth, reviewsController.delete);
router.patch('/:reviewId', isAuth, reviewsController.update);

module.exports = router;
