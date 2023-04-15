const express = require('express');
const categoriesController = require('../controllers/categories');
const isAuth = require('../middlewares/isAuth');
const categoryValidation = require('../middlewares/validation/category');

const router = express.Router();

router.post('/', isAuth, categoryValidation.validateAddCategoryData, categoriesController.add);
router.delete('/:categoryId', isAuth, categoriesController.delete);
router.patch(
  '/:categoryId',
  isAuth,
  categoryValidation.validateUpdateCategoryData,
  categoriesController.update
);
router.get('/', categoriesController.get);
router.get('/:categoryId/books', isAuth, categoriesController.getBooksByCategory);
router.get('/:categoryId', categoriesController.getById);
module.exports = router;
