const express = require('express');
const booksController = require('../controllers/books');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const bookValidation = require('../middlewares/validation/book');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();

router.post('/', isAuth, isAdmin, bookValidation.validateAddBookData, booksController.add);
router.delete('/:bookId', isAuth, isAdmin, booksController.delete);
router.patch(
  '/:bookId',
  bookValidation.validateUpdateBookData,
  isAuth,
  isAdmin,
  booksController.update
);
router.get('/', isLoggedIn, booksController.get);
router.get('/search', booksController.searchBooksByName);
router.get('/popular', isLoggedIn, booksController.getPopularBooks);
router.get('/:bookId', isLoggedIn, booksController.getBookById);
module.exports = router;
