const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleWishlist, addAddress, updateAddress, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
