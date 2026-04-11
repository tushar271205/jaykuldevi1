const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { sendEmail, emailTemplates, getStatusEmailContent } = require('../utils/emailService');
const { generateBillPDF } = require('../utils/pdfGenerator');

const calculateOrderTotal = async (items, couponCode, userId) => {
  let subtotal = 0;
  let discountTotal = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) throw new Error(`Product not available: ${item.productId}`);

    const sizeObj = product.sizes.find(s => s.size === item.size);
    if (!sizeObj || sizeObj.stock < item.quantity) throw new Error(`Size ${item.size} out of stock for ${product.name}`);

    const price = product.price;
    const discountedPrice = product.discountedPrice || price;
    subtotal += discountedPrice * item.quantity;
    discountTotal += (price - discountedPrice) * item.quantity;

    processedItems.push({
      product: product._id,
      productName: product.name,
      productImage: product.images[0]?.url || '',
      size: item.size,
      color: item.color || '',
      quantity: item.quantity,
      price,
      discountedPrice,
    });
  }

  // Coupon discount
  let couponDiscount = 0;
  let couponObj = null;
  if (couponCode) {
    couponObj = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (couponObj) {
      const validity = couponObj.isValid();
      if (validity.valid && !couponObj.usedBy.includes(userId) && subtotal >= couponObj.minOrderValue) {
        if (couponObj.discountType === 'flat') {
          couponDiscount = couponObj.discountValue;
        } else {
          couponDiscount = Math.round(subtotal * couponObj.discountValue / 100);
          if (couponObj.maxDiscountAmount) couponDiscount = Math.min(couponDiscount, couponObj.maxDiscountAmount);
        }
      }
    }
  }

  // First order discount
  const user = await User.findById(userId);
  let firstOrderDiscount = 0;
  if (!user.hasPlacedFirstOrder) {
    firstOrderDiscount = Math.round(subtotal * 0.1); // 10% off first order
  }

  const shippingCharge = subtotal >= 499 ? 0 : 49;
  const finalAmount = Math.max(0, subtotal - couponDiscount - firstOrderDiscount + shippingCharge);

  return { processedItems, subtotal, discountTotal, couponDiscount, couponObj, firstOrderDiscount, shippingCharge, finalAmount };
};

// @POST /api/orders/create-stripe-payment-intent
exports.createStripePaymentIntent = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const { processedItems, subtotal, discountTotal, couponDiscount, couponObj, firstOrderDiscount, shippingCharge, finalAmount } =
      await calculateOrderTotal(items, couponCode, req.user._id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: 'inr',
      metadata: { userId: req.user._id.toString() },
    });

    // Store pending order
    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      couponCode,
      couponDiscount,
      firstOrderDiscount,
      subtotal,
      discountTotal,
      shippingCharge,
      finalAmount,
      statusHistory: [{ status: 'pending', message: 'Order created, awaiting payment.' }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      orderId: order._id,
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      currency: 'INR',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      orderSummary: { subtotal, discountTotal, couponDiscount, firstOrderDiscount, shippingCharge, finalAmount },
    });
  } catch (error) {
    next(error);
  }
};

// @POST /api/orders/confirm-payment
exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId, stripePaymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: `Payment not completed. Status: ${paymentIntent.status}` });
    }

    const order = await Order.findById(orderId).populate('user');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.paymentStatus = 'paid';
    order.stripePaymentId = paymentIntent.latest_charge;
    order.status = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', message: 'Payment received. Order confirmed.' });
    await order.save();

    // Update stock & first order flag
    await _postOrderConfirmation(order);

    res.json({ success: true, message: 'Payment confirmed. Order confirmed!', order });
  } catch (error) {
    next(error);
  }
};

// @POST /api/orders/cod
exports.placeCODOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const { processedItems, subtotal, discountTotal, couponDiscount, couponObj, firstOrderDiscount, shippingCharge, finalAmount } =
      await calculateOrderTotal(items, couponCode, req.user._id);

    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'confirmed',
      couponCode,
      couponDiscount,
      firstOrderDiscount,
      subtotal,
      discountTotal,
      shippingCharge,
      finalAmount,
      statusHistory: [{ status: 'confirmed', message: 'Cash on Delivery order placed.' }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await _postOrderConfirmation(order);
    res.status(201).json({ success: true, message: 'Order placed successfully!', order });
  } catch (error) {
    next(error);
  }
};

const _postOrderConfirmation = async (order) => {
  // Reduce stock
  for (const item of order.items) {
    await Product.findOneAndUpdate(
      { _id: item.product, 'sizes.size': item.size },
      { $inc: { 'sizes.$.stock': -item.quantity } }
    );
  }

  // Mark first order
  await User.findByIdAndUpdate(order.user._id || order.user, { hasPlacedFirstOrder: true });

  // Update coupon usage
  if (order.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: order.couponCode.toUpperCase() },
      { $inc: { usedCount: 1 }, $addToSet: { usedBy: order.user._id || order.user } }
    );
  }

  // Send confirmation email
  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
  if (populatedOrder && populatedOrder.user) {
    const { subject, html } = emailTemplates.orderConfirmed(populatedOrder, populatedOrder.user);
    sendEmail({ to: populatedOrder.user.email, subject, html });
  }
};

// @GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { 
      user: req.user._id,
      status: { $ne: 'pending' } // Exclude abandoned online payment attempts
    };
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (['shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled because it is already ${order.status}.` });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'User requested cancellation';

    // Restore stock
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.product, 'sizes.size': item.size },
        { $inc: { 'sizes.$.stock': item.quantity } }
      );
    }

    if (order.paymentMethod === 'stripe' && order.paymentStatus === 'paid') {
      order.paymentStatus = 'refund_pending';
      order.statusHistory.push({ status: 'cancelled', message: 'Order cancelled. Refund pending admin approval.' });

      // Notify Admin
      const { subject, html } = emailTemplates.adminRefundRequest(order, order.user);
      sendEmail({ to: process.env.EMAIL_FROM, subject, html }); // To Admin

      // Notify User
      const userSubjectAndHtml = getStatusEmailContent('cancelled', order, order.user);
      sendEmail({ to: order.user.email, subject: userSubjectAndHtml.subject, html: userSubjectAndHtml.html });
    } else {
      order.statusHistory.push({ status: 'cancelled', message: 'Order cancelled successfully.' });
      const { subject, html } = getStatusEmailContent('cancelled', order, order.user);
      sendEmail({ to: order.user.email, subject, html });
    }

    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully.', order });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/orders/:id/request-replacement
exports.requestReplacement = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.status !== 'delivered' && order.status !== 'replaced') {
      return res.status(400).json({ success: false, message: 'Only delivered or replaced orders can be replaced or exchanged.' });
    }

    const baseDate = order.replacedAt || order.deliveredAt;
    if (!baseDate) {
      return res.status(400).json({ success: false, message: 'Delivery date unknown. Cannot process replacement.' });
    }

    const daysSinceDelivery = (Date.now() - new Date(baseDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 10) {
      return res.status(400).json({ success: false, message: 'Replacement/exchange window of 10 days has expired.' });
    }

    order.status = 'replacement_requested';
    order.replacementRequestedAt = new Date();
    order.replacementReason = req.body.reason || 'User requested replacement/exchange';
    order.statusHistory.push({ status: 'replacement_requested', message: `Replacement/Exchange requested: ${order.replacementReason}` });

    await order.save();

    // Notify Admin about replacement request
    const { subject, html } = emailTemplates.adminReplacementRequest(order, req.user);
    sendEmail({ to: process.env.EMAIL_FROM, subject, html });

    res.json({ success: true, message: 'Replacement requested successfully.', order });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/orders/:id/approve-refund (Admin)
exports.approveRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.status !== 'cancelled' || order.paymentStatus !== 'refund_pending') {
      return res.status(400).json({ success: false, message: 'Order is not eligible for refund approval.' });
    }

    // Trigger Stripe Refund API
    if (order.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
    }

    order.paymentStatus = 'refunded';
    order.statusHistory.push({ status: 'cancelled', message: 'Refund processed successfully.' });
    await order.save();

    // Notify User
    if (order.user) {
      const { subject, html } = emailTemplates.refundProcessed(order, order.user);
      sendEmail({ to: order.user.email, subject, html });
    }

    res.json({ success: true, message: 'Refund approved and processed.', order });
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders/:id/bill
exports.downloadBill = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const pdfBuffer = await generateBillPDF(order, req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Jay Kuldevi_Bill_${order.orderNumber}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @GET /api/orders (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = { status: { $ne: 'pending' } };
    if (status) filter.status = status;
    if (search) {
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      filter.$or = [{ orderNumber: { $regex: escapeRegex(search), $options: 'i' } }];
    }
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email mobile').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, orders, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/orders/:id/status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, message: message || `Order status updated to ${status}.` });
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'cod') order.paymentStatus = 'paid';
    }
    if (status === 'cancelled') order.cancelledAt = new Date();
    if (status === 'replaced') order.replacedAt = new Date();
    await order.save();

    // Send email notification
    if (order.user) {
      if (status === 'replaced') {
        const pdfBuffer = await generateBillPDF(order, order.user);
        const { subject, html } = emailTemplates.replacementProcessed(order, order.user);
        sendEmail({
          to: order.user.email,
          subject,
          html,
          attachments: [{
            filename: `Jay_Kuldevi_Bill_Replacement_${order.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }]
        });
      } else {
        const { subject, html } = getStatusEmailContent(status, order, order.user);
        sendEmail({ to: order.user.email, subject, html });
      }
    }

    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};
