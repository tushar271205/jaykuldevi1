import { IconShirt, IconHeart, IconShield, IconSparkles, IconUsers, IconTarget, IconEye } from '../../components/common/Icons';

export default function AboutUsPage() {
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><IconShirt size={60} /></div>
          <h1 style={{ color: 'white', marginBottom: 12 }}>About Us</h1>
          <p style={{ opacity: 0.9, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            Jay Kuldevi Children’s Wear – Your trusted local store for high-quality and stylish kids’ clothing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-sm">
          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconSparkles size={24} /></span>
              Welcome to Jay Kuldevi
            </h2>
            <div style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: 13 }}>
              <p style={{ marginBottom: 20 }}>
                Welcome to <strong>Jay Kuldevi Children’s Wear</strong>, your trusted local store for high-quality and stylish kids’ clothing. We take pride in serving families with the best collection of comfortable, trendy, and affordable outfits for children of all ages.
              </p>
              <p style={{ marginBottom: 0 }}>
                At Jay Kuldevi Children’s Wear, we believe that every child deserves to look good and feel comfortable. Our collection includes a wide variety of clothing for boys and girls, from daily wear to festive and special occasion outfits. Each product is carefully selected to ensure good fabric quality, durability, and modern design.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '40px', marginBottom: 40, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--primary)' }}><IconUsers size={24} /></span>
              Our Commitment
            </h2>
            <p style={{ lineHeight: 1.8, color: 'var(--gray-600)', fontSize: 13, marginBottom: 24 }}>
              We are committed to providing a friendly and reliable shopping experience to our customers. Whether you visit our shop or connect with us, we make sure you get the right guidance in choosing the perfect outfits for your children.
            </p>

            <h3 style={{ fontSize: 1, marginBottom: 20 }}>Why Families Choose Us:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {[
                { icon: <IconShield size={18} />, text: 'Quality products at reasonable prices' },
                { icon: <IconSparkles size={18} />, text: 'Latest designs and trending styles' },
                { icon: <IconHeart size={18} />, text: 'Comfortable fabrics suitable for kids' },
                { icon: <IconShield size={18} />, text: 'Honest service and customer satisfaction' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                  <span style={{ color: 'var(--primary)', marginTop: 4 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-700)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 14, margin: '40px 0' }}>
            We regularly update our collection with new arrivals and also provide exciting offers and discounts so that you always get the best value for your money.
          </p>

          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: '32px',
              borderLeft: '4px solid var(--primary)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--primary)' }}><IconTarget size={24} /></span>
                <h3 style={{ margin: 0 }}>Our Mission</h3>
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.7 }}>
                To provide stylish, comfortable, and affordable clothing for children while delivering excellent customer service.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: '32px',
              borderLeft: '4px solid var(--primary-light)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--primary-light)' }}><IconEye size={24} /></span>
                <h3 style={{ margin: 0 }}>Our Vision</h3>
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.7 }}>
                To become a trusted and preferred children’s wear shop in the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
