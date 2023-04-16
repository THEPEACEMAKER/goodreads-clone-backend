const express = require('express');
const booksController = require('../controllers/books');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const bookValidation = require('../middlewares/validation/book');

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
router.get('/', isAuth, booksController.get);
router.get('/search', booksController.searchBooksByName);
router.get('/popular', booksController.getPopularBooks);
router.get('/:bookId', isAuth, booksController.getBookById);
module.exports = router;
