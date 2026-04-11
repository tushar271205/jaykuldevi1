const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments({ status: { $nin: ['cancelled', 'pending'] } }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$finalAmount' } } }]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
    ]);

    const recentOrders = await Order.find({ status: { $ne: 'pending' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts,
      },
      recentOrders,
    });
  } catch (error) { next(error); }
};

// @GET /api/admin/reports/revenue
exports.getRevenueReport = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;

    const matchStage = { paymentStatus: 'paid' };

    if (month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      matchStage.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      matchStage.createdAt = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31T23:59:59`) };
    }

    const monthlyRevenue = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$finalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.productName' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.discountedPrice', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({ success: true, monthlyRevenue, topProducts, year: Number(year), month: month ? Number(month) : undefined });
  } catch (error) {
    next(error);
  }
};

// @GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {}; // Show all roles, not just customers
    if (search) {
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const searchRegex = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-password -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, users, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) { next(error); }
};

// @PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ success: true, message: `User role updated to ${role}` });
  } catch (error) { next(error); }
};

