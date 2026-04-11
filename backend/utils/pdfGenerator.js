const PDFDocument = require('pdfkit');

const generateBillPDF = (order, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.rect(0, 0, 612, 120).fill('#FF6B9D');
    doc.fillColor('#ffffff')
      .fontSize(28).font('Helvetica-Bold').text('Jay Kuldevi', 50, 35)
      .fontSize(12).font('Helvetica').text('Your Kids Fashion Destination', 50, 68)
      .fontSize(10).text('www.jaykuldevi.com | support@jaykuldevi.com', 50, 85);

    doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold')
      .text('TAX INVOICE', 400, 45, { align: 'right' })
      .fontSize(10).font('Helvetica')
      .text(`Invoice #: ${order.orderNumber}`, 400, 65, { align: 'right' })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 80, { align: 'right' });

    // Customer Info
    doc.moveDown(4).fillColor('#333333');
    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 145);
    doc.fontSize(10).font('Helvetica')
      .fillColor('#555555')
      .text(order.shippingAddress.fullName, 50, 162)
      .text(order.shippingAddress.addressLine1, 50, 177)
      .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 50, 192)
      .text(`Mobile: ${order.shippingAddress.mobile}`, 50, 207)
      .text(`Email: ${user.email}`, 50, 222);

    // Order Details
    doc.fontSize(10).fillColor('#333333')
      .text(`Order #: ${order.orderNumber}`, 350, 162)
      .text(`Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}`, 350, 177)
      .text(`Status: ${order.status.replace(/_/g, ' ').toUpperCase()}`, 350, 192);

    // Table Header
    const tableTop = 260;
    doc.rect(50, tableTop, 512, 28).fill('#FF6B9D');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
      .text('Product', 60, tableTop + 8)
      .text('Size', 280, tableTop + 8)
      .text('Qty', 340, tableTop + 8)
      .text('Price', 390, tableTop + 8)
      .text('Total', 470, tableTop + 8);

    // Table Rows
    let y = tableTop + 36;
    order.items.forEach((item, idx) => {
      if (idx % 2 === 0) doc.rect(50, y - 6, 512, 28).fill('#fff5f8');
      doc.fillColor('#333333').font('Helvetica').fontSize(9)
        .text(item.productName, 60, y, { width: 210 })
        .text(item.size, 280, y)
        .text(item.quantity.toString(), 340, y)
        .text(`₹${item.discountedPrice}`, 390, y)
        .text(`₹${item.discountedPrice * item.quantity}`, 470, y);
      y += 32;
    });

    // Totals
    y += 10;
    doc.rect(350, y, 212, 1).fill('#eee');
    y += 10;

    const addTotalRow = (label, value, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(bold ? '#FF6B9D' : '#555555')
        .fontSize(bold ? 12 : 10)
        .text(label, 350, y)
        .text(value, 470, y);
      y += 20;
    };

    addTotalRow('Subtotal:', `₹${order.subtotal}`);
    if (order.discountTotal > 0) addTotalRow('Discount:', `-₹${order.discountTotal}`);
    if (order.couponDiscount > 0) addTotalRow(`Coupon (${order.couponCode}):`, `-₹${order.couponDiscount}`);
    if (order.firstOrderDiscount > 0) addTotalRow('1st Order Discount:', `-₹${order.firstOrderDiscount}`);
    addTotalRow('Shipping:', order.shippingCharge > 0 ? `₹${order.shippingCharge}` : 'FREE');
    doc.rect(350, y, 212, 1).fill('#FF6B9D'); y += 8;
    addTotalRow('TOTAL:', `₹${order.finalAmount}`, true);

    // Footer
    doc.rect(0, 760, 612, 82).fill('#2d2d2d');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica')
      .text('Thank you for shopping with Jay Kuldevi! 🎉', 50, 775, { align: 'center', width: 512 })
      .text('For support: support@jaykuldevi.com | 1800-XXX-XXXX', 50, 795, { align: 'center', width: 512 })
      .fillColor('#FF6B9D').text('Jay Kuldevi — Dressing Little Dreams', 50, 815, { align: 'center', width: 512 });

    doc.end();
  });
};

module.exports = { generateBillPDF };
