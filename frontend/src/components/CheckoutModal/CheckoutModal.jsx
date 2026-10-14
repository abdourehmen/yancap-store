import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './CheckoutModal.css';
import { X, CheckCircle, MapPin, Phone, User, Home, Building2, Truck } from 'lucide-react';
import { wilayasData } from '../../data/wilayas';
import { supabase } from '../../supabaseClient';
import { useCart } from '../../context/CartContext';

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, lang }) {
  const { clearCart } = useCart();
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    deliveryType: 'home', // 'home' أو 'stop_desk'
    stopDeskLocation: '', 
    customer_notes: ''
  });

  const [selectedWilayaObj, setSelectedWilayaObj] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleWilayaChange = (e) => {
    const wilayaName = e.target.value;
    setFormData({ 
      ...formData, 
      wilaya: wilayaName, 
      commune: '', 
      stopDeskLocation: '',
      deliveryType: 'home' 
    });
    
    // البحث عن الولاية سواء بالاسم العربي أو الإنجليزي أو الرقم التعريفي لضمان إيجادها دائماً
    const found = wilayasData.find(w => 
      w.nameAr === wilayaName || 
      w.nameEn === wilayaName || 
      `${w.id} - ${w.nameAr}` === wilayaName || 
      `${w.id} - ${w.nameEn}` === wilayaName
    );
    
    setSelectedWilayaObj(found || null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const safeTotalPrice = Number(totalPrice) || 0;
  
  // حساب رسوم التوصيل بناءً على الاختيار (منزل أو مكتب توقف)
  const shippingCost = selectedWilayaObj 
    ? Number(formData.deliveryType === 'stop_desk' ? (selectedWilayaObj.stopDeskFee || 0) : (selectedWilayaObj.shippingFee || 0)) 
    : 0;
    
  const grandTotal = safeTotalPrice + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newOrder = {
      full_name: formData.fullName,
      phone: formData.phone,
      address: formData.deliveryType === 'home' 
        ? `${formData.commune} - ${formData.address}` 
        : `${isAr ? 'مكتب ZR Express (Stop Desk):' : 'ZR Express Stop Desk:'} ${formData.stopDeskLocation} (${formData.wilaya})`,
      wilaya_name: formData.wilaya,
      delivery_type: formData.deliveryType,
      items: cartItems,
      total_with_shipping: Number(grandTotal),
      customer_notes: formData.customer_notes,
      status: 'pending'
    };

    // 1. إرسال الطلب إلى جدول orders
    const { error: orderError } = await supabase
      .from('orders')
      .insert([newOrder]);

    if (orderError) {
      setLoading(false);
      console.error('Error inserting order:', orderError);
      alert(isAr ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.' : 'Error placing order, please try again.');
      return;
    }

    // 2. تحديث وخصم الكمية من المخزون لكل منتج في السلة
    for (const item of cartItems) {
      const currentStock = Number(item.stock) || 0;
      const quantityToSubtract = Number(item.quantity) || 1; 
      const newStock = Math.max(0, currentStock - quantityToSubtract);

      const { error: stockError } = await supabase
        .from('products') 
        .update({ stock: newStock })
        .eq('id', item.id);

      if (stockError) {
        console.error(`Error updating stock for product ${item.id}:`, stockError);
      }
    }

    setLoading(false);
    setOrderSubmitted(true);
    clearCart();
  };

  // التحقق المباشر من وجود مكاتب في كائن الولاية المحدد داخل wilayas.js
  const availableStopDesks = selectedWilayaObj?.stopDesks || [];
  const hasStopDeskSupport = availableStopDesks.length > 0;

  return ReactDOM.createPortal(
    <div className="checkout-overlay">
      <div className="checkout-modal">
        
        <button className="close-modal-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {orderSubmitted ? (
          <div className="success-state">
            <CheckCircle size={60} className="success-icon" />
            <h2>{isAr ? "تم تأكيد طلبك بنجاح!" : "Order Placed Successfully!"}</h2>
            <p>
              {isAr 
                ? "شكراً لتسوقك معنا. تم حفظ طلبك وسنتصل بك قريباً لتأكيد التوصيل (الدفع عند الاستلاستام)." 
                : "Thank you for shopping with us. Your order has been saved and we will call you soon to confirm your delivery (Cash on Delivery)."
              }
            </p>
            <button className="primary-btn" onClick={onClose}>
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>{isAr ? "إتمام الطلب (الدفع عند الاستلام)" : "Checkout (Cash on Delivery)"}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label><User size={14} /> {isAr ? "الاسم واللقب" : "Full Name"}</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  value={formData.fullName} 
                  onChange={handleChange}
                  placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"} 
                />
              </div>

              <div className="form-group">
                <label><Phone size={14} /> {isAr ? "رقم الهاتف" : "Phone Number"}</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="05XXXXXXXX" 
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={14} /> 
                  {isAr ? "الولاية" : "Wilaya"} 
                  {selectedWilayaObj && (
                    <span className="shipping-badge-inline">
                      {isAr ? `توصيل: ${shippingCost} دج` : `Shipping: ${shippingCost} DA`}
                    </span>
                  )}
                </label>
                <select 
                  name="wilaya" 
                  required 
                  value={formData.wilaya} 
                  onChange={handleWilayaChange}
                >
                  <option value="">{isAr ? "-- اختر الولاية --" : "-- Select Wilaya --"}</option>
                  {wilayasData.map(w => (
                    <option key={w.id} value={isAr ? w.nameAr : w.nameEn}>
                      {isAr ? `${w.id} - ${w.nameAr}` : `${w.id} - ${w.nameEn}`}
                    </option>
                  ))}
                </select>
              </div>

              {formData.wilaya && hasStopDeskSupport && (
                <div className="form-group full-width">
                  <label><Truck size={14} /> {isAr ? "طريقة التوصيل (ZR Express)" : "Delivery Method"}</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 14px', 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(255, 255, 255, 0.2)', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontSize: '0.9rem'
                    }}>
                      <input 
                        type="radio" 
                        name="deliveryType" 
                        value="home" 
                        checked={formData.deliveryType === 'home'} 
                        onChange={handleChange} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#fff' }}
                      />
                      <span>{isAr ? "التوصيل للمنزل (Domicile)" : "Home Delivery"}</span>
                    </label>

                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px 14px', 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(255, 255, 255, 0.2)', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontSize: '0.9rem'
                    }}>
                      <input 
                        type="radio" 
                        name="deliveryType" 
                        value="stop_desk" 
                        checked={formData.deliveryType === 'stop_desk'} 
                        onChange={handleChange} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#fff' }}
                      />
                      <span>{isAr ? "التوصيل لمكتب شركة (Stop Desk)" : "Stop Desk"}</span>
                    </label>

                  </div>
                </div>
              )}

              {formData.deliveryType === 'stop_desk' && hasStopDeskSupport && (
                <div className="form-group full-width">
                  <label><Building2 size={14} /> {isAr ? "اختر مكتب الاستلام (Stop Desk)" : "Select Stop Desk Office"}</label>
                  <select 
                    name="stopDeskLocation" 
                    required={formData.deliveryType === 'stop_desk'}
                    value={formData.stopDeskLocation}
                    onChange={handleChange}
                  >
                    <option value="">{isAr ? "-- اختر المكتب الأقرب إليك --" : "-- Select Office --"}</option>
                    {availableStopDesks.map((desk, idx) => (
                      <option key={idx} value={desk}>{desk}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.deliveryType === 'home' && (
                <>
                  <div className="form-group">
                    <label><MapPin size={14} /> {isAr ? "البلدية" : "Commune"}</label>
                    <input 
                      type="text" 
                      name="commune" 
                      required={formData.deliveryType === 'home'} 
                      value={formData.commune} 
                      onChange={handleChange}
                      placeholder={isAr ? "أدخل البلدية" : "Enter commune"} 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label><Home size={14} /> {isAr ? "العنوان التفصيلي" : "Detailed Address"}</label>
                    <input 
                      type="text" 
                      name="address" 
                      required={formData.deliveryType === 'home'} 
                      value={formData.address} 
                      onChange={handleChange}
                      placeholder={isAr ? "الشارع، الحي، رقم المنزل..." : "Street, Neighborhood, House No..."} 
                    />
                  </div>
                </>
              )}
            </div>

            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>{isAr ? "مجموع المنتجات:" : "Subtotal:"}</span>
                <span>{safeTotalPrice} {isAr ? "دج" : "DA"}</span>
              </div>
              <div className="summary-row">
                <span>{isAr ? "رسوم التوصيل:" : "Shipping Fee:"}</span>
                <span>{shippingCost} {isAr ? "دج" : "DA"}</span>
              </div>
              <div className="summary-row total-row">
                <span>{isAr ? "المجموع الكلي:" : "Grand Total:"}</span>
                <span className="accent-price">{grandTotal} {isAr ? "دج" : "DA"}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="confirm-order-btn" 
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading && (
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
              )}
              <span>
                {loading 
                  ? (isAr ? "جاري معالجة طلبك، يرجى الانتظار..." : "Processing your order, please wait...") 
                  : (isAr ? "تأكيد الطلب (الدفع عند الاستلام)" : "Confirm Order (COD)")
                }
              </span>
            </button>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
}
