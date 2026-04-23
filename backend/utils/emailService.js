// Initialize Brevo API key
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Log email config status on startup
console.log('[Email] Config check — BREVO_API_KEY:', BREVO_API_KEY ? '✅ set' : '❌ MISSING');

const sendEmail = async ({ to, subject, html, attachments }) => {
  if (!BREVO_API_KEY) {
    const errMsg = 'Email service not configured. BREVO_API_KEY is required.';
    console.error('[Email] ' + errMsg);
    throw new Error(errMsg);
  }

  try {
    // Format attachments for Brevo (Requires base64 string for content)
    const brevoAttachments = attachments ? attachments.map(att => ({
      name: att.filename,
      content: Buffer.isBuffer(att.content) ? att.content.toString('base64') : att.content
    })) : undefined;

    // The sender email MUST be the one verified on your Brevo account.
    const senderEmail = process.env.EMAIL_USER || 'tmakwana585@gmail.com';

    let cleanToEmail = to;
    let cleanToName = undefined;

    // Parse "Name <email@example.com>" format
    if (typeof to === 'string' && to.includes('<') && to.includes('>')) {
      const match = to.match(/(.*)<(.*)>/);
      if (match) {
        cleanToName = match[1].trim();
        cleanToEmail = match[2].trim();
      }
    }

    const payload = {
      sender: {
        name: 'Jay Kuldevi',
        email: senderEmail
      },
      to: [
        { email: cleanToEmail, ...(cleanToName && { name: cleanToName }) }
      ],
      subject: subject,
      htmlContent: html,
      attachment: brevoAttachments,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Email] ❌ Send failed to:', to, '| Brevo API Error:', data);
      throw new Error(data.message || 'Failed to send email via Brevo');
    }

    console.log('[Email] ✅ Sent to:', to, '| Message Ids:', data.messageId);
  } catch (error) {
    console.error('[Email] ❌ Send failed to:', to, '| System Error:', error.message);
    throw error;
  }
};

const emailTemplates = {
  otp: (otp, purpose) => ({
    subject: `Your Jay Kuldevi OTP - ${otp}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#03045e;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0">Your OTP for ${purpose}</p>
        </div>
        <div style="padding:40px;text-align:center">
          <p style="color:#555;font-size:16px">Use the OTP below to ${purpose === 'register' ? 'create your account' : 'login to your account'}:</p>
          <div style="background:#f8f8f8;border:2px dashed #62b6cb;border-radius:12px;padding:24px;margin:24px 0">
            <span style="font-size:32px;font-weight:900;letter-spacing:12px;color:#1b4965">${otp}</span>
          </div>
          <p style="color:#888;font-size:14px">⏱ This OTP is valid for <strong>10 minutes</strong></p>
          <p style="color:#888;font-size:14px">Never share your OTP with anyone.</p>
        </div>
        <div style="background:#f8f8f8;padding:20px;text-align:center">
          <p style="color:#aaa;font-size:12px;margin:0">© 2026 Jay Kuldevi. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcome: (name) => ({
    subject: `Welcome to Jay Kuldevi, ${name}! 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#333">Hey ${name}! Welcome aboard! 🎉</h2>
          <p style="color:#555;line-height:1.6">We're thrilled to have you at Jay Kuldevi — your one-stop destination for adorable kids' clothing!</p>
          <p style="color:#555;line-height:1.6">🛍️ Browse our latest collections for boys & girls<br>
          💳 Easy payments with Card, Net Banking & more<br>
          📦 Track your orders in real-time<br>
          🎁 Enjoy exclusive discounts just for you!</p>
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  orderConfirmed: (order, user) => ({
    subject: `Order #${order.orderNumber} Confirmed! 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0">Order Confirmed!</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#333">Hi ${user.name}, your order is confirmed! ✅</h2>
          <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p style="margin:0 0 8px"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p style="margin:0 0 8px"><strong>Total Amount:</strong> ₹${order.finalAmount}</p>
            <p style="margin:0"><strong>Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '5-7 business days'}</p>
          </div>
          <h3 style="color:#333">Items Ordered:</h3>
          ${order.items.map(item => `
            <div style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid #eee">
              <div>
                <p style="margin:0;font-weight:bold;color:#333">${item.productName}</p>
                <p style="margin:4px 0 0;color:#888;font-size:14px">Size: ${item.size} | Qty: ${item.quantity}</p>
                <p style="margin:4px 0 0;color:#1b4965;font-weight:bold">₹${item.discountedPrice} × ${item.quantity} = ₹${item.discountedPrice * item.quantity}</p>
              </div>
            </div>
          `).join('')}
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  orderStatus: (order, user, statusMessage, statusIcon) => ({
    subject: `${statusIcon} Order #${order.orderNumber} - ${statusMessage}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:18px">${statusIcon} ${statusMessage}</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#333">Hi ${user.name}!</h2>
          <p style="color:#555;font-size:16px">Your order <strong>#${order.orderNumber}</strong> is now <strong>${statusMessage}</strong>.</p>
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  adminReplacementRequest: (order, user) => ({
    subject: `⚠️ Replacement/Exchange Requested - Order #${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#f59e0b;padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Admin Alert: Replacement Requested</h1>
        </div>
        <div style="padding:40px">
          <p style="color:#333;font-size:16px">Customer <strong>${user.name}</strong> (${user.email}) has requested a replacement/exchange for a delivered order.</p>
          <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p style="margin:0"><strong>Reason:</strong> ${order.replacementReason}</p>
          </div>
          <p style="color:#555;font-size:14px">Please log in to the admin dashboard to review and manage this request.</p>
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  adminRefundRequest: (order, user) => ({
    subject: `⚠️ Refund Request Pending - Order #${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:#ff4d4f;padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Admin Alert: Refund Request</h1>
        </div>
        <div style="padding:40px">
          <p style="color:#333;font-size:16px">Customer <strong>${user.name}</strong> (${user.email}) has cancelled an online-paid order and is requesting a refund.</p>
          <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p style="margin:0 0 8px"><strong>Refund Amount:</strong> ₹${order.finalAmount}</p>
            <p style="margin:0"><strong>Payment Intent ID:</strong> ${order.stripePaymentIntentId}</p>
          </div>
          <p style="color:#555;font-size:14px">Please log in to the admin dashboard to review and approve this refund.</p>
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  replacementProcessed: (order, user) => ({
    subject: `✅ Replacement Completed - New Bill Attached - Order #${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:18px">✅ Replacement Completed</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#333">Hi ${user.name},</h2>
          <p style="color:#555;font-size:16px">Your replacement request for order <strong>#${order.orderNumber}</strong> has been fully processed and completed! We hope you love your new item.</p>
          <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px; font-weight: bold; color: #1b4965;">A new 10-Day Return/Exchange window has started from today.</p>
          </div>
          <p style="color:#555;font-size:16px; font-weight: bold;">We have securely attached your updated Order Bill to this email for your records.</p>
          <div style="text-align:center;margin:32px 0">
          </div>
        </div>
      </div>
    `,
  }),

  refundProcessed: (order, user) => ({
    subject: `💸 Refund Processed - Order #${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:18px">💸 Refund Processed</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#333">Hi ${user.name},</h2>
          <p style="color:#555;font-size:16px">Your refund for the cancelled order <strong>#${order.orderNumber}</strong> has been successfully processed by our team.</p>
          <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0">
            <p style="margin:0 0 8px"><strong>Refund Amount:</strong> ₹${order.finalAmount}</p>
          </div>
          <p style="color:#555;font-size:16px">The amount will be credited back to your original payment method in <strong>2-3 business days</strong> depending on your bank.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (name, resetUrl) => ({
    subject: `🔐 Reset Your Jay Kuldevi Password`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#1b4965,#62b6cb);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">👕 Jay Kuldevi</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0">Password Reset Request</p>
        </div>
        <div style="padding:40px;text-align:center">
          <h2 style="color:#333;margin:0 0 16px">Hi ${name}! 👋</h2>
          <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 32px">
            We received a request to reset your password. Click the button below to choose a new password. This link is valid for <strong>30 minutes</strong>.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#1b4965,#62b6cb);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;box-shadow:0 4px 15px rgba(27,73,101,0.4)">
            🔐 Reset My Password
          </a>
          <p style="color:#888;font-size:13px;margin:32px 0 0">
            Or copy and paste this link in your browser:<br/>
            <a href="${resetUrl}" style="color:#1b4965;word-break:break-all">${resetUrl}</a>
          </p>
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:16px;margin:24px 0;text-align:left">
            <p style="margin:0;color:#856404;font-size:14px">⚠️ <strong>Security Notice:</strong> If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
          </div>
          <p style="color:#aaa;font-size:12px">This link expires in 30 minutes for your security.</p>
        </div>
        <div style="background:#f8f8f8;padding:20px;text-align:center">
          <p style="color:#aaa;font-size:12px;margin:0">© 2026 Jay Kuldevi. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};


const getStatusEmailContent = (status, order, user) => {
  const statusMap = {
    confirmed: { message: 'Order Confirmed', icon: '✅' },
    processing: { message: 'Being Processed', icon: '⚙️' },
    shipped: { message: 'Shipped', icon: '🚚' },
    out_for_delivery: { message: 'Out for Delivery', icon: '📦' },
    delivered: { message: 'Delivered', icon: '🎉' },
    cancelled: { message: 'Order Cancelled', icon: '❌' },
  };
  const { message, icon } = statusMap[status] || { message: status, icon: '📋' };
  return emailTemplates.orderStatus(order, user, message, icon);
};

module.exports = { sendEmail, emailTemplates, getStatusEmailContent };
