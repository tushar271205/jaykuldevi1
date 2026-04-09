import { useState, useEffect } from 'react';
import { getAdminUsers } from '../../api/admin';
import toast from 'react-hot-toast';
import { IconSearch } from '../../components/common/Icons';
import Pagination from '../../components/common/Pagination';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');

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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Customers</h1>
        {pagination.total > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{pagination.total} registered customers</span>
        )}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <form className="search-form" style={{ backgroundColor: 'white', height: 40, flex: 1, minWidth: 260, maxWidth: 400 }} onSubmit={(e) => { e.preventDefault(); setPage(1); fetchUsers(); }}>
          <IconSearch size={18} color="var(--gray-400)" />
          <input className="search-input" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" className="search-clear" onClick={() => { setSearch(''); }}>✕</button>}
        </form>
        <button className="btn btn-outline btn-sm" style={{ height: 40 }} onClick={() => { setPage(1); fetchUsers(); }}>Search</button>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Wishlist</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>No customers found</td></tr>
              ) : users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: user.role === 'admin' ? 'var(--secondary)' : 'var(--primary)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}>
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${user.role === 'admin' ? 'secondary' : 'primary'}`} style={{ fontSize: 11, textTransform: 'capitalize' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{user.orderCount || 0}</td>
                  <td style={{ fontSize: 13 }}>{user.wishlist?.length || 0} items</td>
                  <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{user.mobile || '—'}</td>
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
