const express = require('express');
const router = express.Router();
const { getProducts, getSearchSuggestions, getProduct, createProduct, updateProduct, setDiscount, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/search-suggestions', getSearchSuggestions);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, uploadProduct.array('images', 6), createProduct);
router.put('/:id', protect, adminOnly, uploadProduct.array('images', 6), updateProduct);
router.put('/:id/discount', protect, adminOnly, setDiscount);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
