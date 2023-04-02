const express = require('express');
const categoriesController = require('../controllers/categories');

const router = express.Router();

router.post('/', categoriesController.add);
router.delete('/:categoryId', categoriesController.delete);
router.patch('/:categoryId', categoriesController.update);
router.get('/', categoriesController.get);

module.exports = router;
