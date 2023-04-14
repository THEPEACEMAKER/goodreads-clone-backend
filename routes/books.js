const express = require('express');
const booksController = require('../controllers/books');
const isAuth = require('../middlewares/isAuth');
const validation = require('../middlewares/validation');

const router = express.Router();

router.post('/', isAuth, validation.validateBookData, booksController.add);
router.delete('/:bookId', isAuth, booksController.delete);
router.patch('/:bookId', isAuth, booksController.update);
router.get('/', isAuth, booksController.get);
router.get('/:bookId', isAuth, booksController.getBookById);
module.exports = router;
