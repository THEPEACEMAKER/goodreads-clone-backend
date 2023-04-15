const express = require('express');
const booksController = require('../controllers/books');
const isAuth = require('../middlewares/isAuth');
const bookValidation = require('../middlewares/validation/book');

const router = express.Router();

router.post('/', isAuth, bookValidation.validateAddBookData, booksController.add);
router.delete('/:bookId', isAuth, booksController.delete);
router.patch('/:bookId', bookValidation.validateUpdateBookData, isAuth, booksController.update);
router.get('/', isAuth, booksController.get);
router.get('/search', booksController.searchBooksByName);
router.get('/:bookId', isAuth, booksController.getBookById);
module.exports = router;
