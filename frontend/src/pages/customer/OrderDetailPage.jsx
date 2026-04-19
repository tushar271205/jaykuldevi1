import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, downloadBill, cancelOrder, requestReplacement } from '../../api/orders';
import toast from 'react-hot-toast';
import { IconCheck, IconSettings, IconTruck, IconPackage, IconParty, IconX, IconRefresh, IconWarning, IconStar, IconFile, IconPhone } from '../../components/common/Icons';

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  replacement_requested: 'Replacement Requested',
  replaced: 'Replaced',
};
const STATUS_ICONS = {
  confirmed: <IconCheck size={14} />, processing: <IconSettings size={14} />, shipped: <IconTruck size={14} />,
  out_for_delivery: <IconPackage size={14} />, delivered: <IconParty size={14} />,
  cancelled: <IconX size={14} />, returned: <IconRefresh size={14} />,
  replacement_requested: <IconRefresh size={14} />, replaced: <IconCheck size={14} />
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [replacing, setReplacing] = useState(false);

  const fetchOrder = () => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDownloadBill = async () => {
    setDownloading(true);
    try {
      const res = await downloadBill(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Jay Kuldevi_Bill_${order.orderNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download bill');
    } finally {
      setDownloading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await cancelOrder(id, { reason: 'Cancelled by customer' });
      toast.success('Order cancelled successfully.');
      fetchOrder(); // Reload
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReplaceOrder = async () => {
    const reason = window.prompt('Please describe the reason for your replacement or exchange request (e.g., Size issue, Damaged item):');
    if (!reason) return;
    if (reason.trim().length < 10) {
      toast.error('Please provide a more detailed reason.');
      return;
    }
    setReplacing(true);
    try {
      await requestReplacement(id, { reason });
      toast.success('Replacement request submitted successfully.');
      fetchOrder(); // Reload
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setReplacing(false);
    }
  };

  if (loading) return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* Breadcrumb skeleton */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 12, width: 40, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: 8, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: 70, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: 8, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: 90, borderRadius: 6 }} />
      </div>
      {/* Header skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div className="skeleton" style={{ height: 26, width: 200, borderRadius: 8, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 13, width: 160, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="skeleton" style={{ height: 32, width: 100, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 32, width: 120, borderRadius: 20 }} />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="resp-grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tracking card */}
          <div className="card">
            <div className="card-header"><div className="skeleton" style={{ height: 14, width: 80, borderRadius: 6 }} /></div>
            <div className="card-body">
              {[1,2,3,4,5].map((i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
                  <div>
                    <div className="skeleton" style={{ height: 13, width: 100, borderRadius: 6, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: 130, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Items card */}
          <div className="card">
            <div className="card-header"><div className="skeleton" style={{ height: 14, width: 110, borderRadius: 6 }} /></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1,2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div className="skeleton" style={{ width: 72, height: 88, borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: '50%', borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 15, width: 80, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Payment summary card */}
        <div className="card">
          <div className="card-header"><div className="skeleton" style={{ height: 14, width: 120, borderRadius: 6 }} /></div>
          <div className="card-body">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div className="skeleton" style={{ height: 13, width: 90, borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 13, width: 60, borderRadius: 6 }} />
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <div className="skeleton" style={{ height: 18, width: 80, borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 18, width: 70, borderRadius: 6 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!order) return <div className="container" style={{ paddingTop: 48, textAlign: 'center' }}>Order not found</div>;

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'returned';
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);

  let canReplace = false;
  if ((order.status === 'delivered' || order.status === 'replaced') && (order.deliveredAt || order.replacedAt)) {
    const baseDate = order.replacedAt || order.deliveredAt;
    const daysSinceDelivery = (Date.now() - new Date(baseDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery <= 10) {
      canReplace = true;
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginBottom: 20 }}>
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/account/orders">My Orders</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{order.orderNumber}</span>
      </div>

      {order.paymentStatus === 'refund_pending' && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: '12px 16px', borderRadius: 8, marginBottom: 20, color: '#d48806', fontSize: 14 }}>
          <IconWarning size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> <strong>Refund Pending:</strong> Your order has been cancelled and your refund request is pending admin approval. The amount will be credited back to your original payment method in 2-3 business days after approval.
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Order #{order.orderNumber}</h1>
          <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className={`status-badge status-${order.status}`}>
            {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
          </span>
          {canCancel && (
            <button
              className={`btn btn-outline btn-sm${cancelling ? ' btn-loading' : ''}`}
              onClick={handleCancelOrder}
              disabled={cancelling}
              style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
            >
              <IconX size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Cancel Order
            </button>
          )}
          {(order.status === 'delivered' || order.status === 'replaced') && (
            <button
              className={`btn btn-outline btn-sm${downloading ? ' btn-loading' : ''}`}
              onClick={handleDownloadBill}
              disabled={downloading}
            >
              <IconFile size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Download Bill
            </button>
          )}
          {canReplace && (
            <button
              className={`btn btn-outline btn-sm${replacing ? ' btn-loading' : ''}`}
              onClick={handleReplaceOrder}
              disabled={replacing}
              style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
            >
              <IconRefresh size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Replace / Exchange
            </button>
          )}
        </div>
      </div>

      <div className="resp-grid-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Order Tracking */}
          {!isCancelled && (
            <div className="card">
              <div className="card-header">
                <span style={{ fontWeight: 700, fontSize: 14 }}>TRACKING</span>
              </div>
              <div className="card-body">
                <div className="order-tracker">
                  {STATUS_STEPS.map((status, i) => {
                    const isDone = currentStepIdx > i;
                    const isActive = currentStepIdx === i;
                    const stepEntry = order.statusHistory?.find((h) => h.status === status);
                    return (
                      <div key={status} className={`tracker-step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
                        <div className="tracker-icon">
                          {isDone ? <IconCheck size={12} /> : isActive ? STATUS_ICONS[status] : '○'}
                        </div>
                        <div className="tracker-info">
                          <div className="tracker-label">{STATUS_LABELS[status]}</div>
                          {stepEntry && (
                            <div className="tracker-time">{new Date(stepEntry.timestamp).toLocaleString('en-IN')}</div>
                          )}
                          {stepEntry?.message && (
                            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{stepEntry.message}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.estimatedDelivery && (
                  <div style={{
                    background: 'var(--primary-50)', padding: '10px 14px', borderRadius: 8,
                    fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 16,
                  }}>
                    <IconTruck size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14 }}>ITEMS ORDERED</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, borderBottom: i < order.items.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ width: 72, height: 88, borderRadius: 8, overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={item.productImage || ''} 
                      alt={item.productName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/144x176?text=Jay+Kuldevi';
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.productName}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>
                      Size: {item.size} {item.color && `| Color: ${item.color}`} | Qty: {item.quantity}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</span>
                      {item.price !== item.discountedPrice && (
                        <span style={{ fontSize: 12, color: 'var(--gray-400)', textDecoration: 'line-through' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {(order.status === 'delivered' || order.status === 'replaced') && (
                      <Link
                        to={`/review/${order._id}/${item.product?._id || item.product}`}
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 8, color: 'var(--primary)', paddingLeft: 0, fontSize: 12 }}
                      >
                        <IconStar size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Rate & Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="card">
              <div className="card-header"><span style={{ fontWeight: 700, fontSize: 14 }}>DELIVERY ADDRESS</span></div>
              <div className="card-body" style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                <strong>{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}<br />
                <IconPhone size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {order.shippingAddress.mobile}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Payment Summary */}
        <div className="card sticky-top">
          <div className="card-header"><span style={{ fontWeight: 700, fontSize: 14 }}>PAYMENT DETAILS</span></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['Payment Method', order.paymentMethod === 'cod' ? <><IconPackage size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Cash on Delivery</> : <><IconCheck size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Online Payment</>],
                ['Payment Status', order.paymentStatus],
                ...(order.razorpayPaymentId ? [['Payment ID', order.razorpayPaymentId.slice(0, 20) + '...']] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>{k}</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}

              <div className="divider" />

              {[
                ['Subtotal', `₹${order.subtotal?.toLocaleString('en-IN')}`],
                ...(order.discountTotal > 0 ? [['Product Discount', `-₹${order.discountTotal?.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                ...(order.couponDiscount > 0 ? [['Coupon Discount', `-₹${order.couponDiscount?.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                ...(order.firstOrderDiscount > 0 ? [['First Order Discount', `-₹${order.firstOrderDiscount?.toLocaleString('en-IN')}`, 'var(--success)']] : []),
                ['Shipping', order.shippingCharge > 0 ? `₹${order.shippingCharge}` : 'FREE', order.shippingCharge === 0 ? 'var(--success)' : undefined],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--gray-500)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: c || 'var(--gray-800)' }}>{v}</span>
                </div>
              ))}

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                <span>Total Paid</span>
                <span>₹{order.finalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
