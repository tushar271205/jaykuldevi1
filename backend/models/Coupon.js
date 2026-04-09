const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['flat', 'percent'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number }, // cap for percent discounts
    minOrderValue: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    maxUses: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    applicableTo: { type: String, enum: ['all', 'boys', 'girls', 'first_order'], default: 'all' },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function () {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'This coupon is no longer active.' };
  if (now < this.validFrom) return { valid: false, message: 'This coupon is not yet active.' };
  if (now > this.validUntil) return { valid: false, message: 'This coupon has expired.' };
  if (this.maxUses !== null && this.usedCount >= this.maxUses)
    return { valid: false, message: 'This coupon has reached its usage limit.' };
  return { valid: true };
};

module.exports = mongoose.model('Coupon', couponSchema);
