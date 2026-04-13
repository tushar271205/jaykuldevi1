import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { getProductReviews } from '../../api/reviews';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/product/ProductCard';
import { getProducts } from '../../api/products';
import Pagination from '../../components/common/Pagination';
import { IconStar, IconStarOutline, IconTag, IconCreditCard, IconZap, IconRuler, IconShoppingBag, IconTruck, IconRefresh, IconShield, IconChevronLeft, IconChevronRight } from '../../components/common/Icons';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPagination, setReviewPagination] = useState({});
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([
          getProduct(id),
          getProductReviews(id, { page: 1, limit: 10 }),
        ]);
        const p = pRes.data.product;
        setProduct(p);
        setReviews(rRes.data.reviews || []);
        setReviewPagination(rRes.data.pagination || {});
        setReviewPage(1);
        setSelectedImg(0);
        setSelectedSize(null);
        setSelectedColor(p.colors?.[0] || null);

        // Fetch related
        const relRes = await getProducts({ category: p.category, limit: 6 });
        setRelated((relRes.data.products || []).filter((x) => x._id !== p._id).slice(0, 5));
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewPageChange = async (newPage) => {
    setReviewPage(newPage);
    try {
      const rRes = await getProductReviews(id, { page: newPage, limit: 10 });
      setReviews(rRes.data.reviews || []);
      setReviewPagination(rRes.data.pagination || {});
    } catch (err) {
      console.error('Failed to fetch reviews page', err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="resp-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <div className="skeleton" style={{ paddingBottom: '120%', borderRadius: 12 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[200, 100, 60, 80, 120, 100].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: i === 0 ? 28 : 16, width: w, borderRadius: 8 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPct = product.price > product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      document.getElementById('size-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setAddingToCart(true);
    addToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => setAddingToCart(false), 800);
  };

  const wishlisted = isWishlisted(product._id);

  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="container" style={{ paddingTop: 20 }}>
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/${product.category}`} style={{ textTransform: 'capitalize' }}>{product.category}</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/${product.category}?subCategory=${product.subCategory}`} style={{ textTransform: 'capitalize' }}>
            {product.subCategory}
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span>{product.name}</span>
        </div>

        <div className="resp-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* LEFT — Scrollable Image Gallery */}
          <div style={{ position: 'relative' }}>
            <div
              id="product-gallery"
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                gap: 0,
                borderRadius: 16,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onScroll={(e) => {
                const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
                if (index !== selectedImg) setSelectedImg(index);
              }}
            >
              {(product.images?.length > 0 ? product.images : [{ url: 'https://placehold.co/500x600?text=No+Image' }]).map((img, i) => {
                const url = typeof img === 'string' ? img : img.url;
                return (
                  <div
                    key={i}
                    id={`gallery-img-${i}`}
                    style={{
                      flex: '0 0 100%',
                      scrollSnapAlign: 'start',
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: 'var(--gray-50)',
                      border: '1px solid var(--gray-100)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={url}
                      alt={`${product.name} - ${i + 1}`}
                      style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Manual Slider Arrows */}
            {product.images?.length > 1 && (
              <>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={() => {
                    const gallery = document.getElementById('product-gallery');
                    gallery.scrollBy({ left: -gallery.offsetWidth, behavior: 'smooth' });
                  }}
                  style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)', color: 'var(--primary)',
                    width: 36, height: 36, borderRadius: '50%', zIndex: 5,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <IconChevronLeft size={20} />
                </button>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={() => {
                    const gallery = document.getElementById('product-gallery');
                    gallery.scrollBy({ left: gallery.offsetWidth, behavior: 'smooth' });
                  }}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)', color: 'var(--primary)',
                    width: 36, height: 36, borderRadius: '50%', zIndex: 5,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <IconChevronRight size={20} />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {discountPct > 0 && (
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: 'var(--secondary)', color: 'white',
                padding: '4px 10px', borderRadius: 4, fontSize: 13, fontWeight: 700,
                zIndex: 2
              }}>
                {discountPct}% OFF
              </div>
            )}

            {/* Pagination Dots */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                {product.images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(`gallery-img-${i}`);
                      el?.parentElement.scrollTo({ left: el.offsetLeft, behavior: 'smooth' });
                    }}
                    style={{
                      width: selectedImg === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: selectedImg === i ? 'var(--primary)' : 'var(--gray-200)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product Info */}
          <div className="resp-sticky" style={{ position: 'sticky', top: 90 }}>
            <div style={{ fontFamily: 'var(--font-brand)', fontSize: 14, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '1.5px', textShadow: '0.1px 0 0 var(--primary)' }}>
              {product.brand || 'Jay Kuldevi'}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.3, color: 'var(--gray-900)' }}>
              {product.name}
            </h1>

            {/* Ratings */}
            {product.numReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{
                  background: 'var(--success)', color: 'white',
                  padding: '3px 8px', borderRadius: 4, fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {product.ratings?.toFixed(1)} <IconStar size={12} color="white" style={{ display: 'inline', verticalAlign: 'middle' }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                  {product.numReviews} rating{product.numReviews > 1 ? 's' : ''}
                </span>
                <span style={{ color: 'var(--gray-300)' }}>|</span>
                <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setActiveTab('reviews')}>
                  Be the first to rate! <IconStarOutline size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-900)' }}>
                  ₹{product.discountedPrice?.toLocaleString('en-IN')}
                </span>
                {discountPct > 0 && (
                  <>
                    <span style={{ fontSize: 16, color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: 16, color: 'var(--secondary)', fontWeight: 700 }}>
                      ({discountPct}% OFF)
                    </span>
                  </>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>Inclusive of all taxes</div>
            </div>

            {/* OFFERS BOX */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>OFFERS</div>
              {[
                [<IconTag size={14} key="tag" />, 'KIDDO10', 'Extra 10% Off on your 1st order above ₹1599'],
                [<IconCreditCard size={14} key="cc" />, 'SAVE300', 'Extra ₹300 Off on purchase of Rs 2000'],
                [<IconZap size={14} key="zap" />, 'PT15EXTRA', 'Extra 15% Off on purchase of Rs 3999'],
              ].map(([icon, code, text]) => (
                <div key={code} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--gray-700)', marginBottom: 6, alignItems: 'flex-start' }}>
                  <span>{icon}</span>
                  <span><strong>{code}</strong> — {text}</span>
                </div>
              ))}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Color: <span style={{ color: 'var(--gray-800)' }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        // Find first image with this color and scroll to it
                        const imgIndex = product.images?.findIndex(img => img.color === color);
                        if (imgIndex > -1) {
                          const el = document.getElementById(`gallery-img-${imgIndex}`);
                          el?.parentElement.scrollTo({ left: el.offsetLeft, behavior: 'smooth' });
                        }
                      }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        border: `2px solid ${selectedColor === color ? 'var(--primary)' : 'var(--gray-200)'}`,
                        fontSize: 12, fontWeight: 500,
                        cursor: 'pointer',
                        background: selectedColor === color ? 'var(--primary-50)' : 'white',
                        color: selectedColor === color ? 'var(--primary)' : 'var(--gray-700)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div id="size-section" style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, fontWeight: 700, color: 'var(--gray-500)',
                textTransform: 'uppercase', marginBottom: 8,
              }}>
                <span>SELECT SIZE</span>
                <span style={{ color: 'var(--primary)', cursor: 'pointer' }}><IconRuler size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> SIZE CHART</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    className={`size-chip${s.stock === 0 ? ' disabled' : ''}${selectedSize === s.size ? ' selected' : ''}`}
                    onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <div style={{ fontSize: 12, color: 'var(--error)', marginTop: 6 }}>
                  Please select a size to add to bag
                </div>
              )}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8 }}>
                QUANTITY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="qty-stepper">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10}>+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                className="btn btn-outline btn-lg"
                style={{ flex: 1, borderColor: 'var(--primary)', color: 'var(--primary)' }}
                onClick={() => toggleWishlist(product)}
              >
                {wishlisted ? '❤️ WISHLISTED' : '🤍 WISHLIST'}
              </button>
              <button
                className={`btn btn-primary btn-lg${addingToCart ? ' btn-loading' : ''}`}
                style={{ flex: 2 }}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'ADDING...' : <><IconShoppingBag size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> ADD TO BAG</>}
              </button>
            </div>

            {/* Delivery Details */}
            <div style={{
              background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
              borderRadius: 8, padding: '16px 16px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)', marginBottom: 10, textTransform: 'uppercase' }}>
                DELIVERY DETAILS
              </div>
              {[
                { icon: <IconTruck size={16} />, label: 'Standard Delivery', sub: '5-7 working days | FREE above ₹499' },
                { icon: <IconRefresh size={16} />, label: 'Easy 15-day exchanges & returns' },
                { icon: <IconShield size={16} />, label: '100% secure payment' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 2 ? 10 : 0, fontSize: 13 }}>
                  <span>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    {item.sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{item.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========== TABS — DESCRIPTION / REVIEWS ========== */}
      <div className="container" style={{ marginTop: 40 }}>
        <div className="tabs">
          {['description', 'reviews'].map((tab) => (
            <div
              key={tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'description' ? 'Material & Fit' : `Reviews (${reviews.length})`}
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 0' }}>
          {activeTab === 'description' ? (
            <div className="resp-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Product Description</h3>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{product.description}</p>

                {product.material && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Material & Fit
                    </div>
                    <ul style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 2, paddingLeft: 16 }}>
                      <li>{product.material}</li>
                      {product.washCare && <li>Wash Care: {product.washCare}</li>}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Product Details</h3>
                <table style={{ width: '100%', fontSize: 13 }}>
                  <tbody>
                    {[
                      ['Brand', product.brand || 'Jay Kuldevi'],
                      ['Category', product.category],
                      ['Type', product.subCategory],
                      ...(product.tags?.length ? [['Tags', product.tags.join(', ')]] : []),
                    ].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '10px 0', color: 'var(--gray-500)', paddingRight: 16, whiteSpace: 'nowrap' }}>— {k}</td>
                        <td style={{ padding: '10px 0', color: 'var(--gray-800)', textTransform: 'capitalize' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              {reviews.length === 0 ? (
                <div className="empty-state" style={{ minHeight: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><IconStarOutline size={36} color="var(--gray-400)" /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-600)' }}>No Reviews Yet</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Be the first to review this product!</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {reviews.map((r) => (
                    <div key={r._id} style={{
                      background: 'var(--gray-50)', borderRadius: 12,
                      padding: '16px 20px', border: '1px solid var(--gray-100)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--primary)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, flexShrink: 0,
                        }}>
                          {r.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.user?.name || 'Anonymous'}</div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} style={{ display: 'inline-flex' }}><IconStar size={13} color={s <= r.rating ? '#f59e0b' : 'var(--gray-200)'} /></span>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--gray-400)' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      {r.comment && <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6 }}>{r.comment}</p>}
                      {r.images?.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          {r.images.map((img, i) => (
                            <img key={i} src={img} alt="" style={{
                              width: 64, height: 64, objectFit: 'cover',
                              borderRadius: 6, border: '1px solid var(--gray-200)',
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Review Pagination */}
              <Pagination 
                page={reviewPage} 
                pages={reviewPagination.pages} 
                onPageChange={handleReviewPageChange} 
                style={{ paddingTop: '24px', justifyContent: 'center' }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* ========== RELATED PRODUCTS ========== */}
      {related.length > 0 && (
        <div className="container" style={{ marginTop: 24 }}>
          <div className="section-header">
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
