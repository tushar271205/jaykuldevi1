const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'login', 'reset', 'reset-password'], default: 'register' },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min TTL
});

module.exports = mongoose.model('OTP', otpSchema);
