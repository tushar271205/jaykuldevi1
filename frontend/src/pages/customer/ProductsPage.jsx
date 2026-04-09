import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/product/ProductCard';
import { IconBoy, IconGirl, IconShoppingBag, IconSearch } from '../../components/common/Icons';

const SUBCATEGORIES = {
  boys: ['t-shirts', 'shirts', 'pants', 'jeans', 'shorts', 'kurtas', 'sets', 'jackets', 'winterwear', 'nightwear', 'ethnic', 'accessories'],
  girls: ['dresses', 'frocks', 't-shirts', 'pants', 'jeans', 'shorts', 'kurtas', 'sets', 'jackets', 'winterwear', 'nightwear', 'ethnic', 'accessories'],
  all: ['t-shirts', 'shirts', 'dresses', 'frocks', 'pants', 'jeans', 'shorts', 'kurtas', 'sets', 'jackets', 'winterwear', 'nightwear', 'ethnic', 'accessories'],
};

const SIZES = ['0-3M', '3-6M', '6-12M', '1Y', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y', '11Y', '12Y', '13Y', '14Y', 'XS', 'S', 'M', 'L', 'XL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const SkeletonCard = () => (
  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--gray-100)' }}>
    <div className="skeleton" style={{ paddingBottom: '125%' }} />
    <div style={{ padding: 12 }}>
      <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 13, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '40%' }} />
    </div>
  </div>
);

export default function ProductsPage({ category: propCategory }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = propCategory || searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [selectedSubCat, setSelectedSubCat] = useState(searchParams.get('subCategory') || '');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const subCatList = SUBCATEGORIES[category] || SUBCATEGORIES.all;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort };
      if (category) params.category = category;
      if (selectedSubCat) params.subCategory = selectedSubCat;
      if (selectedSizes.length > 0) params.size = selectedSizes;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (search) params.search = search;
      if (searchParams.get('isTopPick') === 'true') params.isTopPick = true;
      if (searchParams.get('isBudgetBuy') === 'true') params.isBudgetBuy = true;

      const res = await getProducts(params);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, selectedSubCat, selectedSizes, minPrice, maxPrice, sort, page, search, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedSubCat('');
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const pageTitle = category === 'boys' ? <><IconBoy size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Boys Collection</> : category === 'girls' ? <><IconGirl size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Girls Collection</> : search ? `Search: "${search}"` : <><IconShoppingBag size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> All Products</>;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        {category && <><Link to="/products">Kids</Link><span className="breadcrumb-sep">›</span></>}
        <span style={{ textTransform: 'capitalize' }}>{category || 'All Products'}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{pageTitle}</h1>
          {!loading && <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{pagination.total} products found</p>}
        </div>
        <button
          className="btn btn-outline-dark btn-sm show-mobile"
          onClick={() => setFiltersOpen(true)}
          style={{ display: 'none' }}
        >
          Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* FILTERS SIDEBAR */}
        <aside className="hide-mobile" style={{ flexShrink: 0 }}>
          <div className="card sticky-top" style={{ overflow: 'visible' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>FILTERS</span>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: 11, color: 'var(--primary)' }}>
                CLEAR ALL
              </button>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Subcategory */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Category
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" checked={!selectedSubCat} onChange={() => { setSelectedSubCat(''); setPage(1); }} />
                    <span>All</span>
                  </label>
                  {subCatList.map((sub) => (
                    <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                      <input
                        type="radio"
                        checked={selectedSubCat === sub}
                        onChange={() => { setSelectedSubCat(sub); setPage(1); }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{sub.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Price Range
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    style={{ fontSize: 13 }}
                  />
                  <span style={{ color: 'var(--gray-400)', flexShrink: 0 }}>—</span>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {[299, 499, 699, 999].map((p) => (
                    <button
                      key={p}
                      className={`chip${maxPrice == p ? ' active' : ''}`}
                      style={{ fontSize: 11, padding: '3px 8px' }}
                      onClick={() => { setMaxPrice(p == maxPrice ? '' : p); setPage(1); }}
                    >
                      Under ₹{p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Size
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      className={`chip${selectedSizes.includes(size) ? ' active' : ''}`}
                      style={{ fontSize: 11, padding: '3px 8px' }}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Advanced Search */}
          <form className="search-form" style={{ backgroundColor: 'white', marginBottom: 16, height: 44 }} onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput);
            setPage(1);
          }}>
            <IconSearch size={18} color="var(--gray-400)" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by brand, tags, description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="search-clear" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>✕</button>
            )}
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 16px', borderRadius: 20 }}>Search</button>
          </form>

          {/* Sort Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', background: 'white', borderRadius: 8,
            border: '1px solid var(--gray-200)', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', gap: 8, overflow: 'auto' }}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`chip${sort === opt.value ? ' active' : ''}`}
                  style={{ fontSize: 11, whiteSpace: 'nowrap' }}
                  onClick={() => { setSort(opt.value); setPage(1); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedSubCat || selectedSizes.length > 0 || minPrice || maxPrice) && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {search && (
                <div className="chip active" style={{ fontSize: 11 }}>
                  Search: "{search}" <span onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} style={{ marginLeft: 4, cursor: 'pointer' }}>✕</span>
                </div>
              )}
              {selectedSubCat && (
                <div className="chip active" style={{ fontSize: 11 }}>
                  {selectedSubCat} <span onClick={() => setSelectedSubCat('')} style={{ marginLeft: 4, cursor: 'pointer' }}>✕</span>
                </div>
              )}
              {(minPrice || maxPrice) && (
                <div className="chip active" style={{ fontSize: 11 }}>
                  ₹{minPrice || '0'}–₹{maxPrice || '∞'}
                  <span onClick={() => { setMinPrice(''); setMaxPrice(''); }} style={{ marginLeft: 4, cursor: 'pointer' }}>✕</span>
                </div>
              )}
              {selectedSizes.map((s) => (
                <div key={s} className="chip active" style={{ fontSize: 11 }}>
                  {s} <span onClick={() => toggleSize(s)} style={{ marginLeft: 4, cursor: 'pointer' }}>✕</span>
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><IconSearch size={48} color="var(--gray-300)" /></div>
              <div className="empty-state-title">No products found</div>
              <div className="empty-state-text">Try changing filters or search for something else</div>
              <button className="btn btn-outline mt-4" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ←
                  </button>
                  {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                    let p = i + 1;
                    if (pagination.pages > 7) {
                      if (pagination.page <= 4) p = i + 1;
                      else if (pagination.page >= pagination.pages - 3) p = pagination.pages - 6 + i;
                      else p = pagination.page - 3 + i;
                    }
                    return (
                      <button key={p} className={`page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
