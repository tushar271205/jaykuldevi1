const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @POST /api/reviews
exports.addReview = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { orderId, rating, title, comment } = req.body;
    const photos = req.files ? req.files.map(f => f.path) : [];

    // Check if user actually bought this product
    const order = await Order.findOne({ _id: orderId, user: req.user._id, 'items.product': productId, status: 'delivered' });
    const isVerifiedPurchase = !!order;

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });

    const review = await Review.create({
      product: productId, user: req.user._id, order: orderId,
      rating: Number(rating), title, comment, photos, isVerifiedPurchase,
    });

    // Update product rating
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avg * 10) / 10,
      numReviews: stats[0].count,
    });

    res.status(201).json({ success: true, message: 'Review added.', review });
  } catch (error) { next(error); }
};

// @GET /api/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId }).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Review.countDocuments({ product: req.params.productId }),
    ]);
    res.json({ success: true, reviews, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

// @DELETE /api/reviews/:id (Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (error) { next(error); }
};
