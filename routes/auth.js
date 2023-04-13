const express = require('express');
const authController = require('../controllers/auth');
const rateLimit = require('../utils/rateLimiter');
const router = express.Router();
const validation = require('../middlewares/validation');

router.post('/login', validation.validateLogin, rateLimit.loginLimiter, authController.login);
router.post(
  '/signup',
  validation.validateSignup,
  rateLimit.createAccountLimiter,
  authController.signup
);

module.exports = router;
