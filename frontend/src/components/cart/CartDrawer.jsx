import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';
import { IconTruck, IconParty, IconShoppingBag } from '../../components/common/Icons';

export default function CartDrawer() {
  const {
    cartItems, cartCount, cartSubtotal, cartMRP, cartDiscount,
    shippingCharge, cartTotal, isCartOpen, setIsCartOpen,
    removeFromCart, updateQuantity, moveToWishlist
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleMoveToWishlist = async (item) => {
    if (!isWishlisted(item.productId)) {
      await toggleWishlist(item.productId);
    } else {
      toast.success('Already in wishlist ❤️');
    }
    moveToWishlist(item.cartItemId); // Removes from cart
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer" id="cart-drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>My Bag</h3>
            {cartCount > 0 && (
              <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                {cartCount} item{cartCount > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Shipping Banner */}
        {cartSubtotal < 499 && cartCount > 0 && (
          <div style={{
            background: 'var(--primary-50)',
            borderBottom: '1px solid var(--primary-light)',
            padding: '8px 20px',
            fontSize: 12,
            color: 'var(--primary-dark)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <IconTruck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Shop ₹{(499 - cartSubtotal).toLocaleString('en-IN')} more for FREE delivery!
          </div>
        )}

        {cartSubtotal >= 499 && cartCount > 0 && (
          <div style={{
            background: 'var(--success-light)',
            borderBottom: '1px solid #6ee7b7',
            padding: '8px 20px',
            fontSize: 12,
            color: '#065f46',
            fontWeight: 600,
          }}>
            <IconParty size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> You've unlocked FREE delivery!
          </div>
        )}

        {/* Cart Items */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><IconShoppingBag size={48} /></div>
              <div className="empty-state-title">Your bag is empty</div>
              <div className="empty-state-text">Add some cute outfits for your little one!</div>
              <button
                className="btn btn-primary mt-4"
                onClick={() => { setIsCartOpen(false); navigate('/'); }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cartItems.map((item) => (
                <div key={item.cartItemId} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-100)',
                }}>
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} onClick={() => setIsCartOpen(false)}>
                    <div style={{
                      width: 72, height: 88,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      background: 'var(--gray-200)',
                      flexShrink: 0,
                    }}>
                      <img
                        src={item.image || 'https://placehold.co/80x100?text=?'}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 2 }}>
                      {item.brand}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 4, lineHeight: 1.4 }}
                      className="line-clamp-2">
                      {item.name}
                    </div>

                    <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
                      <span>Size: <strong>{item.size}</strong></span>
                      {item.color && <span>| {item.color}</span>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty stepper */}
                      <div className="qty-stepper">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          disabled={item.quantity >= (item.maxStock || 10)}
                        >+</button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                          ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                        {item.price !== item.discountedPrice && (
                          <div style={{ fontSize: 11, color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button
                        style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                        onClick={() => handleMoveToWishlist(item)}
                      >
                        MOVE TO WISHLIST
                      </button>
                      <button
                        style={{ fontSize: 11, color: 'var(--error)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — Order Summary */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            {/* Order Summary */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                Order Summary ({cartCount} item{cartCount > 1 ? 's' : ''})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Bag Total', `₹${cartMRP.toLocaleString('en-IN')}`],
                  ...(cartDiscount > 0 ? [['Discount', `-₹${cartDiscount.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                  ['Shipping & Platform Fee', shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`,
                    shippingCharge === 0 ? 'var(--success)' : undefined],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--gray-600)' }}>{label}</span>
                    <span style={{ fontWeight: 600, color: color || 'var(--gray-800)' }}>{value}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, borderTop: '1px solid var(--gray-200)', paddingTop: 8, marginTop: 4 }}>
                  <span>Total Payable Amount</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'right' }}>
                  (including tax)
                </div>
              </div>

              {cartDiscount > 0 && (
                <div style={{
                  background: 'var(--success-light)',
                  color: '#065f46',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  fontWeight: 600,
                  marginTop: 8,
                }}>
                   <IconParty size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> You save ₹{cartDiscount.toLocaleString('en-IN')} on this order!
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              CHECKOUT →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
