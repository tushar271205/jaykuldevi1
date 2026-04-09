const mongoose = require('mongoose');
const Order = require('./backend/models/Order');
require('dotenv').config({ path: './backend/.env' });

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jay-kuldevi');
    console.log('Connected to DB');
    
    const count = await Order.countDocuments();
    console.log('Total Orders:', count);
    
    const paidCount = await Order.countDocuments({ paymentStatus: 'paid' });
    console.log('Paid Orders:', paidCount);
    
    const sample = await Order.findOne().sort({ createdAt: -1 });
    console.log('Latest Order Sample:', JSON.stringify(sample, null, 2));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkOrders();
