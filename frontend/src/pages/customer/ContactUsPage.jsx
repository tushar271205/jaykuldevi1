import { useState } from 'react';
import api from '../../api/axios';
import { IconMail, IconPhone, IconMapPin, IconUsers, IconSparkles } from '../../components/common/Icons';

// Inline send icon (paper plane) matching reference image
function IconSend({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// Inline user icon for input
function IconUserInput({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Inline phone icon for input
function IconPhoneInput({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Network error. Please check your connection and try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12,
    fontSize: 14,
    color: '#374151',
    background: '#FAFAFA',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
  };

  const requiredStar = <span style={{ color: 'var(--primary)', marginLeft: 4 }}>*</span>;

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
      {/* Hero Header — same as AboutUsPage */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '80px 0 60px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <IconMail size={60} color="white" />
          </div>
          <h1 style={{ color: 'white', marginBottom: 12 }}>Contact Us</h1>
          <p style={{ opacity: 0.9, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            We'd love to hear from you! Reach out to us or visit our shop — we're always happy to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-sm">

          {/* Contact Details Card */}
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconSparkles size={24} /></span>
              Get In Touch
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {/* Phone */}
              <a
                href="tel:+919825XXXXXX"
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'var(--gray-50)', borderRadius: 16, padding: '20px 24px',
                  textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <IconPhone size={22} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', marginBottom: 4 }}>Call Us</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>+91 98254 XXXXX</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Mon–Sat, 10am – 8pm</div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/jay_kuldevi_childrenwear/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'var(--gray-50)', borderRadius: 16, padding: '20px 24px',
                  textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F77737, #C13584)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#C13584', marginBottom: 4 }}>Instagram</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>@jay_kuldevi_childrenwear</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Follow us for new arrivals</div>
                </div>
              </a>
            </div>
          </div>

          {/* Shop Location Card */}
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconMapPin size={24} /></span>
              Find Our Shop
            </h2>

            {/* Google Map Embed */}
            <div style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1.5px solid #E5E7EB',
              marginBottom: 24,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}>
              <iframe
                title="Jay Kuldevi Shop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2345678901234!2d72.5700!3d23.0800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA0JzUwLjQiTiA3MsKwMzQnMTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=Shop+no+21,+Gigev+Park,+Opposite+Uttamnagar,+Ratanpark+Road,+Bapunagar,+Ahmedabad,+Gujarat"
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address info + button */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconMapPin size={22} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 6 }}>
                    ઘન્શ્યામ Ladies Tailor — Jay Kuldevi Children Wear
                  </div>
                  <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
                    Shop no:–21, Gigev Park, Opposite Uttamnagar,<br />
                    Ratanpark Road, Bapunagar, Ahmedabad, Gujarat.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                <a
                  href="https://maps.app.goo.gl/e8JEBNPtco5RkYsh6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14,
                    textDecoration: 'none', transition: 'opacity 0.2s, transform 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <IconMapPin size={16} color="white" />
                  Get Directions →
                </a>
                <a
                  href="https://maps.app.goo.gl/e8JEBNPtco5RkYsh6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px',
                    background: 'white', border: '1.5px solid #E5E7EB',
                    color: '#374151', borderRadius: 10, fontWeight: 600, fontSize: 14,
                    textDecoration: 'none', transition: 'background 0.2s, transform 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Send Us a Message Card */}
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconSend size={24} color="var(--primary)" /></span>
              Send Us a Message
            </h2>

            {status === 'success' ? (
              <div style={{
                background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 16,
                padding: '32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <h3 style={{ color: '#15803D', marginBottom: 8 }}>Message Sent Successfully!</h3>
                <p style={{ color: '#166534', fontSize: 14, marginBottom: 20 }}>
                  Thank you for reaching out. We'll get back to you soon!
                </p>
                <button
                  onClick={() => setStatus(null)}
                  style={{
                    padding: '10px 28px', background: '#16A34A', color: 'white',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="contact-name" style={labelStyle}>
                    Your Name {requiredStar}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <IconUserInput size={16} />
                    </span>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,45,18,0.08)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="contact-phone" style={labelStyle}>
                    Phone Number {requiredStar}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <IconPhoneInput size={16} />
                    </span>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 99999 99999"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,45,18,0.08)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: 28 }}>
                  <label htmlFor="contact-message" style={labelStyle}>
                    Message {requiredStar}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Write your message, inquiry, or feedback here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{
                      ...inputStyle,
                      paddingLeft: 16,
                      resize: 'vertical',
                      minHeight: 120,
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,45,18,0.08)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <div style={{
                    background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 10,
                    padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: 14,
                  }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  id="contact-submit-btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: status === 'loading'
                      ? '#9CA3AF'
                      : 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'opacity 0.2s, transform 0.2s',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => { if (status !== 'loading') { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <IconSend size={18} color="white" />
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Business Hours Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: '32px',
              borderLeft: '4px solid var(--primary)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--primary)' }}><IconUsers size={24} /></span>
                <h3 style={{ margin: 0 }}>Business Hours</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Monday – Saturday', '10:00 AM – 8:00 PM'],
                  ['Sunday', '11:00 AM – 6:00 PM'],
                ].map(([day, time]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{day}</span>
                    <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'white', borderRadius: 20, padding: '32px',
              borderLeft: '4px solid var(--primary-light)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--primary-light)' }}><IconSparkles size={24} /></span>
                <h3 style={{ margin: 0 }}>Quick Response</h3>
              </div>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                We typically respond to messages within <strong>24 hours</strong>. For urgent queries, please
                call us directly or visit the shop — we'd love to see you!
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
