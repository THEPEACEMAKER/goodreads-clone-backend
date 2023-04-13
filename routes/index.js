/* eslint-disable linebreak-style */
const express = require('express');
const authRoutes = require('./auth');
const booksRoutes = require('./books');
const reviewsRoutes = require('./reviews');
const categoriesRoutes = require('./categories');
const authorsRoutes = require('./authors');
const usersRoutes = require('./users');
const ratingsRoutes = require('./ratings');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/categories', categoriesRoutes);
router.use('/authors', authorsRoutes);
router.use('/books', booksRoutes);
router.use('/user', usersRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/ratings', ratingsRoutes);

module.exports = router;
