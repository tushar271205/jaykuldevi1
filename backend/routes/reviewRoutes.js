const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadReview } = require('../config/cloudinary');

router.post('/:productId', protect, uploadReview.array('images', 3), addReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
