const express = require('express');
const authorsController = require('../controllers/authors');
const isAuth = require('../middlewares/isAuth');
const authorValidation = require('../middlewares/validation/author');

const router = express.Router();

router.post('/', isAuth, authorValidation.validateAddAuthorData, authorsController.add);
router.delete('/:authorId', isAuth, authorsController.delete);
router.patch(
  '/:authorId',
  authorValidation.validateUpdateAuthorData,
  isAuth,
  authorsController.update
);
router.get('/', authorsController.get);
router.get('/:authorId', authorsController.getById);
router.get('/:authorId/books', isAuth, authorsController.getAuthorBooks);
module.exports = router;
