import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // إضافة منتج للسلة مع منع تجاوز الـ 10 قطع نهائياً
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const currentQty = newItems[existingItemIndex].quantity;
        
        if (currentQty >= 10) {
          return newItems;
        }
        
        newItems[existingItemIndex].quantity = currentQty + 1;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  // إزالة منتج من السلة
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // تفريغ السلة بالكامل بعد إتمام الطلب بنجاح
  const clearCart = () => {
    setCartItems([]);
  };

  // تحديث الكمية (زيادة أو نقصان مع تقييد صارم بين 1 و 10)
  const updateQuantity = (id, deltaOrNewValue) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          let newQty;
          if (deltaOrNewValue === 1 || deltaOrNewValue === -1) {
            newQty = item.quantity + deltaOrNewValue;
          } else {
            newQty = deltaOrNewValue;
          }

          if (newQty > 10) newQty = 10;
          if (newQty < 1) newQty = 1;

          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  // 🛡️ حساب إجمالي السعر بشكل آمن مع تحويل السعر والكمية إلى أرقام حصرياً
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  // إجمالي عدد القطع في السلة
  const totalItemsCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}