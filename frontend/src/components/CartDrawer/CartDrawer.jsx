import React from 'react';
import './CartDrawer.css';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartDrawer({ lang }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, setIsCheckoutOpen } = useCart();
  
  const isAr = lang === 'ar';

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} dir="ltr">
        
        {/* رأس السلة */}
        <div className="cart-header" dir="ltr">
          <div className="cart-title-wrapper">
            <ShoppingBag size={20} />
            <h2>{isAr ? "سلة التسوق" : "Shopping Cart"}</h2>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* محتوى المنتجات داخل السلة */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>{isAr ? "سلة التسوق فارغة حالياً" : "Your cart is currently empty"}</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemName = typeof item.name === 'object' 
                  ? (item.name[lang] || item.name.en || Object.values(item.name)[0]) 
                  : item.name;

                const isMaxLimit = item.quantity >= 10;

                return (
                  <div key={item.id} className="cart-item-card" dir="ltr" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                      <img src={item.image} alt={itemName} className="cart-item-img" />
                      
                      <div className="cart-item-details" style={{ flex: 1 }}>
                        <h4>{itemName}</h4>
                        {item.selectedSize && (
                          <span style={{ fontSize: '0.8rem', color: '#ffffff', display: 'block', margin: '2px 0' }}>
                            {isAr ? "المقاس: " : "Size: "}{item.selectedSize}
                          </span>
                        )}
                        <span className="cart-item-price">{item.price.toLocaleString()} د.ج</span>
                        
                        <div className="cart-item-controls">
                          <div className="quantity-btns">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(item.id, -1);
                              }}
                            >
                              -
                            </button>

                            <span>{item.quantity}</span>

                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (item.quantity < 10) {
                                  updateQuantity(item.id, 1);
                                }
                              }}
                              disabled={isMaxLimit}
                              style={{ 
                                opacity: isMaxLimit ? 0.4 : 1, 
                                cursor: isMaxLimit ? 'not-allowed' : 'pointer' 
                              }}
                            >
                              +
                            </button>
                          </div>

                          <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isMaxLimit && (
                      <span style={{ 
                        color: '#ff6b6b', 
                        fontSize: '0.75rem', 
                        marginTop: '6px', 
                        textAlign: isAr ? 'right' : 'left',
                        width: '100%' 
                      }}>
                        {isAr ? "⚠️ لقد وصلت للحد الأقصى (10 قطع)" : "⚠️ Reached maximum limit (10 items)"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* تذييل السلة وزر إتمام الطلب */}
        {cartItems.length > 0 && (
          <div className="cart-footer" dir="ltr">
            <div className="cart-total-row">
              <span>{isAr ? "المجموع الكلي:" : "Total Price:"}</span>
              <span className="total-amount">{totalPrice.toLocaleString()} د.ج</span>
            </div>

            <button 
              type="button" 
              className="checkout-btn" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCartOpen(false);     // إغلاق السلة
                setIsCheckoutOpen(true);  // فتح نافذة الدفع المستقلة في المستوى الأب
              }}
            >
              <span>{isAr ? "إتمام الطلب" : "Proceed to Checkout"}</span>
              {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}