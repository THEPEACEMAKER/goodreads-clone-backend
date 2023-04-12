const express = require('express');
const authController = require('../controllers/auth');
const rateLimit = require('../utils/rateLimiter');
const router = express.Router();
const Joi = require('joi');

router.post('/login', rateLimit.loginLimiter, authController.login);
router.post('/signup', rateLimit.createAccountLimiter, authController.signup);

module.exports = router;
