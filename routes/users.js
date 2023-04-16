const express = require('express');
const usersController = require('../controllers/users');
const isLoggedIn = require('../middlewares/isLoggedIn');
const shelfValidation = require('../middlewares/validation/shelf');

const router = express.Router();

router.post('/book', isLoggedIn, shelfValidation.validateShelfData, usersController.addToShelf);
router.get('/books', isLoggedIn, usersController.getUserBooks);

module.exports = router;
