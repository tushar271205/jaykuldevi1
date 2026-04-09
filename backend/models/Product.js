const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
});

const discountSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  percent: { type: Number, min: 0, max: 100 },
  flatAmount: { type: Number, min: 0 },
  type: { type: String, enum: ['percent', 'flat'] },
  validUntil: { type: Date },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: { type: String, enum: ['boys', 'girls', 'unisex'], required: true },
    subCategory: {
      type: String,
      enum: ['t-shirts', 'shirts', 'dresses', 'frocks', 'pants', 'jeans', 'shorts', 'kurtas', 'sets', 'jackets', 'winterwear', 'nightwear', 'swimwear', 'ethnic', 'accessories'],
      required: true,
    },
    description: { type: String, required: true },
    brand: { type: String, default: 'Jay Kuldevi' },
    images: [
      {
        url: { type: String, required: true },
        color: { type: String, default: '' },
      },
    ],
    colors: [{ type: String }],
    sizes: [sizeStockSchema],
    ageGroup: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    discount: { type: discountSchema, default: {} },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    material: { type: String },
    washCare: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTopPick: { type: Boolean, default: false },
    isBudgetBuy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

// Auto-compute discountedPrice on save
productSchema.pre('save', function (next) {
  if (this.discount && this.discount.active) {
    if (this.discount.type === 'percent') {
      this.discountedPrice = Math.round(this.price * (1 - this.discount.percent / 100));
    } else if (this.discount.type === 'flat') {
      this.discountedPrice = Math.max(0, this.price - this.discount.flatAmount);
    }
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
