import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ totalQuantity: 0, subtotal: 0, items: [] });

  const refreshCart = useCallback(async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data || { totalQuantity: 0, subtotal: 0, items: [] });
    } catch {
      // Ignore transient errors
    }
  }, []);

  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        try {
          const res = await cartApi.mergeGuestCart();
          setCart(res.data || { totalQuantity: 0, subtotal: 0, items: [] });
          return;
        } catch {
          // Fall back to fetching user cart
        }
      }
      await refreshCart();
    };
    syncCart();
  }, [isAuthenticated, refreshCart]);

  const addToCart = async ({ productId = null, variantId = null, quantity = 1 }) => {
    const res = await cartApi.addItem({ productId, variantId, quantity });
    setCart(res.data);
    return res.data;
  };

  const updateQuantity = async (variantId, quantity) => {
    const res = await cartApi.updateItem(variantId, quantity);
    setCart(res.data);
    return res.data;
  };

  const removeFromCart = async (variantId) => {
    const res = await cartApi.removeItem(variantId);
    setCart(res.data);
    return res.data;
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    setCart(res.data);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity: cart?.totalQuantity || 0,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
