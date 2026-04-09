import { Link } from 'react-router-dom';
import { IconShirt, IconTruck, IconRefresh, IconLock, IconHeart, IconFacebook, IconInstagram, IconTwitter, IconYoutube } from './Icons';

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1a2e',
      color: 'rgba(255,255,255,0.8)',
      padding: '48px 0 0',
      marginTop: '60px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', paddingBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden' }}>
                <img src="/FullLogo.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Jay Kuldevi Logo" />
              </div>
              <span style={{ fontFamily: 'var(--font-brand)', fontSize: 28, fontWeight: 550, color: 'white', letterSpacing: '2.5px', textTransform: 'uppercase', textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
                Jay Kuldevi
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
              Your one-stop destination for adorable, quality kids' clothing. Curated styles for boys & girls aged 0–14 years.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="https://www.instagram.com/jay_kuldevi_childrenwear/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 16, color: 'white',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <IconInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SHOP
            </h4>
            {[
              ['Boys Collection', '/boys'],
              ['Girls Collection', '/girls'],
              ['New Arrivals', '/products?sort=newest'],
              ['Top Picks', '/products?isTopPick=true'],
              ['Budget Buys', '/products?maxPrice=999'],

            ].map(([label, href]) => (
              <Link key={label} to={href} style={{
                display: 'block', color: 'rgba(255,255,255,0.6)',
                fontSize: 13, marginBottom: 10, textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Customer */}
          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              CUSTOMER
            </h4>
            {[
              ['My Account', '/account/profile'],
              ['My Orders', '/account/orders'],
              ['Wishlist', '/wishlist'],
              ['Track Order', '/account/orders'],

            ].map(([label, href]) => (
              <Link key={label} to={href} style={{
                display: 'block', color: 'rgba(255,255,255,0.6)',
                fontSize: 13, marginBottom: 10, textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              INFO
            </h4>
            {[
              ['About Jay Kuldevi', '/about'],
              ['Privacy Policy', '/privacy'],
            ].map(([label, href]) => (
              <Link key={label} to={href} style={{
                display: 'block', color: 'rgba(255,255,255,0.6)',
                fontSize: 13, marginBottom: 10, textDecoration: 'none',
                transition: 'color 0.2s',
              }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>WE ACCEPT</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['UPI', 'VISA', 'Mastercard', 'RuPay', 'Razorpay', 'COD'].map((method) => (
                <span key={method} style={{
                  padding: '4px 10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {method}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: <IconTruck size={20} />, label: 'Free Delivery', sub: 'Above ₹499' },
              { icon: <IconRefresh size={20} />, label: 'Easy Returns', sub: '10 Days' },
              { icon: <IconLock size={20} />, label: 'Secure Payment', sub: '100% Safe' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 0',
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
        }}>
          © {new Date().getFullYear()} Jay Kuldevi. All rights reserved. Made with <IconHeart size={12} color="#5fa8d3" style={{ display: 'inline', verticalAlign: 'middle' }} /> for little fashionistas.
        </div>
      </div>
    </footer>
  );
}
