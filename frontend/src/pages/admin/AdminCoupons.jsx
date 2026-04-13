import { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../api/coupons';
import toast from 'react-hot-toast';
import { IconTicket, IconClock } from '../../components/common/Icons';
import Pagination from '../../components/common/Pagination';

const BLANK_COUPON = { code: '', type: 'percent', percent: '', flatAmount: '', minOrderAmount: '', maxDiscount: '', maxUses: '', expiryDate: '', active: true };

function CouponModal({ coupon, onClose, onSaved }) {
  const [form, setForm] = useState(coupon ? { 
    code: coupon.code,
    type: coupon.discountType,
    percent: coupon.discountType === 'percent' ? coupon.discountValue : '',
    flatAmount: coupon.discountType === 'flat' ? coupon.discountValue : '',
    minOrderAmount: coupon.minOrderValue || '',
    maxDiscount: coupon.maxDiscountAmount || '',
    maxUses: coupon.maxUses || '',
    expiryDate: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
    active: coupon.isActive
  } : BLANK_COUPON);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code) { toast.error('Coupon code is required'); return; }
    
    // Convert to Mongoose schema shape
    const value = form.type === 'percent' ? Number(form.percent) : Number(form.flatAmount);
    if (!value) { toast.error('Please specify a discount amount'); return; }
    if (!form.expiryDate) { toast.error('Please specify an expiry date'); return; }

    const payload = {
        code: form.code,
        discountType: form.type,
        discountValue: value,
        maxDiscountAmount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        minOrderValue: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        validUntil: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        isActive: form.active,
    };

    setLoading(true);
    try {
      if (coupon?._id) await updateCoupon(coupon._id, payload);
      else await createCoupon(payload);
      toast.success(`Coupon ${coupon ? 'updated' : 'created'}!`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form id="coupon-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <input className="form-input" value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="e.g. KIDDO10" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }} required />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['percent', '% Percent Off'], ['flat', '₹ Flat Off']].map(([v, l]) => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1.5px solid ${form.type === v ? 'var(--primary)' : 'var(--gray-200)'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, background: form.type === v ? 'var(--primary-50)' : 'white', color: form.type === v ? 'var(--primary)' : 'var(--gray-700)' }}>
                    <input type="radio" style={{ display: 'none' }} checked={form.type === v} onChange={() => set('type', v)} />
                    {l}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {form.type === 'percent' ? (
                <div className="form-group">
                  <label className="form-label">Percent Off (%)</label>
                  <input className="form-input" type="number" min="0" max="100" value={form.percent} onChange={(e) => set('percent', e.target.value)} placeholder="e.g. 10" />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Flat Discount (₹)</label>
                  <input className="form-input" type="number" value={form.flatAmount} onChange={(e) => set('flatAmount', e.target.value)} placeholder="e.g. 300" />
                </div>
              )}
              {form.type === 'percent' && (
                <div className="form-group">
                  <label className="form-label">Max Discount (₹)</label>
                  <input className="form-input" type="number" value={form.maxDiscount} onChange={(e) => set('maxDiscount', e.target.value)} placeholder="e.g. 500" />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Min Order Amount (₹)</label>
                <input className="form-input" type="number" value={form.minOrderAmount} onChange={(e) => set('minOrderAmount', e.target.value)} placeholder="e.g. 1000" />
              </div>
              <div className="form-group">
                <label className="form-label">Max Total Uses</label>
                <input className="form-input" type="number" value={form.maxUses} onChange={(e) => set('maxUses', e.target.value)} placeholder="Leave empty for unlimited" />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              Active (visible to customers)
            </label>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button form="coupon-form" type="submit" className={`btn btn-primary${loading ? ' btn-loading' : ''}`} disabled={loading}>
            {loading ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getCoupons({ page, limit: 10 });
      setCoupons(res.data.coupons || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, [page]);

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCoupon(id);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch { toast.error('Failed to delete coupon'); }
  };

  const onSaved = () => { setShowModal(false); setEditCoupon(null); fetchCoupons(); };

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Coupons & Offers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Coupon</button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="empty-state">
          <div style={{ display: 'flex', justifyContent: 'center' }}><IconTicket size={48} color="var(--gray-300)" /></div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No Coupons Yet</div>
          <div style={{ color: 'var(--gray-400)', fontSize: 14 }}>Create your first coupon to offer discounts to customers</div>
          <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>Create First Coupon</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {coupons.map((coupon) => {
            const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
            return (
              <div key={coupon._id} style={{
                background: 'white', borderRadius: 16,
                border: `1.5px dashed ${coupon.isActive && !isExpired ? 'var(--primary)' : 'var(--gray-200)'}`,
                overflow: 'hidden',
                boxShadow: coupon.isActive && !isExpired ? '0 4px 16px rgba(0,188,212,0.1)' : 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Coupon Header */}
                <div style={{
                  background: coupon.isActive && !isExpired ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--gray-100)',
                  padding: '20px 20px 16px',
                  position: 'relative',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '0.08em', fontFamily: 'monospace', marginBottom: 4 }}>
                    {coupon.code}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>
                    {coupon.discountType === 'percent' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </div>
                  {!coupon.isActive && <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.3)', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>INACTIVE</div>}
                  {isExpired && <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>EXPIRED</div>}
                </div>

                {/* Coupon Details */}
                <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    {coupon.minOrderValue > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        Min order: <strong>₹{coupon.minOrderValue.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    {coupon.maxDiscountAmount > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        Max discount: <strong>₹{coupon.maxDiscountAmount.toLocaleString('en-IN')}</strong>
                      </div>
                    )}
                    {coupon.validUntil && (
                      <div style={{ fontSize: 12, color: isExpired ? 'var(--error)' : 'var(--gray-500)' }}>
                        {isExpired ? <><IconClock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Expired: </> : 'Valid till: '}<strong>{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</strong>
                      </div>
                    )}
                    {coupon.maxUses > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        Uses: <strong>{coupon.usedCount || 0}/{coupon.maxUses}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <button className="btn btn-outline btn-sm" style={{ flex: 1, color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={() => setEditCoupon(coupon)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(coupon._id, coupon.code)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination 
        page={page} 
        pages={pagination.pages} 
        onPageChange={setPage} 
        style={{ padding: '24px 0', justifyContent: 'center' }}
      />

      {(showModal || editCoupon) && (
        <CouponModal
          coupon={editCoupon}
          onClose={() => { setShowModal(false); setEditCoupon(null); }}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
