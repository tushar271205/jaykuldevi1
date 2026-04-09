import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconBarChart, IconShirt, IconPackage, IconDollar, IconTicket, IconUsers, IconHome, IconLogOut } from '../../components/common/Icons';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: <IconBarChart size={18} />, label: 'Dashboard' },
  { to: '/admin/products', icon: <IconShirt size={18} />, label: 'Products' },
  { to: '/admin/orders', icon: <IconPackage size={18} />, label: 'Orders' },
  { to: '/admin/revenue', icon: <IconDollar size={18} />, label: 'Revenue' },
  { to: '/admin/coupons', icon: <IconTicket size={18} />, label: 'Coupons' },
  { to: '/admin/users', icon: <IconUsers size={18} />, label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#1a1a2e',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        zIndex: 200,
        overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <img src="/FullLogo.jpg" alt="Jay Kuldevi Logo" style={{ height: 32, width: 'auto', borderRadius: 4, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-brand)', fontSize: 20, fontWeight: 600, color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase', textShadow: '0.1px 0 0 var(--secondary)' }}>Jay Kuldevi</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Admin Panel
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 0', overflow: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.05)' : 'none',
                borderLeft: `3px solid ${isActive ? 'var(--secondary)' : 'transparent'}`,
                textDecoration: 'none',
                transition: 'all 0.15s',
              })}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--secondary)', color: 'var(--gray-900)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 12, padding: '6px' }}
              onClick={() => navigate('/')}
            >
              <IconHome size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Store
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, color: '#ef4444', fontSize: 12, padding: '6px' }}
              onClick={logout}
            >
              <IconLogOut size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 240, padding: '24px', minHeight: '100vh', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
