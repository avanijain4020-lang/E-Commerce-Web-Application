import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';
import { api } from '../utils/api.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  // Load cart based on login status
  const loadCart = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const data = await api.cart.get();
        setCart(data || { products: [] });
      } catch (err) {
        console.error('Failed to load cart from database:', err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local storage mode
      const localCart = localStorage.getItem('guest_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart({ products: [] });
        }
      } else {
        setCart({ products: [] });
      }
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Save guest cart helper
  const saveGuestCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('guest_cart', JSON.stringify(newCart));
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    if (user) {
      try {
        const data = await api.cart.add(product._id, qty);
        setCart(data);
      } catch (err) {
        console.error('Add to cart failed:', err.message);
        throw err;
      }
    } else {
      // Guest cart modification
      const items = [...cart.products];
      const idx = items.findIndex(item => item.productId._id === product._id);
      if (idx > -1) {
        items[idx].quantity += qty;
      } else {
        items.push({ productId: product, quantity: qty });
      }
      saveGuestCart({ products: items });
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) return;
    
    if (user) {
      try {
        const data = await api.cart.update(productId, qty);
        setCart(data);
      } catch (err) {
        console.error('Update cart failed:', err.message);
        throw err;
      }
    } else {
      const items = cart.products.map(item => {
        if (item.productId._id === productId) {
          return { ...item, quantity: qty };
        }
        return item;
      });
      saveGuestCart({ products: items });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const data = await api.cart.remove(productId);
        setCart(data);
      } catch (err) {
        console.error('Remove from cart failed:', err.message);
        throw err;
      }
    } else {
      const items = cart.products.filter(item => item.productId._id !== productId);
      saveGuestCart({ products: items });
    }
  };

  const clearCart = useCallback(async () => {
    if (user) {
      // The backend will clear the cart automatically when order is created,
      // but if we need to clear it manually:
      try {
        // We can just get an empty cart by loading or updating
        setCart({ products: [] });
      } catch (err) {
        console.error(err);
      }
    } else {
      saveGuestCart({ products: [] });
    }
  }, [user]);

  // Compute stats memoized
  const cartCount = useMemo(() => {
    return cart.products.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.products.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      refreshCart: loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
