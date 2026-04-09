const express = require('express');
const router = express.Router();
const { getDashboard, getRevenueReport, getUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/reports/revenue', getRevenueReport);
router.get('/users', getUsers);

module.exports = router;
