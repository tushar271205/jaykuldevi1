import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getSearchSuggestions } from '../../api/products';
import { IconPackage, IconEdit, IconHeart, IconSettings, IconLogOut, IconShirt } from './Icons';
import './Navbar.css';

const BOYS_SUBMENU = [
  { label: 'T-Shirts & Shirts', sub: 't-shirts' },
  { label: 'Pants & Jeans', sub: 'pants' },
  { label: 'Shorts', sub: 'shorts' },
  { label: 'Kurtas & Ethnic', sub: 'ethnic' },
  { label: 'Sets & Combos', sub: 'sets' },
  { label: 'Jackets', sub: 'jackets' },
  { label: 'Winter Wear', sub: 'winterwear' },
  { label: 'Night Wear', sub: 'nightwear' },
];

const GIRLS_SUBMENU = [
  { label: 'Dresses & Frocks', sub: 'dresses' },
  { label: 'Tops', sub: 't-shirts' },
  { label: 'Pants & Jeans', sub: 'pants' },
  { label: 'Skirts', sub: 'shorts' },
  { label: 'Ethnic & Festive', sub: 'ethnic' },
  { label: 'Sets & Combos', sub: 'sets' },
  { label: 'Winter Wear', sub: 'winterwear' },
  { label: 'Night Wear', sub: 'nightwear' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getSearchSuggestions(q);
        setSuggestions(res.data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (s) => {
    navigate(`/product/${s._id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <>


      {/* Main Navbar */}
      <header className={`navbar${isScrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner container">
          {/* Logo */}
          <Link to="/" className="brand">
            <span className="brand-logo2"><img src="/FullLogo.jpg" /></span>
            <span className="brand-name">Jay Kuldevi</span>

          </Link>

          {/* Nav Links */}
          <nav className="nav-links hide-mobile">
            <div
              className="nav-item has-dropdown"
              onMouseEnter={() => setActiveDropdown('boys')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link to="/boys" className={`nav-link${location.pathname === '/boys' ? ' active' : ''}`}>
                BOYS
              </Link>
              {activeDropdown === 'boys' && (
                <div className="nav-dropdown">
                  <div className="dropdown-title">Boys Collection</div>
                  {BOYS_SUBMENU.map((item) => (
                    <Link
                      key={item.sub}
                      to={`/boys?subCategory=${item.sub}`}
                      className="dropdown-item"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="nav-item has-dropdown"
              onMouseEnter={() => setActiveDropdown('girls')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link to="/girls" className={`nav-link${location.pathname === '/girls' ? ' active' : ''}`}>
                GIRLS
              </Link>
              {activeDropdown === 'girls' && (
                <div className="nav-dropdown">
                  <div className="dropdown-title">Girls Collection</div>
                  {GIRLS_SUBMENU.map((item) => (
                    <Link
                      key={item.sub}
                      to={`/girls?subCategory=${item.sub}`}
                      className="dropdown-item"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <Link to="/admin/dashboard" className="nav-link admin-link">
                ADMIN
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="search-wrap" ref={searchRef}>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                placeholder="Search in Kids store"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                >
                  ✕
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {searchLoading ? (
                  <div className="suggestion-loading">Searching...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((s) => (
                    <div
                      key={s._id}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      <div className="suggestion-img">
                        {s.image ? (
                          <img src={s.image} alt={s.name} />
                        ) : (
                          <div className="suggestion-img-placeholder"><IconShirt size={16} /></div>
                        )}
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{s.name}</div>
                        <div className="suggestion-cat">{s.category} › {s.subCategory}</div>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-empty">No results for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="nav-actions">
            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
              <span className="nav-icon-label hide-mobile">Wishlist</span>
            </Link>

            {/* Profile */}
            <div className="nav-profile" ref={profileRef}>
              <button
                className="nav-icon-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                id="profile-btn"
              >
                {user?.avatar ? (
                  <img src={user.avatar} className="nav-avatar" alt="Profile" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
                <span className="nav-icon-label hide-mobile">
                  {isAuthenticated ? (user.name?.split(' ')[0] || 'Profile') : 'Login'}
                </span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="profile-header">
                        <div className="profile-avatar-lg">{user.name?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <div className="profile-name">{user.name}</div>
                          <div className="profile-email">{user.email}</div>
                        </div>
                      </div>
                      <div className="profile-menu">
                        <Link to="/account/orders" className="profile-menu-item">
                          <span><IconPackage size={15} /></span> My Orders
                        </Link>
                        <Link to="/account/profile" className="profile-menu-item">
                          <span><IconEdit size={15} /></span> Edit Profile
                        </Link>
                        <Link to="/wishlist" className="profile-menu-item">
                          <span><IconHeart size={15} /></span> Wishlist
                        </Link>
                        {isAdmin && (
                          <Link to="/admin/dashboard" className="profile-menu-item admin">
                            <span><IconSettings size={15} /></span> Admin Panel
                          </Link>
                        )}
                        <button className="profile-menu-item logout" onClick={logout}>
                          <span><IconLogOut size={15} /></span> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="profile-guest">
                      <p>Hello, Login for best experience</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to="/login" className="btn btn-primary btn-sm btn-full">Login</Link>
                        <Link to="/register" className="btn btn-outline btn-sm btn-full">Register</Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart / Bag */}
            <button className="nav-icon-btn" onClick={() => setIsCartOpen(true)} id="bag-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="nav-badge cart-badge">{cartCount}</span>}
              <span className="nav-icon-label hide-mobile">Bag</span>
            </button>

            {/* Mobile Menu */}
            <button
              className="nav-icon-btn show-mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                {mobileMenuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              <Link to="/boys" className="mobile-nav-link">Boys Collection</Link>
              <Link to="/girls" className="mobile-nav-link">Girls Collection</Link>
              <Link to="/products" className="mobile-nav-link">All Products</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/account/orders" className="mobile-nav-link">My Orders</Link>
                  <Link to="/account/profile" className="mobile-nav-link">Profile</Link>
                  {isAdmin && <Link to="/admin/dashboard" className="mobile-nav-link">Admin</Link>}
                  <button className="mobile-nav-link logout-mobile" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link">Login</Link>
                  <Link to="/register" className="mobile-nav-link">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
