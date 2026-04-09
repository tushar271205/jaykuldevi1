import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CART_KEY = 'jaykuldevi_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => { saveCart(cartItems); }, [cartItems]);

  const addToCart = useCallback((product, size, color, quantity = 1) => {
    if (!size) { toast.error('Please select a size'); return; }

    const sizeObj = product.sizes?.find((s) => s.size === size);
    if (!sizeObj || sizeObj.stock < 1) { toast.error('Out of stock'); return; }

    const existIdx = cartItems.findIndex(
      (item) => item.productId === product._id && item.size === size && item.color === color
    );

    if (existIdx !== -1) {
      toast.success('Updated cart!');
    } else {
      toast.success('Added to bag! 🛍️');
    }

    setCartItems((prev) => {
      const currentIdx = prev.findIndex(
        (item) => item.productId === product._id && item.size === size && item.color === color
      );
      if (currentIdx !== -1) {
        const maxStock = sizeObj.stock;
        const newQty = Math.min(prev[currentIdx].quantity + quantity, maxStock);
        const updated = [...prev];
        updated[currentIdx] = { ...updated[currentIdx], quantity: newQty };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId: `${product._id}_${size}_${color || 'default'}_${Date.now()}`,
          productId: product._id,
          name: product.name,
          brand: product.brand || 'Jay Kuldevi',
          image: product.images?.[0]?.url || product.images?.[0] || '',
          price: product.price,
          discountedPrice: product.discountedPrice || product.price,
          size,
          color: color || '',
          quantity,
          maxStock: sizeObj.stock,
          slug: product.slug,
        },
      ];
    });
    setIsCartOpen(true);
  }, [cartItems]);

  const removeFromCart = useCallback((cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    toast.success('Removed from bag');
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.min(quantity, item.maxStock || 10) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const moveToWishlist = useCallback((cartItemId) => {
    // Just remove from cart (wishlist toggle is handled by WishlistContext)
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
  const cartMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = cartMRP - cartSubtotal;
  const shippingCharge = cartSubtotal >= 499 ? 0 : 49;
  const cartTotal = cartSubtotal + shippingCharge;

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      cartMRP,
      cartDiscount,
      shippingCharge,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      moveToWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
