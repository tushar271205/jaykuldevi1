import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createStripePaymentIntent, confirmPayment, placeCODOrder } from '../../api/orders';
import { applyCoupon } from '../../api/coupons';
import toast from 'react-hot-toast';
import StripeContainer from '../../components/payment/StripeContainer';
import { IconCreditCard, IconMoney, IconPhone, IconParty } from '../../components/common/Icons';

const PAYMENT_METHODS = [
  { id: 'stripe', label: 'Online Payment', sub: 'Debit/Credit Card, Net Banking', icon: <IconCreditCard size={18} /> },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: <IconMoney size={18} /> },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, cartMRP, cartDiscount, shippingCharge, clearCart } = useCart();
  const { user, refetchUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Address, 2: Coupon, 3: Payment
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '', mobile: user?.mobile || '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  });

  const [stripeIntent, setStripeIntent] = useState(null); // { clientSecret, orderId, amount }

  useEffect(() => {
    if (cartItems.length === 0) navigate('/');
    if (user?.addresses?.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(def);
    }
  }, [user]);

  const finalAmount = cartSubtotal - couponDiscount + shippingCharge;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await applyCoupon(couponCode, cartSubtotal);
      setCouponDiscount(res.data.discount || 0);
      setCouponApplied(couponCode.toUpperCase());
      toast.success(`Coupon applied! You save ₹${res.data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const handleStripePayment = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    if (!selectedAddress.fullName || !selectedAddress.mobile || !selectedAddress.addressLine1 || !selectedAddress.city || !selectedAddress.state || !selectedAddress.pincode) {
      toast.error('Please complete all required fields in the delivery address.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId, size: item.size, color: item.color, quantity: item.quantity,
        })),
        shippingAddress: selectedAddress,
        couponCode: couponApplied,
      };

      const res = await createStripePaymentIntent(payload);
      setStripeIntent({
        clientSecret: res.data.clientSecret,
        orderId: res.data.orderId,
        amount: finalAmount
      });
    } catch (err) {
      console.error('Stripe initialization error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    if (!selectedAddress.fullName || !selectedAddress.mobile || !selectedAddress.addressLine1 || !selectedAddress.city || !selectedAddress.state || !selectedAddress.pincode) {
      toast.error('Please complete all required fields in the delivery address.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId, size: item.size, color: item.color, quantity: item.quantity,
        })),
        shippingAddress: selectedAddress,
        couponCode: couponApplied,
      };
      const res = await placeCODOrder(payload);
      clearCart();
      await refetchUser();
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      console.error('COD placement error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'stripe') handleStripePayment();
    else handleCOD();
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Checkout</h1>

      <div className="resp-grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        {/* LEFT — Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* STEP 1: Address */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= 1 ? 'var(--primary)' : 'var(--gray-200)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>1</div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Delivery Address</span>
              </div>
              {selectedAddress && step > 1 && (
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)} style={{ color: 'var(--primary)', fontSize: 12 }}>
                  CHANGE
                </button>
              )}
            </div>

            {step === 1 && (
              <div className="card-body">
                {/* Saved Addresses */}
                {user?.addresses?.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {user.addresses.map((addr, i) => (
                      <label key={i} style={{
                        display: 'flex', gap: 12, padding: 14,
                        border: `1.5px solid ${selectedAddress?._id === addr._id || (selectedAddress && selectedAddress === addr) ? 'var(--primary)' : 'var(--gray-200)'}`,
                        borderRadius: 8, cursor: 'pointer',
                        background: (selectedAddress?._id === addr._id || selectedAddress === addr) ? 'var(--primary-50)' : 'var(--white)',
                      }}>
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr || selectedAddress?._id === addr._id}
                          onChange={() => setSelectedAddress(addr)}
                        />
                        <div style={{ fontSize: 13 }}>
                          <div style={{ fontWeight: 600, marginBottom: 2 }}>{addr.fullName} — {addr.label || 'Home'}</div>
                          <div style={{ color: 'var(--gray-500)', lineHeight: 1.5 }}>
                            {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                            {addr.city}, {addr.state} — {addr.pincode}<br />
                            <IconPhone size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {addr.mobile}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Quick address form */}
                {(showAddressForm || !user?.addresses || user.addresses.length === 0) && (
                  <div className="resp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[
                      { key: 'fullName', label: 'Full Name', col: 2 },
                      { key: 'mobile', label: 'Mobile', type: 'tel' },
                      { key: 'addressLine1', label: 'Address Line 1', col: 2 },
                      { key: 'addressLine2', label: 'Address Line 2 (optional)', col: 2 },
                      { key: 'city', label: 'City' },
                      { key: 'state', label: 'State' },
                      { key: 'pincode', label: 'Pincode' },
                    ].map(({ key, label, col, type }) => (
                      <div key={key} className="form-group" style={{ gridColumn: col === 2 ? '1 / -1' : undefined }}>
                        <label className="form-label">{label}</label>
                        <input
                          className="form-input"
                          type={type || 'text'}
                          placeholder={label}
                          value={addressForm[key]}
                          onChange={(e) => setAddressForm((p) => ({ ...p, [key]: e.target.value }))}
                        />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedAddress(addressForm);
                          setShowAddressForm(false);
                        }}
                      >
                        Use This Address
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {user?.addresses?.length > 0 && !showAddressForm && (
                    <button className="btn btn-outline btn-sm" onClick={() => setShowAddressForm(true)}>
                      + Add New Address
                    </button>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={() => { if (selectedAddress) setStep(2); else toast.error('Select an address'); }}
                    disabled={!selectedAddress}
                  >
                    Deliver Here →
                  </button>
                </div>
              </div>
            )}

            {selectedAddress && step > 1 && (
              <div className="card-body" style={{ paddingTop: 12, paddingBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                  <strong>{selectedAddress.fullName}</strong> — {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Coupon */}
          {step >= 2 && (
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'var(--gray-200)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>2</div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Apply Coupon</span>
                </div>
              </div>
              <div className="card-body">
                {couponApplied ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--success-light)', padding: '10px 14px', borderRadius: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>
                      <IconParty size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Coupon "{couponApplied}" applied! Saving ₹{couponDiscount}
                    </span>
                    <button style={{ fontSize: 12, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => { setCouponApplied(''); setCouponDiscount(0); setCouponCode(''); }}>
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      className="form-input"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button className="btn btn-primary" onClick={handleApplyCoupon}>APPLY</button>
                  </div>
                )}
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn-primary" onClick={() => setStep(3)} style={{ marginTop: 8 }}>Continue →</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step >= 3 && (
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>3</div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Choose Payment Method</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id} style={{
                      display: 'flex', gap: 12, padding: 16,
                      border: `1.5px solid ${paymentMethod === method.id ? 'var(--primary)' : 'var(--gray-200)'}`,
                      borderRadius: 10, cursor: 'pointer',
                      background: paymentMethod === method.id ? 'var(--primary-50)' : 'white',
                    }}>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
                          <span>{method.icon}</span> {method.label}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{method.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  id="place-order-btn"
                >
                  {loading ? 'Processing...' : `PLACE ORDER ₹${finalAmount.toLocaleString('en-IN')} →`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Order Summary */}
        <div className="card sticky-top">
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 14 }}>ORDER SUMMARY ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
          </div>
          <div className="card-body">
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {cartItems.map((item) => (
                <div key={item.cartItemId} style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 52, height: 64, borderRadius: 6, overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={item.image || ''} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/104x128?text=Jay+Kuldevi';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, fontSize: 12 }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }} className="line-clamp-2">{item.name}</div>
                    <div style={{ color: 'var(--gray-400)' }}>Size: {item.size} | Qty: {item.quantity}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-800)', marginTop: 2 }}>
                      ₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['Bag Total', `₹${cartMRP.toLocaleString('en-IN')}`],
                ...(cartDiscount > 0 ? [['Product Discount', `-₹${cartDiscount.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                ...(couponDiscount > 0 ? [['Coupon Discount', `-₹${couponDiscount.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                ['Shipping & Platform Fee', shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`, shippingCharge === 0 ? 'var(--success)' : undefined],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: c || 'var(--gray-800)' }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
              <span>Total Payable</span>
              <span>₹{finalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'right', marginBottom: 12 }}>
              (including tax)
            </div>

            {(cartDiscount + couponDiscount) > 0 && (
              <div style={{
                background: 'var(--success-light)', color: '#065f46',
                padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              }}>
                <IconParty size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> You're saving ₹{(cartDiscount + couponDiscount).toLocaleString('en-IN')}!
              </div>
            )}
          </div>
        </div>
      </div>

      {stripeIntent && (
        <StripeContainer 
          clientSecret={stripeIntent.clientSecret}
          orderId={stripeIntent.orderId}
          amount={stripeIntent.amount}
          onCancel={() => setStripeIntent(null)}
          onSuccess={async () => {
            clearCart();
            await refetchUser();
            navigate(`/order-success/${stripeIntent.orderId}`);
          }}
        />
      )}
    </div>
  );
}
