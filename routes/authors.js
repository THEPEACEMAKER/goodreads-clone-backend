const express = require('express');
const authorsController = require('../controllers/authors');

const router = express.Router();

router.post('/', authorsController.add);
router.delete('/:authorId', authorsController.delete);
router.patch('/:authorId', authorsController.update);
router.get('/', authorsController.get);
router.get('/:authorId', authorsController.getById);

module.exports = router;