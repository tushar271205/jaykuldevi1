import { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser, updateAdminUserRole } from '../../api/admin';
import toast from 'react-hot-toast';
import { IconSearch } from '../../components/common/Icons';
import Pagination from '../../components/common/Pagination';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await getAdminUsers(params);
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`)) return;
    
    setActionLoading(id);
    try {
      await deleteAdminUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;

    setActionLoading(id);
    try {
      await updateAdminUserRole(id, newRole);
      toast.success(`Role updated to ${newRole}`);
      // Optimistic upate or refetch
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>User Management</h1>
        {pagination.total > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{pagination.total} registered users</span>
        )}
      </div>

      {/* Search */}
      <div className="admin-header-flex" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form className="search-form" style={{ backgroundColor: 'white', height: 40, flex: 1, minWidth: '100%', maxWidth: 'none' }} onSubmit={(e) => { e.preventDefault(); setPage(1); fetchUsers(); }}>
          <IconSearch size={18} color="var(--gray-400)" />
          <input className="search-input" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" className="search-clear" onClick={() => { setSearch(''); }}>✕</button>}
        </form>
        <button className="btn btn-outline btn-sm" style={{ height: 40, width: '100%' }} onClick={() => { setPage(1); fetchUsers(); }}>Search</button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Stats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                        <div>
                          <div className="skeleton" style={{ height: 13, width: 110, borderRadius: 6, marginBottom: 6 }} />
                          <div className="skeleton" style={{ height: 10, width: 150, borderRadius: 6 }} />
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton" style={{ height: 20, width: 60, borderRadius: 12 }} /></td>
                    <td><div className="skeleton" style={{ height: 13, width: 80, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 13, width: 70, borderRadius: 6 }} /></td>
                    <td><div style={{ display: 'flex', gap: 8 }}><div className="skeleton" style={{ height: 28, width: 90, borderRadius: 6 }} /><div className="skeleton" style={{ height: 28, width: 52, borderRadius: 6 }} /></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>No users found</td></tr>
              ) : users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: user.role === 'admin' ? '#1a1a2e' : 'var(--primary)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}>
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{user.email}</div>
                        {user.mobile && <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 2 }}>{user.mobile}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`badge badge-${user.role === 'admin' ? 'secondary' : 'primary'}`} 
                      style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 8px' }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>
                      <strong>{user.orderCount || 0}</strong> Orders<br/>
                      <span style={{ color: 'var(--gray-400)' }}>{user.wishlist?.length || 0} Wishlist</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        className={`btn btn-sm ${user.role === 'admin' ? 'btn-outline' : 'btn-secondary'}`}
                        style={{ fontSize: 11, padding: '4px 8px' }}
                        disabled={actionLoading === user._id}
                        onClick={() => handleRoleToggle(user._id, user.role)}
                      >
                        {user.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                      </button>
                      <button 
                        className="btn btn-sm btn-ghost"
                        style={{ fontSize: 11, color: '#ef4444', padding: '4px 8px' }}
                        disabled={actionLoading === user._id}
                        onClick={() => handleDeleteUser(user._id, user.name)}
                      >
                        Delete
                      </button>
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
    </div>
  );
}

