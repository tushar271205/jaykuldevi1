import { useState, useEffect, useRef } from 'react';
import { getProducts, createProduct, updateProduct, setDiscount, deleteProduct } from '../../api/products';
import toast from 'react-hot-toast';
import { IconSparkles, IconStar, IconDollar, IconSearch } from '../../components/common/Icons';
import Pagination from '../../components/common/Pagination';

const CATEGORIES = ['boys', 'girls', 'unisex'];
const SUBCATEGORIES = ['t-shirts', 'shirts', 'dresses', 'frocks', 'pants', 'jeans', 'shorts', 'kurtas', 'sets', 'jackets', 'winterwear', 'nightwear', 'swimwear', 'ethnic', 'accessories'];
const BLANK_PRODUCT = { name: '', category: 'boys', subCategory: 't-shirts', description: '', brand: 'Jay Kuldevi', price: '', material: '', washCare: '', isFeatured: false, isTopPick: false, isBudgetBuy: false };
const BLANK_DISCOUNT = { active: true, type: 'percent', percent: '', flatAmount: '', validUntil: '' };

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? { ...product, sizes: product.sizes || [], colors: product.colors || [], tags: product.tags || [] } : { ...BLANK_PRODUCT, sizes: [], colors: [], tags: [] });
  const [images, setImages] = useState([]); // Raw File objects (new)
  const [previews, setPreviews] = useState(
    product?.images?.map(img => ({ ...img, isExisting: true })) || []
  );
  const [imageColorMappings, setImageColorMappings] = useState(
    product?.images?.map(img => img.color || '') || []
  );
  const [loading, setLoading] = useState(false);
  const [sizeInput, setSizeInput] = useState({ size: '', stock: 10 });
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleImages = (e) => {
    const newFiles = Array.from(e.target.files);
    // Track which preview index corresponds to which file index
    const filesOffset = images.length;

    setImages(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f, i) => ({
      url: URL.createObjectURL(f),
      isNew: true,
      fileIdx: filesOffset + i
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
    setImageColorMappings(prev => [...prev, ...new Array(newFiles.length).fill('')]);

    // Reset file input so same file can be chosen again if removed
    e.target.value = '';
  };

  const removeImage = (index) => {
    const previewToRemove = previews[index];

    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageColorMappings(prev => prev.filter((_, i) => i !== index));

    // If it was a new file, we don't strictly *need* to remove it from the 'images' array 
    // if we handle the indices correctly during submit, 
    // but for correctness let's filter the 'images' array too.
    if (previewToRemove.isNew) {
      // We'll filter the images during submit based on which previews are still present
    }
  };

  const handleImageColorChange = (index, color) => {
    const updated = [...imageColorMappings];
    updated[index] = color;
    setImageColorMappings(updated);
  };

  const addSize = () => {
    if (!sizeInput.size) return;
    setForm((p) => ({ ...p, sizes: [...p.sizes.filter((s) => s.size !== sizeInput.size), { size: sizeInput.size, stock: Number(sizeInput.stock) }] }));
    setSizeInput({ size: '', stock: 10 });
  };

  const removeSize = (size) => setForm((p) => ({ ...p, sizes: p.sizes.filter((s) => s.size !== size) }));
  const addColor = () => { if (!colorInput) return; setForm((p) => ({ ...p, colors: [...p.colors.filter((c) => c !== colorInput), colorInput] })); setColorInput(''); };
  const removeColor = (c) => setForm((p) => ({ ...p, colors: p.colors.filter((x) => x !== c) }));
  const addTag = () => { if (!tagInput) return; setForm((p) => ({ ...p, tags: [...p.tags.filter((t) => t !== tagInput.trim()), tagInput.trim()] })); setTagInput(''); };
  const removeTag = (t) => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (['sizes', 'colors', 'tags', 'ageGroup'].includes(k)) {
          formData.append(k, JSON.stringify(v));
        } else if (['discount', 'reviews', '_id', 'createdAt', 'updatedAt', '__v', 'images'].includes(k)) {
          return;
        } else if (typeof v === 'boolean') {
          formData.append(k, v);
        } else if (v !== '' && v !== null && v !== undefined && typeof v !== 'object') {
          formData.append(k, v);
        }
      });

      const finalImageColors = [];
      const existingImages = [];

      previews.forEach((p, i) => {
        if (p.isExisting) {
          existingImages.push({ url: p.url, color: imageColorMappings[i] });
        } else {
          // It's a new file
          formData.append('images', images[p.fileIdx]);
          finalImageColors.push(imageColorMappings[i]);
        }
      });

      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('imageColors', JSON.stringify(finalImageColors));

      if (product?._id) await updateProduct(product._id, formData);
      else await createProduct(formData);

      toast.success(`Product ${product ? 'updated' : 'created'}!`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <form id="product-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Beige Palm Print Oversized T-Shirt" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sub Category *</label>
                <select className="form-select" value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)}>
                  {SUBCATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input className="form-input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="499" required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Material</label>
                <input className="form-input" value={form.material || ''} onChange={(e) => set('material', e.target.value)} placeholder="100% Cotton" />
              </div>
              <div className="form-group">
                <label className="form-label">Wash Care</label>
                <input className="form-input" value={form.washCare || ''} onChange={(e) => set('washCare', e.target.value)} placeholder="Machine wash cold" />
              </div>
            </div>

            <div className="form-group" style={{ background: 'var(--gray-50)', padding: 16, borderRadius: 12, border: '1px dashed var(--gray-200)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 12, fontWeight: 700 }}>
                PRODUCT IMAGES
              </label>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                {previews.map((src, i) => {
                  const url = typeof src === 'string' ? src : src.url;
                  return (
                    <div key={i} style={{ width: 110, position: 'relative', background: 'white', padding: 6, borderRadius: 10, border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: -10, right: -10, background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                      >
                        ✕
                      </button>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--gray-200)', marginBottom: 8 }}>
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <select
                        className="form-select"
                        style={{ fontSize: 11, padding: '4px 8px', height: 32, borderRadius: 6, width: '100%' }}
                        value={imageColorMappings[i] || ''}
                        onChange={(e) => handleImageColorChange(i, e.target.value)}
                      >
                        <option value="">No Color</option>
                        {form.colors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  );
                })}

                {/* Add New Button Card */}
                <label style={{
                  width: 110, height: 138,
                  border: '2px dashed var(--gray-300)',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'all 0.2s',
                  gap: 8,
                  color: 'var(--gray-400)'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-300)'; e.currentTarget.style.color = 'var(--gray-400)'; }}
                >
                  <span style={{ fontSize: 24, fontWeight: 300 }}>+</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>Add Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ fontSize: 11, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconSparkles size={14} color="var(--primary)" />
                Tip: You can add images one by one and assign a specific color to each.
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>Sizes & Stock</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="form-input" placeholder="Size (e.g. 8Y)" value={sizeInput.size} onChange={(e) => setSizeInput((p) => ({ ...p, size: e.target.value }))} style={{ flex: 2 }} />
                <input className="form-input" type="number" placeholder="Stock" value={sizeInput.stock} onChange={(e) => setSizeInput((p) => ({ ...p, stock: e.target.value }))} style={{ flex: 1 }} />
                <button type="button" className="btn btn-outline btn-sm" onClick={addSize}>Add</button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {form.sizes.map((s) => (
                  <span key={s.size} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--primary-50)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {s.size} ({s.stock}) <span onClick={() => removeSize(s.size)} style={{ cursor: 'pointer', marginLeft: 2 }}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>Colors</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="form-input" placeholder="e.g. Beige" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())} />
                <button type="button" className="btn btn-outline btn-sm" onClick={addColor}>Add</button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {form.colors.map((c) => (
                  <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                    {c} <span onClick={() => removeColor(c)} style={{ cursor: 'pointer' }}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>Tags</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="form-input" placeholder="e.g. summer, casual" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>Add</button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {form.tags.map((t) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                    {t} <span onClick={() => removeTag(t)} style={{ cursor: 'pointer' }}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['isFeatured', <><IconSparkles size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Featured</>], ['isTopPick', <><IconStar size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Top Pick</>], ['isBudgetBuy', <><IconDollar size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Budget Buy</>]].map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={form[k] || false} onChange={(e) => set(k, e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button form="product-form" type="submit" className={`btn btn-primary${loading ? ' btn-loading' : ''}`} disabled={loading}>
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscountModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product.discount?.active ? { ...product.discount, validUntil: product.discount.validUntil ? product.discount.validUntil.split('T')[0] : '' } : BLANK_DISCOUNT);
  const [loading, setLoading] = useState(false);

  const previewPrice = () => {
    if (form.type === 'percent' && form.percent) return Math.round(product.price * (1 - form.percent / 100));
    if (form.type === 'flat' && form.flatAmount) return Math.max(0, product.price - form.flatAmount);
    return product.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDiscount(product._id, form);
      toast.success('Discount updated!');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set discount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Set Discount — {product.name}</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form id="discount-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} />
              Enable Discount
            </label>

            {form.active && (
              <>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[['percent', '% Percent'], ['flat', '₹ Flat Amount']].map(([v, l]) => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1.5px solid ${form.type === v ? 'var(--primary)' : 'var(--gray-200)'}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, background: form.type === v ? 'var(--primary-50)' : 'white', color: form.type === v ? 'var(--primary)' : 'var(--gray-700)' }}>
                        <input type="radio" style={{ display: 'none' }} checked={form.type === v} onChange={() => setForm((p) => ({ ...p, type: v }))} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                {form.type === 'percent' ? (
                  <div className="form-group">
                    <label className="form-label">Discount % (0–100)</label>
                    <input className="form-input" type="number" min="0" max="100" value={form.percent} onChange={(e) => setForm((p) => ({ ...p, percent: e.target.value }))} placeholder="e.g. 20 (for 20%)" />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Flat Discount Amount (₹)</label>
                    <input className="form-input" type="number" min="0" value={form.flatAmount} onChange={(e) => setForm((p) => ({ ...p, flatAmount: e.target.value }))} placeholder="e.g. 100" />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Valid Until (optional)</label>
                  <input className="form-input" type="date" value={form.validUntil} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
                </div>

                {/* Price Preview */}
                <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-light)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6 }}>PRICE PREVIEW</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>₹{previewPrice().toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 14, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                    {previewPrice() < product.price && (
                      <span style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 700 }}>
                        ({Math.round(((product.price - previewPrice()) / product.price) * 100)}% OFF)
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button form="discount-form" type="submit" className={`btn btn-primary${loading ? ' btn-loading' : ''}`} disabled={loading}>
            {loading ? 'Saving...' : 'Apply Discount'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [discountProduct, setDiscountProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      // Admin needs all including inactive - for now just get all active
      const res = await getProducts(params);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, categoryFilter]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product removed');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const onSaved = () => {
    setShowProductModal(false);
    setEditProduct(null);
    setDiscountProduct(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="admin-header-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>+ Add Product</button>
      </div>

      {/* Filters */}
      <div className="admin-header-flex" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form className="search-form" style={{ backgroundColor: 'white', height: 40, flex: 1, minWidth: '100%', maxWidth: 'none' }} onSubmit={(e) => { e.preventDefault(); setPage(1); fetchProducts(); }}>
          <IconSearch size={18} color="var(--gray-400)" />
          <input className="search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button type="button" className="search-clear" onClick={() => { setSearch(''); }}>✕</button>}
        </form>
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <select className="form-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} style={{ flex: 1, height: 40 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" style={{ height: 40, flexShrink: 0 }} onClick={() => { setPage(1); fetchProducts(); }}>Search</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Sizes</th>
                <th>Rating</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="skeleton" style={{ width: 44, height: 54, borderRadius: 6, flexShrink: 0 }} />
                        <div>
                          <div className="skeleton" style={{ height: 13, width: 140, borderRadius: 6, marginBottom: 6 }} />
                          <div className="skeleton" style={{ height: 10, width: 80, borderRadius: 6 }} />
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton" style={{ height: 20, width: 55, borderRadius: 12 }} /></td>
                    <td><div className="skeleton" style={{ height: 14, width: 50, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 20, width: 70, borderRadius: 12 }} /></td>
                    <td><div className="skeleton" style={{ height: 12, width: 90, borderRadius: 6 }} /></td>
                    <td><div className="skeleton" style={{ height: 20, width: 50, borderRadius: 4 }} /></td>
                    <td><div className="skeleton" style={{ height: 20, width: 60, borderRadius: 12 }} /></td>
                    <td><div style={{ display: 'flex', gap: 6 }}><div className="skeleton" style={{ height: 28, width: 36, borderRadius: 6 }} /><div className="skeleton" style={{ height: 28, width: 60, borderRadius: 6 }} /><div className="skeleton" style={{ height: 28, width: 48, borderRadius: 6 }} /></div></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No products found. Add your first product!</td></tr>
              ) : products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 44, height: 54, borderRadius: 6, overflow: 'hidden', background: 'var(--gray-100)', flexShrink: 0 }}>
                        <img src={p.images?.[0]?.url || p.images?.[0] || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ maxWidth: 180 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }} className="line-clamp-2">{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}><span className="badge badge-primary">{p.category}</span></div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2, textTransform: 'capitalize' }}>{p.subCategory}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{p.discountedPrice?.toLocaleString('en-IN')}</div>
                    {p.price !== p.discountedPrice && (
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td>
                    {p.discount?.active ? (
                      <div>
                        <span className="badge badge-secondary">
                          {p.discount.type === 'percent' ? `${p.discount.percent}% OFF` : `₹${p.discount.flatAmount} OFF`}
                        </span>
                        {p.discount.validUntil && (
                          <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 2 }}>
                            Until {new Date(p.discount.validUntil).toLocaleDateString('en-IN')}
                          </div>
                        )}
                      </div>
                    ) : <span style={{ fontSize: 12, color: 'var(--gray-300)' }}>No discount</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>{p.sizes?.map((s) => `${s.size}(${s.stock})`).join(', ') || '—'}</td>
                  <td>
                    {p.numReviews > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ background: 'var(--success)', color: 'white', padding: '1px 5px', borderRadius: 3, fontSize: 11, fontWeight: 700 }}>
                          {p.ratings?.toFixed(1)} <IconStar size={10} color="white" style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({p.numReviews})</span>
                      </div>
                    ) : <span style={{ fontSize: 11, color: 'var(--gray-300)' }}>No ratings</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.isFeatured && <span className="badge badge-primary" style={{ fontSize: 10 }}>Featured</span>}
                      {p.isTopPick && <span className="badge badge-success" style={{ fontSize: 10 }}>Top Pick</span>}
                      {p.isBudgetBuy && <span className="badge badge-warning" style={{ fontSize: 10 }}>Budget</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--primary)' }} onClick={() => setEditProduct(p)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--warning)' }} onClick={() => setDiscountProduct(p)}>Discount</button>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--error)' }} onClick={() => handleDelete(p._id, p.name)}>Delete</button>
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
          style={{ padding: '16px' }}
        />
      </div>

      {/* Modals */}
      {(showProductModal || editProduct) && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowProductModal(false); setEditProduct(null); }}
          onSaved={onSaved}
        />
      )}
      {discountProduct && (
        <DiscountModal
          product={discountProduct}
          onClose={() => setDiscountProduct(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
