import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toggleWishlist as apiToggle } from '../api/users';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist.map((p) => (typeof p === 'string' ? p : p._id)));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = useCallback(async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    const productId = typeof product === 'string' ? product : product._id;
    const isIn = wishlist.includes(productId);

    // Optimistic update
    setWishlist((prev) =>
      isIn ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    toast.success(isIn ? 'Removed from wishlist' : 'Added to wishlist ❤️');

    try {
      await apiToggle(productId);
    } catch {
      // Rollback
      setWishlist((prev) =>
        isIn ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      toast.error('Something went wrong');
    }
  }, [isAuthenticated, wishlist]);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(typeof productId === 'string' ? productId : productId?._id),
    [wishlist]
  );

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
