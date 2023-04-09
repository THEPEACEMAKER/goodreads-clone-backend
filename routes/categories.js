const express = require('express');
const categoriesController = require('../controllers/categories');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

router.post('/', isAuth, categoriesController.add);
router.delete('/:categoryId', isAuth, categoriesController.delete);
router.patch('/:categoryId', isAuth, categoriesController.update);
router.get('/', categoriesController.get);
router.get('/:categoryId', categoriesController.getById);

module.exports = router;
