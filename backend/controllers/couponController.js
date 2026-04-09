const Coupon = require('../models/Coupon');

// @GET /api/coupons (Admin)
exports.getAllCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [coupons, total] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Coupon.countDocuments(),
    ]);

    res.json({ success: true, coupons, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

// @POST /api/coupons (Admin)
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) { next(error); }
};

// @PUT /api/coupons/:id (Admin)
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon updated.', coupon });
  } catch (error) { next(error); }
};

// @DELETE /api/coupons/:id (Admin)
exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (error) { next(error); }
};

// @POST /api/coupons/validate (User)
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code.' });

    const validity = coupon.isValid();
    if (!validity.valid) return res.status(400).json({ success: false, message: validity.message });

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon.' });
    }

    if (orderAmount < coupon.minOrderValue) {
      return res.status(400).json({ success: false, message: `Minimum order value of ₹${coupon.minOrderValue} required.` });
    }

    let discount = 0;
    if (coupon.discountType === 'flat') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round(orderAmount * coupon.discountValue / 100);
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    }

    res.json({ success: true, message: `Coupon applied! You save ₹${discount}`, discount, coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue } });
  } catch (error) { next(error); }
};

// @GET /api/coupons/active (Public - for homepage display)
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ isActive: true, validFrom: { $lte: now }, validUntil: { $gte: now } })
      .select('code description discountType discountValue minOrderValue');
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};
