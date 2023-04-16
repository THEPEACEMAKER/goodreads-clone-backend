const express = require('express');
const categoriesController = require('../controllers/categories');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const categoryValidation = require('../middlewares/validation/category');

const router = express.Router();

router.post(
  '/',
  isAuth,
  isAdmin,
  categoryValidation.validateAddCategoryData,
  categoriesController.add
);
router.delete('/:categoryId', isAuth, isAdmin, categoriesController.delete);
router.patch(
  '/:categoryId',
  isAuth,
  isAdmin,
  categoryValidation.validateUpdateCategoryData,
  categoriesController.update
);
router.get('/', categoriesController.get);
router.get('/:categoryId/books', isAuth, categoriesController.getBooksByCategory);
router.get('/:categoryId', categoriesController.getById);
module.exports = router;
