const express = require('express');
const usersController = require('../controllers/users');
const isAuth = require('../middlewares/isAuth');
const shelfValidation = require('../middlewares/validation/shelf');

const router = express.Router();

router.post('/book', isAuth, shelfValidation.validateShelfData, usersController.addToShelf);
router.get('/books', isAuth, usersController.getUserBooks);

module.exports = router;
