import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/product/ProductCard';
import {
  IconGift, IconCreditCard, IconTruck, IconZap, IconDollar, IconTarget, IconStar,
  IconSparkles, IconBoy, IconGirl, IconBaby, IconPalette, IconFootball, IconBackpack,
  IconTie, IconDress, IconCoat, IconMask, IconMoon, IconShirt, IconShoppingBag,
  IconLeaf, IconShield, IconParty, IconTag, IconPhone, IconMail, IconMapPin
} from '../../components/common/Icons';

// --- EDIT YOUR CATEGORY SLIDER IMAGES HERE ---
const GENDER_BANNERS = {
  boys: [
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800'
  ],
  girls: [
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800'
  ]
};
// ---------------------------------------------

const SkeletonCard = () => (
  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--gray-100)' }}>
    <div className="skeleton" style={{ paddingBottom: '125%' }} />
    <div style={{ padding: 12 }}>
      <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 13, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
    </div>
  </div>
);

const OFFERS = [
  { code: 'KIDDO10', label: '10% OFF', sub: 'On Your 1st Order', color: 'var(--primary)', bg: 'var(--primary-50)', icon: <IconGift size={28} /> },
  { code: 'SAVE300', label: '₹300 OFF', sub: 'On purchase of ₹2000+', color: 'var(--secondary)', bg: '#ffe4ef', icon: <IconCreditCard size={28} /> },
  { code: 'FREESHIP', label: 'FREE Shipping', sub: 'On orders above ₹499', color: '#10b981', bg: '#d1fae5', icon: <IconTruck size={28} /> },
  { code: 'PT15EXTRA', label: '15% OFF', sub: 'On purchase of ₹3999+', color: '#f59e0b', bg: '#fef3c7', icon: <IconZap size={28} /> },
];

const BUDGET_BUYS = [
  { label: 'Under ₹299', max: 299, icon: <IconDollar size={32} />, color: '#667eea', bg: 'linear-gradient(135deg, #667eea22, #764ba222)' },
  { label: 'Under ₹499', max: 499, icon: <IconTarget size={32} />, color: '#f093fb', bg: 'linear-gradient(135deg, #f093fb22, #f5576c22)' },
  { label: 'Under ₹699', max: 699, icon: <IconStar size={32} />, color: '#4facfe', bg: 'linear-gradient(135deg, #4facfe22, #00f2fe22)' },
  { label: 'Under ₹999', max: 999, icon: <IconShoppingBag size={32} />, color: '#43e97b', bg: 'linear-gradient(135deg, #43e97b22, #38f9d722)' },
];


export default function HomePage() {
  const navigate = useNavigate();
  const [topPicks, setTopPicks] = useState([]);
  const [boysProducts, setBoysProducts] = useState([]);
  const [girlsProducts, setGirlsProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [topRes, boysRes, girlsRes, newRes] = await Promise.all([
          getProducts({ isTopPick: true, limit: 8 }),
          getProducts({ category: 'boys', limit: 6, sort: 'newest' }),
          getProducts({ category: 'girls', limit: 6, sort: 'newest' }),
          getProducts({ sort: 'newest', limit: 8 }),
        ]);
        setTopPicks(topRes.data.products || []);
        setBoysProducts(boysRes.data.products || []);
        setGirlsProducts(girlsRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const renderSkeletons = (count) =>
    Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />);

  return (
    <div>
      {/* ========== HERO BANNER ========== */}
      <section style={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 40%, #e8f5e9 100%)',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,188,212,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,107,157,0.08)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            {/* Left content */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,188,212,0.1)', border: '1px solid rgba(0,188,212,0.2)',
                borderRadius: 'var(--radius-full)', padding: '6px 14px',
                fontSize: 12, fontWeight: 700, color: 'var(--primary)',
                marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                <IconSparkles size={14} /> New SS26 Collection is Here!
              </div>

              <h1 className="hero-title" style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                lineHeight: 1.1,
                marginBottom: 16,
                color: 'var(--gray-900)',
              }}>
                Dress Them in <br />
                <span style={{ color: 'var(--primary)' }}>Pure Joy</span> <IconSparkles size={28} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </h1>

              <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 32, maxWidth: 400 }}>
                Adorable, trendy & comfortable clothing for kids aged 0–14 years. Explore Boys & Girls collections with new arrivals every week!
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/boys" className="btn btn-lg btn-round" style={{ 
                  background: '#0097a7', color: 'white', border: 'none',
                  boxShadow: '0 4px 15px rgba(0, 151, 167, 0.3)'
                }}>
                  Shop Boys <IconBoy size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                </Link>
                <Link to="/girls" className="btn btn-lg btn-round" style={{ 
                  background: '#ff6b9d', color: 'white', border: 'none',
                  boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)'
                }}>
                  Shop Girls <IconGirl size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
                {[[<IconLeaf size={14} key="leaf" />, 'Soft Fabrics'], [<IconShield size={14} key="shield" />, 'Quality Assured'], [<IconTruck size={14} key="truck" />, 'Free Shipping ₹499+']].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
                    <span>{icon}</span> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — decorative product showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, display: 'var(--hide-mobile, grid)' }} className="hide-mobile">
              {[
                { icon: <IconShirt size={36} />, label: 'Boys T-Shirts', tag: 'From ₹299', color: '#e3f2fd' },
                { icon: <IconDress size={36} />, label: 'Girls Dresses', tag: 'Up to 40% OFF', color: '#fce4ec' },
                { icon: <IconCoat size={36} />, label: 'Winter Wear', tag: 'New Arrivals', color: '#f3e5f5' },
                { icon: <IconTag size={36} />, label: 'Ethnic Wear', tag: '₹300 OFF', color: '#fff8e1' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: item.color,
                  borderRadius: 16,
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
                  onClick={() => navigate('/products')}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.label}</div>
                  <div style={{
                    background: 'white', display: 'inline-block',
                    padding: '2px 10px', borderRadius: 20, fontSize: 11,
                    fontWeight: 600, color: 'var(--primary)',
                  }}>
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section style={{ padding: '40px 0 20px', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ fontSize: 20, color: 'var(--gray-500)', marginBottom: 30, fontWeight: 1000 }}>Shop by Collection</div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '32px 16px',
              justifyItems: 'center'
            }}>
              {[
                { img: 'https://i.pinimg.com/1200x/59/b3/6c/59b36c358b949250facc3da5749f18b0.jpg', label: 'Infant Sets', cat: '', sub: 'sets' },
                { img: 'https://i.pinimg.com/1200x/cc/21/6f/cc216f90721b51624c320f89cae07d0a.jpg', label: '2-4 Years', cat: '', sub: '' },
                { img: 'https://i.pinimg.com/1200x/f3/fb/4b/f3fb4b96743ebddb31875c90b69af224.jpg', label: '4-6 Years', cat: '', sub: '' },
                { img: 'https://i.pinimg.com/1200x/6f/b3/8b/6fb38b0fefaaa311028a938e13536ef6.jpg', label: '6-14 Years', cat: '', sub: '' },
                { img: 'https://i.pinimg.com/1200x/7d/f4/cf/7df4cf21dc52015f5ce08d0e95926dcb.jpg', label: 'Boy Shirts', cat: 'boys', sub: 'shirts' },
                { img: 'https://i.pinimg.com/1200x/01/cb/c3/01cbc39fcaece15fa7bcac90110accf2.jpg', label: 'Girl Dresses', cat: 'girls', sub: 'dresses' },
                { img: 'https://i.pinimg.com/736x/36/5d/19/365d199609f0b090c767721a4289ef26.jpg', label: 'Winter Wear', cat: '', sub: 'winterwear' },
                { img: 'https://i.pinimg.com/736x/33/19/49/331949a1edb8a0fcaf83d734414533e6.jpg', label: 'Ethnic Wear', cat: '', sub: 'ethnic' },
                { img: 'https://i.pinimg.com/1200x/7a/3c/68/7a3c68af16204ef05c5a198876abca54.jpg', label: 'Night Wear', cat: '', sub: 'nightwear' },
                { img: 'https://i.pinimg.com/736x/41/82/c6/4182c65eebf8fd79da2abf050fb9e400.jpg', label: 'Sets & Suits', cat: '', sub: 'sets' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ textAlign: 'center', cursor: 'pointer', width: '100%', maxWidth: 180 }}
                  onClick={() => navigate(`/products${item.cat ? `?category=${item.cat}` : ''}${item.sub ? `${item.cat ? '&' : '?'}subCategory=${item.sub}` : ''}`)}
                >
                  <div style={{
                    width: 160, height: 200,
                    borderRadius: 24,
                    background: 'var(--primary-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                    border: '3px solid transparent',
                    transition: 'all 0.2s',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                  >
                    <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== OFFERS SECTION ========== */}
      <section style={{ padding: '40px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Exclusive Offers</h2>
            <Link to="/products" className="section-link">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {OFFERS.map((offer) => (
              <div key={offer.code} style={{
                background: offer.bg,
                border: `1.5px dashed ${offer.color}`,
                borderRadius: 12,
                padding: '20px 20px 20px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => navigate('/products')}
              >
                <div style={{ flexShrink: 0, color: offer.color }}>{offer.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: offer.color, fontFamily: 'var(--font-display)' }}>
                    {offer.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginBottom: 6 }}>{offer.sub}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    border: `1px solid ${offer.color}`, borderRadius: 4,
                    padding: '2px 8px', fontSize: 11, fontWeight: 700, color: offer.color,
                  }}>
                    <span>CODE:</span> <span>{offer.code}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEW ARRIVALS ========== */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><IconSparkles size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> New Arrivals</h2>
            <Link to="/products?sort=newest" className="section-link">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {loading
              ? renderSkeletons(8)
              : newArrivals.length > 0
                ? newArrivals.map((p) => <ProductCard key={p._id} product={p} />)
                : <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  Products coming soon! Add from admin panel.
                </div>
            }
          </div>
        </div>
      </section>

      {/* ========== SHOP BY GENDER (Dynamic Swipers) ========== */}
      <section style={{ padding: '60px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Gender</h2>
            <Link to="/products" className="section-link">Explore All Categories →</Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
            marginTop: 20
          }}>
            {/* Boys Slider */}
            <div style={{ borderRadius: 24, overflow: 'hidden', height: 420, position: 'relative' }}>
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                style={{ width: '100%', height: '100%' }}
              >
                {GENDER_BANNERS.boys.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Boys Fashion" />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                        padding: 40, color: 'white'
                      }}>
                        <h3 style={{ color: 'white', fontSize: 32, marginBottom: 8 }}>Boys</h3>
                        <p style={{ opacity: 0.9, marginBottom: 24, fontSize: 15 }}>Cool styles for cool boys</p>
                        <Link to="/boys" className="btn" style={{
                          alignSelf: 'flex-start', background: 'var(--primary)', color: 'white',
                          padding: '12px 28px', borderRadius: 30, fontWeight: 700
                        }}>
                          Shop Now →
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Girls Slider */}
            <div style={{ borderRadius: 24, overflow: 'hidden', height: 420, position: 'relative' }}>
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 3800, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                style={{ width: '100%', height: '100%' }}
              >
                {GENDER_BANNERS.girls.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Girls Fashion" />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                        padding: 40, color: 'white'
                      }}>
                        <h3 style={{ color: 'white', fontSize: 32, marginBottom: 8 }}>Girls</h3>
                        <p style={{ opacity: 0.9, marginBottom: 24, fontSize: 15 }}>Pretty styles for pretty girls</p>
                        <Link to="/girls" className="btn" style={{
                          alignSelf: 'flex-start', background: '#f5576c', color: 'white',
                          padding: '12px 28px', borderRadius: 30, fontWeight: 700
                        }}>
                          Shop Now →
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BUDGET BUYS ========== */}
      <section style={{ padding: '40px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><IconDollar size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Budget Buys</h2>
            <Link to="/products" className="section-link">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {BUDGET_BUYS.map((item) => (
              <div
                key={item.max}
                style={{
                  background: item.bg,
                  border: `1px solid ${item.color}22`,
                  borderRadius: 16,
                  padding: '24px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => navigate(`/products?maxPrice=${item.max}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${item.color}33`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ marginBottom: 12, color: item.color, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: item.color, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Explore collection</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP PICKS ========== */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><IconSparkles size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Top Picks</h2>
            <Link to="/products?isTopPick=true" className="section-link">View All →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {loading
              ? renderSkeletons(8)
              : topPicks.length > 0
                ? topPicks.map((p) => <ProductCard key={p._id} product={p} />)
                : <div style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  No top picks yet. Add products from admin panel!
                </div>
            }
          </div>
        </div>
      </section>

      {/* ========== BOYS COLLECTION ========== */}
      {boysProducts.length > 0 && (
        <section style={{ padding: '40px 0', background: 'linear-gradient(180deg, #f0f5ff 0%, white 100%)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title"><IconBoy size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Boys Collection</h2>
              <Link to="/boys" className="section-link">Shop All Boys →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {boysProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========== GIRLS COLLECTION ========== */}
      {girlsProducts.length > 0 && (
        <section style={{ padding: '40px 0', background: 'linear-gradient(180deg, #fff0f7 0%, white 100%)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title"><IconGirl size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Girls Collection</h2>
              <Link to="/girls" className="section-link">Shop All Girls →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {girlsProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========== BOTTOM SECTION — OFFERS & CONTACT ========== */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24
          }}>
            {/* Offer Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              borderRadius: 24,
              padding: '40px',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
            >
              <div style={{ marginBottom: 16 }}><IconParty size={40} /></div>
              <h2 style={{ color: 'white', fontSize: 24, marginBottom: 8 }}>First Order? Get 10% OFF!</h2>
              <p style={{ opacity: 0.9, fontSize: 14, marginBottom: 24 }}>Use code <strong>KIDDO10</strong> at checkout.</p>
              <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '10px 24px', borderRadius: 'var(--radius-full)' }}>
                Register & Shop Now →
              </Link>
            </div>

            {/* Contact Card (Visual Hover only) */}
            <div style={{
              background: 'linear-gradient(135deg, #FF8C42 0%, #E67E22 100%)',
              borderRadius: 24,
              padding: '40px',
              color: 'white',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'default',
              boxShadow: '0 10px 30px rgba(255,140,66,0.15)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,140,66,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,140,66,0.15)'; }}
            >
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: 'white' }}>Contact Us</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.15)', borderRadius: 12, color: 'white',
                  backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <IconPhone size={18} color="white" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Mobile Number</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>+91 90331 11238</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.15)', borderRadius: 12, color: 'white',
                  backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <IconMail size={18} color="white" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' }}>E-mail Address</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>tmakwana585@gmail.com</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.15)', borderRadius: 12, color: 'white',
                  backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <IconMapPin size={18} color="white" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Shop Address</div>
                    <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>Shop no-3, Khodiyar nagar, Rajeshwari Road, Surat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
