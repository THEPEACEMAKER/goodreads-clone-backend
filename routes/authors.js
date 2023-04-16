const express = require('express');
const authorsController = require('../controllers/authors');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const authorValidation = require('../middlewares/validation/author');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();

router.post('/', isAuth, isAdmin, authorValidation.validateAddAuthorData, authorsController.add);
router.delete('/:authorId', isAuth, isAdmin, authorsController.delete);
router.patch(
  '/:authorId',
  authorValidation.validateUpdateAuthorData,
  isAuth,
  isAdmin,
  authorsController.update
);
router.get('/', authorsController.get);
router.get('/popular', authorsController.getPopularAuthors);
router.get('/:authorId', authorsController.getById);
router.get('/:authorId/books', isLoggedIn, authorsController.getAuthorBooks);
module.exports = router;
