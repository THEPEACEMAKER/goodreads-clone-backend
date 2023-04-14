const express = require('express');
const authController = require('../controllers/auth');
const rateLimit = require('../utils/rateLimiter');
const router = express.Router();
const authValidation = require('../middlewares/validation/auth');

router.post('/login', authValidation.validateLogin, rateLimit.loginLimiter, authController.login);
router.post(
  '/signup',
  authValidation.validateSignup,
  rateLimit.createAccountLimiter,
  authController.signup
);

module.exports = router;
