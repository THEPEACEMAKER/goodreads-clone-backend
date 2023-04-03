const express = require('express');
const booksController = require('../controllers/books');

const router = express.Router();

router.post('/', booksController.add);
router.delete('/:bookId', booksController.delete);
router.patch('/:bookId', booksController.update);
router.get('/', booksController.get);

module.exports = router;
