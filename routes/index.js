/* eslint-disable linebreak-style */
const express = require('express');
const usersRoutes = require('./users');
const booksRoutes = require('./books');
const reviewsRoutes = require('./reviews');
const categoriesRoutes = require('./categories');
const authorsRoutes = require('./authors');

const router = express.Router();

module.exports = router;
