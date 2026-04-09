import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/product/ProductCard';
import { getMe } from '../../api/auth';
import { useState } from 'react';
import { IconHeart } from '../../components/common/Icons';
import { getProduct } from '../../api/products';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getMe();
        let list = res.data.user?.wishlist || [];
        
        // Ensure sizes and colors are loaded for wishlist products
        if (list.length > 0 && (!list[0].sizes || !list[0].colors)) {
           list = await Promise.all(list.map(async p => {
               try { return (await getProduct(p._id)).data.product; } catch { return p; }
           }));
        }

        setProducts(list);
      } catch {}
      finally { setLoading(false); }
    };
    fetchWishlist();
  }, [wishlist]);

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>My Wishlist <IconHeart size={20} color="var(--secondary)" style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
        {products.length > 0 && (
          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>{products.length} item{products.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ borderRadius: 8, overflow: 'hidden' }}>
              <div className="skeleton" style={{ paddingBottom: '125%' }} />
              <div style={{ padding: 12 }}>
                <div className="skeleton" style={{ height: 10, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 13, width: '90%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '50vh' }}>
          <div className="empty-state-icon"><IconHeart size={48} color="var(--gray-300)" /></div>
          <div className="empty-state-title">Your Wishlist is Empty</div>
          <div className="empty-state-text">Save your favorite items here! Tap the heart icon on products to add them to your wishlist.</div>
          <Link to="/" className="btn btn-primary mt-4">Explore Collection →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {products.map((product) => (
            <ProductCard key={typeof product === 'string' ? product : product._id} product={typeof product === 'string' ? { _id: product } : product} isWishlist={true} />
          ))}
        </div>
      )}
    </div>
  );
}
