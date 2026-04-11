import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, addAddress, deleteAddress } from '../../api/users';
import toast from 'react-hot-toast';
import { IconUser, IconMapPin, IconBoy, IconGirl, IconChild, IconPhone } from '../../components/common/Icons';

export default function ProfilePage() {
  const { user, updateUser, refetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    password: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState({
    label: 'Home', fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const payload = { name: form.name, mobile: form.mobile, gender: form.gender };
      if (form.password) payload.password = form.password;

      const res = await updateProfile(payload);
      updateUser(res.data.user);
      toast.success('Profile updated!');
      setForm(p => ({ ...p, password: '', confirmPassword: '' })); // clear password fields
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAddress(addressForm);
      await refetchUser();
      setShowAddressForm(false);
      setAddressForm({ label: 'Home', fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
      toast.success('Address added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      await refetchUser();
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48, maxWidth: 900 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>My Account</h1>

      <div className="resp-grid-profile" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 90 }}>
          {/* Avatar */}
          <div style={{ padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, margin: '0 auto 12px',
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{user?.email}</div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[
              { key: 'profile', label: 'Profile', icon: <IconUser size={16} /> },
              { key: 'addresses', label: 'Addresses', icon: <IconMapPin size={16} /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 20px', background: activeTab === item.key ? 'var(--primary-50)' : 'none',
                  border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  color: activeTab === item.key ? 'var(--primary)' : 'var(--gray-700)',
                  borderLeft: `3px solid ${activeTab === item.key ? 'var(--primary)' : 'transparent'}`,
                  textAlign: 'left',
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Personal Information</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileSave} className="resp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={user?.email || ''} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
                    <span className="form-hint">Email cannot be changed</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input className="form-input" type="tel" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} placeholder="10-digit mobile" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Gender</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                          border: `1.5px solid ${form.gender === g ? 'var(--primary)' : 'var(--gray-200)'}`,
                          borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                          background: form.gender === g ? 'var(--primary-50)' : 'white',
                          color: form.gender === g ? 'var(--primary)' : 'var(--gray-600)',
                          textTransform: 'capitalize',
                        }}>
                          <input type="radio" style={{ display: 'none' }} checked={form.gender === g} onChange={() => setForm((p) => ({ ...p, gender: g }))} />
                          {g === 'male' ? <IconBoy size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : g === 'female' ? <IconGirl size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <IconChild size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />} {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: 12, borderTop: '1px solid var(--gray-100)', paddingTop: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
                    <div className="resp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input className="form-input" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Leave blank to keep current" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input className="form-input" type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm new password" />
                      </div>
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <button type="submit" className={`btn btn-primary${loading ? ' btn-loading' : ''}`} disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Saved Addresses</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                  {showAddressForm ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <div className="card-header"><span style={{ fontWeight: 700 }}>New Address</span></div>
                  <div className="card-body">
                    <form onSubmit={handleAddAddress} className="resp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { k: 'label', l: 'Label (Home/Work)', col: 1 },
                        { k: 'fullName', l: 'Full Name', col: 1 },
                        { k: 'mobile', l: 'Mobile', col: 1, t: 'tel' },
                        { k: 'addressLine1', l: 'Address Line 1', col: 2 },
                        { k: 'addressLine2', l: 'Address Line 2', col: 2 },
                        { k: 'city', l: 'City', col: 1 },
                        { k: 'state', l: 'State', col: 1 },
                        { k: 'pincode', l: 'Pincode', col: 1 },
                      ].map(({ k, l, col, t }) => (
                        <div key={k} className="form-group" style={{ gridColumn: col === 2 ? '1 / -1' : undefined }}>
                          <label className="form-label">{l}</label>
                          <input className="form-input" type={t || 'text'} placeholder={l} value={addressForm[k]} onChange={(e) => setAddressForm((p) => ({ ...p, [k]: e.target.value }))} />
                        </div>
                      ))}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className={`btn btn-primary${loading ? ' btn-loading' : ''}`} disabled={loading}>
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {user?.addresses?.length === 0 ? (
                <div className="empty-state" style={{ minHeight: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><IconMapPin size={36} color="var(--gray-400)" /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-600)' }}>No Addresses Saved</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Add an address to speed up checkout</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.addresses?.map((addr, i) => (
                    <div key={i} className="card">
                      <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                            <span className="badge badge-primary">{addr.label || 'Home'}</span>
                            {addr.isDefault && <span className="badge badge-success">Default</span>}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{addr.fullName}</div>
                          <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                            {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}<br />
                            {addr.city}, {addr.state} — {addr.pincode}<br />
                            <IconPhone size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {addr.mobile}
                          </div>
                        </div>
                        <button style={{ fontSize: 12, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}
                          onClick={() => handleDeleteAddress(addr._id)}>
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
