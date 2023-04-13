const express = require('express');
const usersController = require('../controllers/users');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

router.post('/book', isAuth, usersController.addToShelf);
router.patch('/:bookId', usersController.updateShelf);
router.delete('/:bookId', usersController.deleteFromShelf);
router.get('/books', isAuth, usersController.getUserBooks);

module.exports = router;
