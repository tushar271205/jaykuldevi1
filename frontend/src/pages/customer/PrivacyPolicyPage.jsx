import { IconShield, IconLock, IconEye, IconTruck, IconCreditCard, IconMapPin, IconPhone, IconMail } from '../../components/common/Icons';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '80px 0 60px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><IconShield size={60} /></div>
          <h1 style={{ color: 'white', marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ opacity: 0.9, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Jay Kuldevi Children’s Wear – Committed to protecting your personal information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-sm">
          {/* Commitment Card */}
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: 15 }}>
              <p style={{ marginBottom: 20 }}>
                At <strong>Jay Kuldevi Children’s Wear</strong>, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your details when you interact with us.
              </p>
            </div>
          </div>

          {/* Collection Card */}
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, fontSize: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconEye size={24} /></span>
              Information We Collect
            </h2>
            <p style={{ marginBottom: 20, color: 'var(--gray-600)' }}>We may collect the following information from our customers:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                'Full Name',
                'Mobile Number',
                'Email Address',
                'Delivery Address',
                'Order & Purchase Details'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-700)' }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: 'var(--gray-500)' }}>
              This information is collected when you contact us, place an order, or communicate with us.
            </p>
          </div>

          {/* Protection Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, marginBottom: 40 }}>
            <div className="card" style={{ padding: '32px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--success)' }}><IconLock size={20} /></span>
                Data Security
              </h3>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                We take appropriate measures to keep your personal information safe and secure. Your data is protected from unauthorized access, misuse, or disclosure. We do not sell, trade, or rent your personal information to others.
              </p>
            </div>
            <div className="card" style={{ padding: '32px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--primary)' }}><IconTruck size={20} /></span>
                Data Usage
              </h3>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 12 }}>Your information is only shared when necessary for:</p>
              <ul style={{ paddingLeft: 0, margin: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 8 }}>
                  <IconTruck size={14} color="var(--primary)" /> Order delivery
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 8 }}>
                  <IconCreditCard size={14} color="var(--primary)" /> Payment processing
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <IconShield size={14} color="var(--primary)" /> Legal requirements
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="card" style={{ padding: '40px', border: 'none', background: 'var(--white)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, fontSize: 20 }}>Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ color: 'var(--primary)' }}><IconMapPin size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Shop Address</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.4 }}>
                    Jay Kuldevi Children’s Wear<br />
                    Shop no-3, Khodiyar nagar,<br />
                    Rajeshwari Road, Surat
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ color: 'var(--primary)' }}><IconPhone size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Call Us</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>9033111238</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ color: 'var(--primary)' }}><IconMail size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Email Us</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>tmakwana585@gmail.com</div>
                </div>
              </div>
            </div>
            <p style={{ marginTop: 32, textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
              We may update this Privacy Policy from time to time. Any changes will be communicated clearly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
