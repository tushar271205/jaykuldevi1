const User = require('../models/User');

// Strong password validation (must match frontend rules)
const validateStrongPassword = (password) => {
  if (!password || password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter (A-Z).';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter (a-z).';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number (0-9).';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character (!@#$%...)';
  return null;
};

// @GET /api/users/profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, user });
};

// @PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, mobile, gender, password, currentPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (gender !== undefined) user.gender = gender;

    if (password) {
      const pwError = validateStrongPassword(password);
      if (pwError) return res.status(400).json({ success: false, message: pwError });
      // Require current password verification when changing password
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      user.password = password;
    }

    await user.save();

    // Don't send password back
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, message: 'Profile updated.', user: userObj });
  } catch (error) { next(error); }
};


// @POST /api/users/wishlist/:productId
exports.toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ success: true, message: 'Removed from wishlist.', inWishlist: false });
    }
    user.wishlist.push(productId);
    await user.save();
    res.json({ success: true, message: 'Added to wishlist.', inWishlist: true });
  } catch (error) { next(error); }
};

// @POST /api/users/addresses
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, message: 'Address added.', addresses: user.addresses });
  } catch (error) { next(error); }
};

// @PUT /api/users/addresses/:addressId
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
    if (req.body.isDefault) user.addresses.forEach(a => (a.isDefault = false));
    Object.assign(address, req.body);
    await user.save();
    res.json({ success: true, message: 'Address updated.', addresses: user.addresses });
  } catch (error) { next(error); }
};

// @DELETE /api/users/addresses/:addressId
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, message: 'Address deleted.', addresses: user.addresses });
  } catch (error) { next(error); }
};
