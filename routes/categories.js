const express = require('express');
const categoriesController = require('../controllers/categories');
const isAuth = require('../middlewares/isAuth');
const validation = require('../middlewares/validation');

const router = express.Router();

router.post('/', isAuth, validation.validateCategoryData, categoriesController.add);
router.delete('/:categoryId', isAuth, categoriesController.delete);
router.patch('/:categoryId', isAuth, categoriesController.update);
router.get('/', categoriesController.get);
router.get('/:categoryId/books', categoriesController.getBooksByCategory);
router.get('/:categoryId', categoriesController.getById);
module.exports = router;
