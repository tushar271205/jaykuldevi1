import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, approveRefund } from '../../api/orders';
import toast from 'react-hot-toast';
import { IconSearch } from '../../components/common/Icons';
import Pagination from '../../components/common/Pagination';

const STATUS_LIST = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'replacement_requested', 'replaced'];
const STATUS_LABELS = { pending:'Pending', confirmed:'Confirmed', processing:'Processing', shipped:'Shipped', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled', returned:'Returned', replacement_requested: 'Replacement Requested', replaced: 'Replaced' };

function StatusModal({ order, onClose, onUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateOrderStatus(order._id, { status, message });
      toast.success('Order status updated!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Update Order Status</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--gray-500)' }}>
            Order: <strong style={{ color: 'var(--gray-900)' }}>{order.orderNumber}</strong>
          </div>
          {order.replacementReason && (
            <div style={{ padding: '10px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', marginBottom: 4 }}>Replacement Reason:</div>
              <div style={{ fontSize: 13, color: '#7c2d12' }}>{order.replacementReason}</div>
            </div>
          )}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">New Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message (optional)</label>
            <input className="form-input" placeholder="e.g. Dispatched via India Post" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className={`btn btn-primary${loading ? ' btn-loading' : ''}`} onClick={handleSubmit} disabled={loading}>
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updateOrder, setUpdateOrder] = useState(null);
  const [refunding, setRefunding] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await getAllOrders(params);
      setOrders(res.data.orders || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleApproveRefund = async (id) => {
    if (!window.confirm('Are you sure you want to approve and process this refund?')) return;
    setRefunding(id);
    try {
      await approveRefund(id);
      toast.success('Refund approved successfully!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve refund.');
    } finally {
      setRefunding(null);
    }
  };

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Orders</h1>
        {pagination.total > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{pagination.total} total orders</span>
        )}
      </div>

      {/* Filters */}
      <div className="admin-header-flex" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form className="search-form" style={{ backgroundColor: 'white', height: 40, flex: 1, minWidth: '100%', maxWidth: 'none' }} onSubmit={(e) => { e.preventDefault(); setPage(1); fetchOrders(); }}>
          <IconSearch size={18} color="var(--gray-400)" />
          <input className="search-input" placeholder="Search order #" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" className="search-clear" onClick={() => { setSearch(''); }}>✕</button>}
        </form>
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ flex: 1, height: 40 }}>
            <option value="">All Status</option>
            {STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" style={{ height: 40, flexShrink: 0 }} onClick={() => { setPage(1); fetchOrders(); }}>Search</button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton" style={{ height: 14, width: 80, borderRadius: 6 }} /><div className="skeleton" style={{ height: 10, width: 50, borderRadius: 6, marginTop: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} /><div className="skeleton" style={{ height: 10, width: 130, borderRadius: 6, marginTop: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 60, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 60, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 40, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 22, width: 80, borderRadius: 12 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 70, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 28, width: 90, borderRadius: 6 }} /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{order._id.slice(-8)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{order.user?.name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{order.user?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</div>
                    {order.items?.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }} className="line-clamp-1">{order.items[0]?.productName}</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{order.finalAmount?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'capitalize' }}>{order.paymentStatus}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: order.paymentMethod === 'cod' ? '#f59e0b' : '#10b981' }}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status}`} style={{ fontSize: 10 }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                      <button className="btn btn-primary btn-sm" style={{ fontSize: 11 }} onClick={() => setUpdateOrder(order)}>
                        Update Status
                      </button>
                      {order.paymentStatus === 'refund_pending' && (
                        <button 
                          className={`btn btn-outline btn-sm${refunding === order._id ? ' btn-loading' : ''}`} 
                          style={{ fontSize: 11, color: '#f59e0b', borderColor: '#f59e0b', padding: '4px 8px' }} 
                          disabled={refunding === order._id}
                          onClick={() => handleApproveRefund(order._id)}>
                          Approve Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination 
          page={page} 
          pages={pagination.pages} 
          onPageChange={setPage} 
          style={{ padding: 16 }}
        />
      </div>

      {updateOrder && (
        <StatusModal
          order={updateOrder}
          onClose={() => setUpdateOrder(null)}
          onUpdated={fetchOrders}
        />
      )}
    </div>
  );
}
