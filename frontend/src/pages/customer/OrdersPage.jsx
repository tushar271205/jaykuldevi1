import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, downloadBill } from '../../api/orders';
import toast from 'react-hot-toast';
import { IconCheck, IconSettings, IconTruck, IconPackage, IconParty, IconX, IconRefresh, IconClock } from '../../components/common/Icons';

const STATUS_LABELS = { pending:'Pending', confirmed:'Confirmed', processing:'Processing', shipped:'Shipped', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled', returned:'Returned' };
const STATUS_ICONS = {
  confirmed: <IconCheck size={12} />, processing: <IconSettings size={12} />, shipped: <IconTruck size={12} />,
  out_for_delivery: <IconPackage size={12} />, delivered: <IconParty size={12} />,
  cancelled: <IconX size={12} />, returned: <IconRefresh size={12} />, pending: <IconClock size={12} />,
};
const STATUS_TABS = ['all', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (activeTab !== 'all') params.status = activeTab;
        const res = await getMyOrders(params);
        setOrders(res.data.orders || []);
        setPagination(res.data.pagination || {});
      } catch { toast.error('Failed to load orders'); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [activeTab, page]);

  const handleDownload = async (orderId, orderNumber) => {
    setDownloading(orderId);
    try {
      const res = await downloadBill(orderId);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `Jay Kuldevi_Bill_${orderNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download bill'); }
    finally { setDownloading(''); }
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>My Orders</h1>
        {pagination.total > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{pagination.total} order{pagination.total > 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Status Tabs */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {STATUS_TABS.map((tab) => (
          <div key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => { setActiveTab(tab); setPage(1); }}>
            {tab === 'all' ? 'All Orders' : STATUS_LABELS[tab]}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--gray-100)' }}>
              <div className="skeleton" style={{ height: 120 }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><IconPackage size={48} color="var(--gray-300)" /></div>
          <div className="empty-state-title">No Orders Yet</div>
          <div className="empty-state-text">You haven't placed any orders. Start shopping!</div>
          <Link to="/" className="btn btn-primary mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              {/* Order Header */}
              <div style={{
                padding: '12px 20px',
                background: 'var(--gray-50)',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 2 }}>Order #</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{order.orderNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 2 }}>Date</div>
                    <div style={{ fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 2 }}>Total</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>₹{order.finalAmount?.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 2 }}>Payment</div>
                    <div style={{ fontSize: 13, textTransform: 'capitalize' }}>{order.paymentMethod}</div>
                  </div>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, flex: '1 1 250px', minWidth: 200 }}>
                      <div style={{ width: 56, height: 70, borderRadius: 6, overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={item.productImage || ''} 
                          alt={item.productName} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/56x70/f3f0eb/c9b99a?text=No+Image';
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, fontSize: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }} className="line-clamp-2">{item.productName}</div>
                        <div style={{ color: 'var(--gray-400)', marginBottom: 4 }}>Size: {item.size} | Qty: {item.quantity}</div>
                        <div style={{ fontWeight: 700 }}>₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--gray-400)', padding: '0 8px' }}>
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to={`/order/${order._id}`} className="btn btn-primary btn-sm">View Details</Link>
                {order.status === 'delivered' && (
                  <button
                    className={`btn btn-outline btn-sm${downloading === order._id ? ' btn-loading' : ''}`}
                    onClick={() => handleDownload(order._id, order.orderNumber)}
                    disabled={downloading === order._id}
                  >
                    📄 Download Bill
                  </button>
                )}
                {order.status === 'delivered' && order.items?.map((item) => (
                  <Link key={item.product} to={`/review/${order._id}/${item.product?._id || item.product}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
                    ⭐ Review
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1}>←</button>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i+1} className={`page-btn${page===i+1?' active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" onClick={() => setPage((p) => Math.min(pagination.pages, p+1))} disabled={page===pagination.pages}>→</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
