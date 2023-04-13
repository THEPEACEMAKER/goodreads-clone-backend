const express = require('express');
const authorsController = require('../controllers/authors');
const isAuth = require('../middlewares/isAuth');
const validation = require('../middlewares/validation');

const router = express.Router();

router.post('/', isAuth, validation.validateAuthorData, authorsController.add);
router.delete('/:authorId', isAuth, authorsController.delete);
router.patch('/:authorId', isAuth, authorsController.update);
router.get('/', authorsController.get);
router.get('/:authorId', authorsController.getById);
router.get('/:authorId/books', authorsController.getAuthorBooks);
module.exports = router;
