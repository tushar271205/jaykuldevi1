import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, addAddress, deleteAddress } from '../../api/users';
import toast from 'react-hot-toast';
import { IconUser, IconMapPin, IconBoy, IconGirl, IconChild, IconPhone, IconEye, IconEyeOff } from '../../components/common/Icons';
import PasswordStrength, { passwordError } from '../../components/common/PasswordStrength';

// Slide indicator dots
function SliderDots({ count, active, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            width: active === i ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background: active === i ? 'var(--primary)' : 'var(--gray-200)',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, refetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [slideIndex, setSlideIndex] = useState(0); // 0 = Personal Info, 1 = Change Password
  const [loading, setLoading] = useState(false);

  // Personal info form
  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
  });

  // Change password form
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Address form
  const [addressForm, setAddressForm] = useState({
    label: 'Home', fullName: '', mobile: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const sliderRef = useRef(null);

  const goToSlide = (index) => {
    setSlideIndex(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: index * sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ name: form.name, mobile: form.mobile, gender: form.gender });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const pwErr = passwordError(pwForm.newPassword);
    if (pwErr) { toast.error(pwErr); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({ currentPassword: pwForm.currentPassword, password: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
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

  const SLIDE_TABS = [
    { label: 'Personal Info', icon: '👤' },
    { label: 'Change Password', icon: '🔐' },
  ];

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
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark, #0d3347))',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(27,73,101,0.3)',
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
                  textAlign: 'left', transition: 'all 0.2s',
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* ── Profile Tab with Slider ── */}
          {activeTab === 'profile' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              {/* Slider tab bar */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--gray-100)',
                background: 'var(--gray-50)',
              }}>
                {SLIDE_TABS.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    style={{
                      flex: 1,
                      padding: '14px 12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: slideIndex === i ? 700 : 500,
                      color: slideIndex === i ? 'var(--primary)' : 'var(--gray-500)',
                      background: 'transparent',
                      borderBottom: `2.5px solid ${slideIndex === i ? 'var(--primary)' : 'transparent'}`,
                      transition: 'all 0.25s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Slides container — CSS scroll-snap */}
              <div
                ref={sliderRef}
                style={{
                  display: 'flex',
                  overflowX: 'hidden',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                }}
              >
                {/* ── SLIDE 1: Personal Information ── */}
                <div style={{
                  minWidth: '100%',
                  scrollSnapAlign: 'start',
                  padding: '28px 24px',
                }}>
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        className="form-input"
                        value={user?.email || ''}
                        disabled
                        style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }}
                      />
                      <span className="form-hint">Email cannot be changed</span>
                    </div>

                    <div className="resp-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          className="form-input"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input
                          className="form-input"
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
                          placeholder="10-digit mobile"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {['male', 'female', 'other'].map((g) => (
                          <label key={g} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                            border: `1.5px solid ${form.gender === g ? 'var(--primary)' : 'var(--gray-200)'}`,
                            borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                            background: form.gender === g ? 'var(--primary-50)' : 'white',
                            color: form.gender === g ? 'var(--primary)' : 'var(--gray-600)',
                            textTransform: 'capitalize', transition: 'all 0.2s',
                          }}>
                            <input type="radio" style={{ display: 'none' }} checked={form.gender === g} onChange={() => setForm((p) => ({ ...p, gender: g }))} />
                            {g === 'male' ? <IconBoy size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                              : g === 'female' ? <IconGirl size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                              : <IconChild size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />} {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>

                  {/* Slide dots */}
                  <SliderDots count={2} active={slideIndex} onChange={goToSlide} />
                </div>

                {/* ── SLIDE 2: Change Password ── */}
                <div style={{
                  minWidth: '100%',
                  scrollSnapAlign: 'start',
                  padding: '28px 24px',
                }}>
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Change Your Password</h3>
                    <p style={{ fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.6 }}>
                      Enter your current password and choose a new one. Min 6 characters.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Current Password */}
                    <div className="form-group">
                      <label className="form-label">Current Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type={showPw.current ? 'text' : 'password'}
                          placeholder="Enter current password"
                          value={pwForm.currentPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        />
                        <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                          onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}>
                          {showPw.current ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group">
                      <label className="form-label">
                        New Password
                        <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 400, marginLeft: 6 }}>
                          (8+ chars, upper, lower, number, special)
                        </span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type={showPw.new ? 'text' : 'password'}
                          placeholder="Min 8 characters"
                          value={pwForm.newPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                        />
                        <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                          onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}>
                          {showPw.new ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </button>
                      </div>
                      <PasswordStrength password={pwForm.newPassword} />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type={showPw.confirm ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                          value={pwForm.confirmPassword}
                          onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                          style={{
                            borderColor: pwForm.confirmPassword
                              ? pwForm.confirmPassword === pwForm.newPassword ? '#4ade80' : '#f87171'
                              : undefined,
                          }}
                        />
                        <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                          onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}>
                          {showPw.confirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </button>
                      </div>
                      {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                        <span style={{ fontSize: 12, color: '#f87171', marginTop: 4, display: 'block' }}>Passwords do not match</span>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        className={`btn btn-primary${loading ? ' btn-loading' : ''}`}
                        disabled={loading || !pwForm.newPassword || !pwForm.confirmPassword}
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>

                  {/* Slide dots */}
                  <SliderDots count={2} active={slideIndex} onChange={goToSlide} />
                </div>
              </div>
            </div>
          )}

          {/* ── Addresses Tab ── */}
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
                        <button
                          style={{ fontSize: 12, color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
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
