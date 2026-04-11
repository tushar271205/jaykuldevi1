const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, register, login, refreshToken, logout, getMe, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/reset-password', resetPassword);

module.exports = router;
