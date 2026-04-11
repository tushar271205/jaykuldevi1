const express = require('express');
const router = express.Router();
const { getDashboard, getRevenueReport, getUsers, deleteUser, updateUserRole } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/reports/revenue', getRevenueReport);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
