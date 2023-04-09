const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

router.post('/book', usersController.addToShelf);
router.patch('/:bookId', usersController.updateShelf);
router.delete('/:bookId', usersController.deleteFromShelf);

module.exports = router;
