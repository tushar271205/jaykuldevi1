const { sendEmail } = require('../utils/emailService');

// POST /api/contact
const sendContactMessage = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and message are required.' });
    }

    // Basic phone validation
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\+?[\d]{7,15}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    const adminEmail = process.env.EMAIL_USER || 'jaikuldevi123@gmail.com';
    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    await sendEmail({
      to: adminEmail,
      subject: `📩 New Contact Message from ${name} – Jay Kuldevi`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#7C2D12,#C05621);padding:40px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:26px">👕 Jay Kuldevi</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px">📩 New Contact Message</p>
          </div>
          <div style="padding:36px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 16px;background:#FEF3C7;border-radius:8px 8px 0 0;font-weight:700;color:#7C2D12;width:140px">Name</td>
                <td style="padding:10px 16px;background:#FFFBEB;border-radius:0 8px 0 0;color:#374151">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;background:#FEF3C7;font-weight:700;color:#7C2D12">Phone</td>
                <td style="padding:10px 16px;background:#FFFBEB;color:#374151">${phone}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;background:#FEF3C7;border-radius:0 0 0 8px;font-weight:700;color:#7C2D12;vertical-align:top">Message</td>
                <td style="padding:10px 16px;background:#FFFBEB;border-radius:0 0 8px 0;color:#374151;white-space:pre-wrap">${message}</td>
              </tr>
            </table>
            <p style="color:#9CA3AF;font-size:13px;margin-top:24px">📅 Submitted on: ${submittedAt}</p>
          </div>
          <div style="background:#f8f8f8;padding:20px;text-align:center">
            <p style="color:#aaa;font-size:12px;margin:0">© ${new Date().getFullYear()} Jay Kuldevi. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Your message has been sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('[Contact] Error sending contact message:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContactMessage };
