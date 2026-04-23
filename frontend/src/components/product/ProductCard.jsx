import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { IconStar } from '../common/Icons';

export default function ProductCard({ product, isWishlist }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [showSizes, setShowSizes] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product._id);
  const discountPct = product.price > product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const inStockSizes = product.sizes?.filter((s) => s.stock > 0) || [];

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStockSizes.length === 0) return;
    
    // If only 1 size AND only 1 color, add instantly
    if (inStockSizes.length === 1 && (product.colors?.length || 0) <= 1) {
      addToCart(product, inStockSizes[0].size, product.colors?.[0], 1);
    } else {
      setShowSizes(!showSizes);
    }
  };

  const handleSizeSelect = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, selectedColor || product.colors?.[0], 1);
    setShowSizes(false);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card" onMouseLeave={() => setShowSizes(false)}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className={`product-card-img-wrap${product.images?.[1] ? ' has-secondary-img' : ''}`}>
          {/* Images */}
          <img
            className="primary-img"
            src={product.images?.[0]?.url || product.images?.[0] || 'https://placehold.co/400x500?text=No+Image'}
            alt={product.name}
          />
          {(product.images?.[1]?.url || product.images?.[1]) && (
            <img
              className="secondary-img"
              src={product.images[1]?.url || product.images[1]}
              alt={product.name}
            />
          )}

          {/* Discount Badge */}
          {discountPct > 0 && (
            <div className="product-tag">{discountPct}% OFF</div>
          )}

          {/* Wishlist Button */}
          <button
            className={`product-wishlist-btn${wishlisted ? ' active' : ''}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg viewBox="0 0 24 24" fill={wishlisted ? '#5fa8d3' : 'none'} stroke={wishlisted ? '#5fa8d3' : '#9ca3af'} strokeWidth="2" width="16" height="16">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Quick selection overlay (Size & Color) */}
          {showSizes && (
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'rgba(255,255,255,0.98)',
              padding: '12px',
              borderTop: '1px solid var(--gray-100)',
              animation: 'slideUp 0.15s ease',
              zIndex: 10,
              boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
            }}>
              {/* Size Section */}
              <p style={{ fontSize: 10, fontWeight: 800, marginBottom: 8, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Size
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    className={`size-chip${s.stock === 0 ? ' disabled' : ''}${selectedSize === s.size ? ' selected' : ''}`}
                    onClick={(e) => s.stock > 0 && handleSizeSelect(e, s.size)}
                    style={{ minWidth: 42, height: 32, fontSize: 11, borderRadius: 6 }}
                  >
                    {s.size}
                  </button>
                ))}
              </div>

              {/* Color Section - only if colors exist */}
              {product.colors?.length > 1 && (
                <>
                  <p style={{ fontSize: 10, fontWeight: 800, marginBottom: 8, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Color
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(c); }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 600,
                          background: selectedColor === c ? 'var(--primary)' : 'var(--gray-50)',
                          color: selectedColor === c ? 'white' : 'var(--gray-700)',
                          border: `1px solid ${selectedColor === c ? 'var(--primary)' : 'var(--gray-200)'}`,
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="product-card-body">
          <div className="product-brand">{product.brand || 'Jay Kuldevi'}</div>
          <div className="product-name">{product.name}</div>

          {/* Wrap ratings, price, and stock info to push them all to the bottom uniformly */}
          <div style={{ marginTop: 'auto' }}>
            {/* Ratings */}
            {product.numReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <span style={{
                  background: 'var(--success)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 3,
                  display: 'flex', alignItems: 'center', gap: 2
                }}>
                  {product.ratings?.toFixed(1)} <IconStar size={10} color="white" style={{ display: 'inline', verticalAlign: 'middle' }} />
                </span>
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({product.numReviews})</span>
              </div>
            )}

            <div className="product-price-wrap">
              <span className="product-price">₹{product.discountedPrice?.toLocaleString('en-IN')}</span>
              {discountPct > 0 && (
                <>
                  <span className="product-mrp">₹{product.price?.toLocaleString('en-IN')}</span>
                  <span className="product-discount-pct">({discountPct}% OFF)</span>
                </>
              )}
            </div>

            {inStockSizes.length === 0 && (
              <div style={{ fontSize: 11, color: 'var(--error)', fontWeight: 600, marginTop: 4 }}>
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Bag button */}
      {inStockSizes.length > 0 && (
        <button
          className="btn btn-outline btn-sm"
          style={{
            width: 'calc(100% - 16px)',
            margin: 'auto 8px 10px',
            borderColor: 'var(--primary)',
            color: 'var(--primary)',
          }}
          onClick={handleAddToBag}
        >
          + ADD TO BAG
        </button>
      )}
    </div>
  );
}
