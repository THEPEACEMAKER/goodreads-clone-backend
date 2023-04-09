const express = require('express');
const booksController = require('../controllers/books');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/', isAuth, booksController.add);
router.delete('/:bookId', isAuth, booksController.delete);
router.patch('/:bookId', isAuth, booksController.update);
router.get('/', booksController.get);

module.exports = router;
