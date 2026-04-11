const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  size: { type: String, required: true },
  color: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refund_pending', 'refunded'], default: 'pending' },
    stripePaymentIntentId: { type: String },
    stripePaymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'replacement_requested', 'replaced'],
      default: 'pending',
    },
    statusHistory: [statusHistorySchema],
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
    firstOrderDiscount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    billUrl: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    replacementReason: { type: String },
    replacementRequestedAt: { type: Date },
    replacedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `KW${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
