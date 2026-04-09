import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/admin';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { IconDollar, IconPackage, IconUsers, IconShirt } from '../../components/common/Icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STATUS_LABELS = { pending:'Pending', confirmed:'Confirmed', processing:'Processing', shipped:'Shipped', out_for_delivery:'Out for Delivery', delivered:'Delivered', cancelled:'Cancelled' };

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background: 'white', borderRadius: 16, padding: '24px 24px',
    border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)',
    display: 'flex', alignItems: 'flex-start', gap: 16,
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-900)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
    </div>
  );

  const { stats, recentOrders } = data || {};

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--gray-400)', fontSize: 13, marginTop: 2 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/products" className="btn btn-primary">+ Add Product</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon={<IconDollar size={24} />} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} sub="From paid orders" color="#10b981" />
        <StatCard icon={<IconPackage size={24} />} label="Total Orders" value={(stats?.totalOrders || 0).toLocaleString()} sub="Active orders" color="#3b82f6" />
        <StatCard icon={<IconUsers size={24} />} label="Customers" value={(stats?.totalUsers || 0).toLocaleString()} sub="Registered users" color="#8b5cf6" />
        <StatCard icon={<IconShirt size={24} />} label="Products" value={(stats?.totalProducts || 0).toLocaleString()} sub="Active listings" color="#f59e0b" />
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>View All →</Link>
        </div>
        <div className="table-wrap">
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
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td><Link to={`/order/${order._id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>{order.orderNumber}</Link></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.user?.name || 'Guest'}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{order.items?.length || 0} item{order.items?.length > 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.finalAmount?.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: order.paymentMethod === 'cod' ? 'var(--warning)' : 'var(--success)' }}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status}`} style={{ fontSize: 10 }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
