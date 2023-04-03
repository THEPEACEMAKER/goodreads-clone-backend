/* eslint-disable linebreak-style */
const express = require('express');
const authRoutes = require('./auth');
const booksRoutes = require('./books');
const reviewsRoutes = require('./reviews');
const categoriesRoutes = require('./categories');
const authorsRoutes = require('./authors');

const router = express.Router();
router.use('/user', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/authors', authorsRoutes);
router.use('/books', booksRoutes);

module.exports = router;
