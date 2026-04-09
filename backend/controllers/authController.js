const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @POST /api/auth/send-otp
exports.sendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'register' } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (purpose === 'login') {
      if (!existingUser || !existingUser.isVerified) {
        return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
      }
    } else if (purpose === 'register') {
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please login instead.' });
      }
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email: email.toLowerCase(), purpose });
    const hashedOtp = await bcrypt.hash(otp, 10);
    await OTP.create({ email: email.toLowerCase(), otp: hashedOtp, purpose });

    const { subject, html } = emailTemplates.otp(otp, purpose);
    await sendEmail({ to: email, subject, html });

    res.json({ success: true, message: `OTP sent to ${email}. Valid for 10 minutes.` });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose = 'register' } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required.' });

    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), purpose });
    if (!otpRecord) return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new OTP.' });

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) return res.status(400).json({ success: false, message: 'Invalid OTP.' });

    await OTP.deleteMany({ email: email.toLowerCase(), purpose });

    // Return a short-lived temp token for completing registration
    const tempToken = jwt.sign({ email: email.toLowerCase(), purpose, verified: true }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });

    res.json({ success: true, message: 'OTP verified.', tempToken });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { tempToken, name, mobile, password, gender } = req.body;
    if (!tempToken || !name || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_ACCESS_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Session expired. Please verify OTP again.' });
    }

    if (!decoded.verified || decoded.purpose !== 'register') {
      return res.status(401).json({ success: false, message: 'Invalid session.' });
    }

    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    let user = existingUser || new User({ email: decoded.email });
    user.name = name;
    user.mobile = mobile;
    user.password = password;
    user.gender = gender || '';
    user.isVerified = true;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = await bcrypt.hash(refreshToken, 8);
    await user.save({ validateBeforeSave: false });

    const { subject, html } = emailTemplates.welcome(name);
    sendEmail({ to: decoded.email, subject, html });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user || !user.isVerified) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = await bcrypt.hash(refreshToken, 8);
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required.' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) return res.status(401).json({ success: false, message: 'User not found.' });

    const newAccessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name brand images price discountedPrice sizes colors ratings numReviews');
  res.json({ success: true, user });
};
