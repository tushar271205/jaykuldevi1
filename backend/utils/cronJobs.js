const cron = require('node-cron');
const Product = require('../models/Product');

// Run every hour — revert expired discounts
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const expiredProducts = await Product.find({
      'discount.active': true,
      'discount.validUntil': { $lt: now },
    });

    for (const product of expiredProducts) {
      product.discount.active = false;
      product.discountedPrice = product.price;
      await product.save();
      console.log(`⏰ Discount expired for: ${product.name}`);
    }

    if (expiredProducts.length > 0) {
      console.log(`✅ Reverted ${expiredProducts.length} expired discount(s).`);
    }
  } catch (err) {
    console.error('Cron job error (discount expiry):', err.message);
  }
});

console.log('⏱ Discount expiry cron job started.');
