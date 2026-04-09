const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, placeCODOrder, getMyOrders, getOrderById, downloadBill, getAllOrders, updateOrderStatus, cancelOrder, approveRefund, requestReplacement } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/cod', protect, placeCODOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id/bill', protect, downloadBill);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/request-replacement', protect, requestReplacement);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/approve-refund', protect, adminOnly, approveRefund);

module.exports = router;
