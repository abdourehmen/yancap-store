import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag,
  ShieldCheck, 
  ShoppingCart, 
  Package, 
  CheckSquare, 
  Truck, 
  Ban, 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  X,
  PhoneCall,
  RotateCcw,
  Clock,
  Flame,
  Tag,
  Ruler,
  AlertCircle
} from 'lucide-react';
import './AdminDashboard.css';
import imageCompression from 'browser-image-compression'; // استيراد مكتبة الضغط
import BagsAdmin from './BagsAdmin';

export default function AdminDashboard({ lang = 'ar', supabaseClient }) {
  const isAr = lang === 'ar';
  
  const [activeTab, setActiveTab] = useState('orders');
  const [ordersFilter, setOrdersFilter] = useState('pending');
  const [successMessage, setSuccessMessage] = useState('');
  
  // 🚀 حالة نافذة التأكيد العائمة الجميلة بدلاً من alert المتصفح
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: { ar: '', en: '' },
    price: '',
    discountPrice: '',
    stock: '',
    sizes: '', 
    description: { ar: '', en: '' },
    images: [],
    is_popular: false,
    is_sale: false
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [supabaseClient]);

  const fetchOrders = async () => {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    if (!supabaseClient) return;
    
    try {
      const { error } = await supabaseClient
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      showSuccess(isAr ? "تم تحديث حالة الطلب بنجاح" : "Order status updated successfully");
    } catch (err) {
      console.error("Error updating order status:", err.message);
      showSuccess(isAr ? "فشل تحديث حالة الطلب" : "Failed to update status");
    }
  };

  // 🚀 دالة فتح نافذة التأكيد الجميلة قبل الحذف
  const confirmDeleteOrder = (orderId) => {
    setConfirmModal({
      show: true,
      title: isAr ? "تأكيد الحذف النهائي" : "Confirm Permanent Deletion",
      message: isAr ? "هل أنت متأكد من رغبتك في حذف هذه الطلبية نهائياً؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to permanently delete this order? This action cannot be undone.",
      onConfirm: () => executeDeleteOrder(orderId)
    });
  };

  // 🚀 دالة الحذف الفعلية بعد تأكيد المستخدم
  const executeDeleteOrder = async (orderId) => {
    setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
    try {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('orders')
          .delete()
          .eq('id', orderId);

        if (error) throw error;
      }

      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      showSuccess(isAr ? "تم حذف الطلبية نهائياً" : "Order deleted permanently");
    } catch (err) {
      console.error("Error deleting order:", err.message);
      showSuccess(isAr ? "فشل حذف الطلبية" : "Failed to delete order");
    }
  };

  // 🚀 دالة كشف الطلبيات الوهمية والمشبوهة الذكية
  const analyzeOrderRisk = (order, allOrders = []) => {
    let riskScore = 0;
    let reasons = [];

    const fullName = (order.full_name || order.fullName || '').trim();
    const phone = (order.phone || '').trim().replace(/\s+/g, '');
    const address = (order.address || '').trim();
    const notes = (order.customer_notes || '').toLowerCase();

    // 1. فحص طول الاسم أو إذا كان يحتوي على أرقام فقط
    if (fullName.length < 3 || /^[0-9]+$/.test(fullName)) {
      riskScore += 35;
      reasons.push(isAr ? "الاسم قصير جداً أو يحتوي على أرقام فقط" : "Short or numeric name");
    }

    // 2. فحص رقم الهاتف الجزائري الصحيح (10 أرقام وتبدأ ب 05, 06, 07)
    const algerianPhoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!algerianPhoneRegex.test(phone)) {
      riskScore += 50;
      reasons.push(isAr ? "رقم الهاتف غير مطابق لصيغة المحمول في الجزائر" : "Invalid phone format");
    }

    // 3. فحص الأرقام المتكررة أو الوهمية المتسلسلة
    if (/^(\d)\1{9}$/.test(phone) || phone.includes('123456')) {
      riskScore += 60;
      reasons.push(isAr ? "رقم الهاتف يبدو وهمياً أو متسلسلاً" : "Suspicious sequential phone");
    }

    // 4. فحص تكرار الطلبات من نفس الرقم
    const duplicateOrders = allOrders.filter(o => (o.phone || '').trim().replace(/\s+/g, '') === phone);
    if (duplicateOrders.length > 1) {
      riskScore += 40;
      reasons.push(isAr ? `رقم الهاتف كرر الطلب (${duplicateOrders.length} مرات)` : `Duplicate phone orders (${duplicateOrders.length})`);
    }

    // 5. فحص قصر العنوان
    if (address.length < 6) {
      riskScore += 25;
      reasons.push(isAr ? "العنوان غير دقيق أو قصير جداً" : "Very short address");
    }

    // 6. كلمات مشبوهة في الملاحظات
    if (notes.includes('test') || notes.includes('تجربة') || notes.includes('تست') || notes.includes('لعب')) {
      riskScore += 50;
      reasons.push(isAr ? "وجود كلمات تجريبية في ملاحظات الزبون" : "Test keywords in notes");
    }

    // التقييم النهائي
    if (riskScore >= 60) {
      return { level: 'high', label: isAr ? '⚠️ طلبية عالية الخطورة (محتمل وهمية)' : 'High Risk Order', reasons };
    } else if (riskScore >= 30) {
      return { level: 'medium', label: isAr ? '⚡ طلبية مشبوهة (تتطلب مكالمة تأكيد دقيقة)' : 'Medium Risk Order', reasons };
    }
    return { level: 'safe', label: isAr ? '✅ طلبية سليمة وموثوقة' : 'Safe Order', reasons: [] };
  };

  const fetchProducts = async () => {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const pendingCount = orders.filter(o => !o.status || o.status === 'pending').length;
  const noAnswerCount = orders.filter(o => o.status === 'no_answer').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const shippingCount = orders.filter(o => o.status === 'shipping').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const returnedCount = orders.filter(o => o.status === 'returned').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const filteredOrders = orders.filter(order => {
    const orderStatus = order.status || 'pending';
    if (ordersFilter === 'all') return true;
    return orderStatus === ordersFilter;
  });

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!supabaseClient || files.length === 0) return;

    setLoading(true);
    const uploadedUrls = [];
    try {
      for (const file of files) {
        // 🚀 تم تعديل إعدادات الضغط لرفع دقة ووضوح الصور (أبعاد حتى 1600 بكسل وجودة عالية)
        const options = {
  maxSizeMB: 1.0,          // السماح بحجم ملف يصل إلى 1 ميجابايت للحفاظ على تفاصيل الصورة
  maxWidthOrHeight: 1600,  // رفع الأبعاد القصوى للصورة لتكون واضحة جداً في الشاشات الكبيرة والموبايل
  useWebWorker: true,
  fileType: 'image/webp'
};

        const compressedFile = await imageCompression(file, options);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
          .from('product-images')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data } = supabaseClient.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 6)
      }));
    } catch (err) {
      console.error("Error uploading image to Supabase Storage:", err.message);
      showSuccess(isAr ? "فشل رفع الصورة، تحقق من الاتصال" : "Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productPayload = {
      name: typeof newProduct.name === 'object' ? (newProduct.name.ar || newProduct.name.en || '') : newProduct.name,
      price: parseFloat(newProduct.price),
      discount_price: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : null,
      stock: parseInt(newProduct.stock) || 0,
      sizes: newProduct.sizes || '',
      description: typeof newProduct.description === 'object' ? (newProduct.description.ar || newProduct.description.en || '') : newProduct.description,
      image: newProduct.images[0] || 'https://via.placeholder.com/70',
      images: newProduct.images,
      popular: newProduct.is_popular,
      is_sale: newProduct.is_sale
    };

    try {
      if (editingId !== null) {
        if (supabaseClient) {
          const { error } = await supabaseClient.from('products').update(productPayload).eq('id', editingId);
          if (error) throw error;
        }
        setProducts(products.map(p => p.id === editingId ? { ...p, ...productPayload } : p));
        showSuccess(isAr ? "تم تعديل المنتج بنجاح" : "Product updated successfully");
      } else {
        if (supabaseClient) {
          const { data, error } = await supabaseClient.from('products').insert([productPayload]).select();
          if (error) throw error;
          if (data) setProducts([data[0], ...products]);
        } else {
          setProducts([{ ...productPayload, id: Date.now() }, ...products]);
        }
        showSuccess(isAr ? "تم إضافة المنتج بنجاح" : "Product added successfully");
      }
      handleCancelEdit();
    } catch (err) {
      console.error("Error saving product:", err.message);
      showSuccess(isAr ? "حدث خطأ أثناء حفظ المنتج" : "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (prod) => {
    setEditingId(prod.id);
    
    let formattedImages = [];
    if (Array.isArray(prod.images)) {
      formattedImages = prod.images;
    } else if (typeof prod.images === 'string') {
      try {
        const parsed = JSON.parse(prod.images);
        formattedImages = Array.isArray(parsed) ? parsed : [prod.images];
      } catch {
        formattedImages = [prod.images];
      }
    } else if (prod.image) {
      formattedImages = [prod.image];
    }

    setNewProduct({
      name: { ar: typeof prod.name === 'string' ? prod.name : (prod.name?.ar || ''), en: prod.name?.en || '' },
      price: prod.price || '',
      discountPrice: prod.discount_price || prod.discountPrice || '',
      stock: prod.stock || '',
      sizes: prod.sizes || '',
      description: { ar: typeof prod.description === 'string' ? prod.description : (prod.description?.ar || ''), en: prod.description?.en || '' },
      images: formattedImages,
      is_popular: prod.popular || prod.is_featured || false,
      is_sale: prod.is_sale || false
    });
    setActiveTab('products');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewProduct({
      name: { ar: '', en: '' },
      price: '',
      discountPrice: '',
      stock: '',
      sizes: '',
      description: { ar: '', en: '' },
      images: [],
      is_popular: false,
      is_sale: false
    });
  };

  const handleDeleteProduct = async (id) => {
    if (supabaseClient) {
      await supabaseClient.from('products').delete().eq('id', id);
    }
    setProducts(products.filter(p => p.id !== id));
    showSuccess(isAr ? "تم حذف المنتج" : "Product deleted");
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="order-status confirmed">{isAr ? 'مؤكدة' : 'Confirmed'}</span>;
      case 'no_answer': return <span className="order-status no-answer">{isAr ? 'لم يتم الرد' : 'No Answer'}</span>;
      case 'shipping': return <span className="order-status shipping">{isAr ? 'مع الشحن' : 'Shipping'}</span>;
      case 'delivered': return <span className="order-status delivered">{isAr ? 'تم التوصيل' : 'Delivered'}</span>;
      case 'returned': return <span className="order-status returned">{isAr ? 'مرتجعة' : 'Returned'}</span>;
      case 'cancelled': return <span className="order-status cancelled">{isAr ? 'ملغاة' : 'Cancelled'}</span>;
      default: return <span className="order-status pending">{isAr ? 'قيد الانتظار' : 'Pending'}</span>;
    }
  };

  return (
    <div className={`admin-dashboard-container ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 🚀 إشعار الـ Toast العائم الحديث في الأعلى */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600',
          fontSize: '0.95rem',
          animation: 'fadeInOut 0.3s ease'
        }}>
          <CheckSquare size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 🚀 نافذة التأكيد المنبثقة الجميلة (Modal) بدلاً من alert المتصفح */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            textAlign: isAr ? 'right' : 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#E11D48' }}>
              <div style={{ padding: '10px', background: 'rgba(225, 29, 72, 0.15)', borderRadius: '12px' }}>
                <AlertCircle size={24} />
              </div>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem' }}>{confirmModal.title}</h3>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {confirmModal.message}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: isAr ? 'flex-start' : 'flex-end' }}>
              <button 
                onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>

              <button 
                onClick={confirmModal.onConfirm}
                style={{
                  background: '#E11D48',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#be123c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#E11D48'}
              >
                {isAr ? "تأكيد الحذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div className="admin-title-wrapper">
          <ShieldCheck size={26} className="admin-brand-icon" />
          <h1>{isAr ? "إدارة المتجر والطلبات (yancap.dz)" : "Store & Orders Admin Dashboard"}</h1>
        </div>
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={16} />
            <span>{isAr ? `الطلبات (${orders.length})` : `Orders (${orders.length})`}</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            <span>{isAr ? `المنتجات (${products.length})` : `Products (${products.length})`}</span>
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'bags' ? 'active' : ''}`}
            onClick={() => setActiveTab('bags')}
          >
            <ShoppingBag size={16} />
            <span>{isAr ? "الحقائب" : "Bags"}</span>
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && (
          <div className="admin-section">
            <h2>{isAr ? "مسار متابعة طلبيات الدفع عند الاستلام" : "Orders Pipeline Management"}</h2>
            
            <div className="orders-sub-tabs">
              <button className={`filter-btn ${ordersFilter === 'pending' ? 'active' : ''}`} onClick={() => setOrdersFilter('pending')}>
                <Clock size={15} />
                <span>{isAr ? `الجديدة (${pendingCount})` : `Pending (${pendingCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'no_answer' ? 'active' : ''}`} onClick={() => setOrdersFilter('no_answer')}>
                <PhoneCall size={15} />
                <span>{isAr ? `لم يرد (${noAnswerCount})` : `No Answer (${noAnswerCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'confirmed' ? 'active' : ''}`} onClick={() => setOrdersFilter('confirmed')}>
                <CheckSquare size={15} />
                <span>{isAr ? `مؤكدة (${confirmedCount})` : `Confirmed (${confirmedCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'shipping' ? 'active' : ''}`} onClick={() => setOrdersFilter('shipping')}>
                <Truck size={15} />
                <span>{isAr ? `مع الشحن (${shippingCount})` : `Shipping (${shippingCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'delivered' ? 'active' : ''}`} onClick={() => setOrdersFilter('delivered')}>
                <ShieldCheck size={15} />
                <span>{isAr ? `موصولة (${deliveredCount})` : `Delivered (${deliveredCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'returned' ? 'active' : ''}`} onClick={() => setOrdersFilter('returned')}>
                <RotateCcw size={15} />
                <span>{isAr ? `مرتجعة (${returnedCount})` : `Returned (${returnedCount})`}</span>
              </button>
              <button className={`filter-btn ${ordersFilter === 'cancelled' ? 'active' : ''}`} onClick={() => setOrdersFilter('cancelled')}>
                <Ban size={15} />
                <span>{isAr ? `ملغاة (${cancelledCount})` : `Cancelled (${cancelledCount})`}</span>
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty">
                <ShoppingCart size={48} />
                <p>{isAr ? "لا توجد طلبيات في هذا القسم حالياً" : "No orders found in this section"}</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map((order, index) => (
                  <div key={order.id || index} className="order-card">
                    <div className="order-card-header">
                      <span className="order-id">#Order-{order.id}</span>
                      {renderStatusBadge(order.status)}
                    </div>

                    {/* 🚀 قسم كشف الطلبيات الوهمية والمشبوهة التلقائي */}
                    {(() => {
                      const risk = analyzeOrderRisk(order, orders);
                      if (risk.level === 'safe') return null;

                      return (
                        <div style={{
                          background: risk.level === 'high' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          border: `1px solid ${risk.level === 'high' ? 'rgba(225, 29, 72, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          borderRadius: '8px',
                          padding: '10px 12px',
                          margin: '10px 0',
                          fontSize: '0.85rem'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            color: risk.level === 'high' ? '#E11D48' : '#F59E0B', 
                            fontWeight: '700',
                            marginBottom: risk.reasons.length > 0 ? '4px' : '0'
                          }}>
                            <span>{risk.label}</span>
                          </div>
                          {risk.reasons.length > 0 && (
                            <ul style={{ margin: 0, paddingInlineStart: '18px', color: '#cbd5e1' }}>
                              {risk.reasons.map((reason, idx) => (
                                <li key={idx} style={{ fontSize: '0.8rem' }}>{reason}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })()}
                    
                    <div className="info-row">
                      <span className="info-label">{isAr ? "التاريخ:" : "Date:"}</span>
                      <span className="info-value" dir="ltr">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : (isAr ? "غير محدد" : "N/A")}
                      </span>
                    </div>

                    {order.customer_notes && (
                      <div className="info-row customer-notes-row">
                        <span className="info-label">{isAr ? "ملاحظات الزبون:" : "Notes:"}</span>
                        <span className="info-value note-highlight">
                          {order.customer_notes}
                        </span>
                      </div>
                    )}

                    <div className="order-customer-section">
                      <div className="info-row">
                        <span className="info-label">{isAr ? "الزبون:" : "Customer:"}</span>
                        <span className="info-value">{order.full_name || order.fullName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{isAr ? "الهاتف:" : "Phone:"}</span>
                        <span className="info-value" dir="ltr">
                          <a href={`tel:${order.phone}`} className="phone-link">{order.phone}</a>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{isAr ? "العنوان:" : "Address:"}</span>
                        <span className="info-value">{order.address}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">{isAr ? "الولاية:" : "Wilaya:"}</span>
                        <span className="info-value">
                          {order.wilaya_name || order.wilayaName} 
                          ({order.delivery_type === 'home' ? (isAr ? 'توصيل للمنزل' : 'Home') : (isAr ? 'مكتب' : 'Desk')})
                        </span>
                      </div>
                    </div>

                    <div className="order-items-section">
                      <span className="section-title">{isAr ? "المنتجات المطلوبة:" : "Ordered Items:"}</span>
                      <ul className="items-list">
                        {order.items && order.items.map((item, idx) => (
                          <li key={idx} className="item-row">
                            <span className="item-name">
                              {typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name}
                              {item.selectedSize && <strong style={{color: '#E11D48', marginInlineStart: '6px'}}>({item.selectedSize})</strong>}
                            </span>
                            <span className="item-qty">x{item.quantity}</span>
                            <span className="item-price">{item.price} د.ج</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-footer">
                      <div className="order-total-price">
                        <span>{isAr ? "المجموع الكلي (مع التوصيل):" : "Total Amount (with shipping):"}</span>
                        <span className="amount">
                          {(() => {
                            const rawTotal = order.total_with_shipping || order.total_amount || order.totalWithShipping || order.total;
                            if (rawTotal) return rawTotal;

                            let productsTotal = 0;
                            if (order.items && Array.isArray(order.items)) {
                              productsTotal = order.items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
                            }

                            const shippingCost = Number(order.shipping_cost || order.shippingCost || order.delivery_price || order.deliveryPrice || 0);

                            return productsTotal + shippingCost;
                          })()} د.ج
                        </span>
                      </div>

                      <div className="order-actions-pipeline">
                        {order.status !== 'confirmed' && (
                          <button className="status-action-btn confirm" onClick={() => handleChangeOrderStatus(order.id, 'confirmed')}>
                            {isAr ? "تأكيد" : "Confirm"}
                          </button>
                        )}
                        {order.status !== 'no_answer' && order.status !== 'confirmed' && (
                          <button className="status-action-btn no-answer" onClick={() => handleChangeOrderStatus(order.id, 'no_answer')}>
                            {isAr ? "لم يرد" : "No Answer"}
                          </button>
                        )}
                        {order.status !== 'shipping' && (
                          <button className="status-action-btn shipping" onClick={() => handleChangeOrderStatus(order.id, 'shipping')}>
                            {isAr ? "شحن" : "Ship"}
                          </button>
                        )}
                        {order.status !== 'delivered' && (
                          <button className="status-action-btn deliver" onClick={() => handleChangeOrderStatus(order.id, 'delivered')}>
                            {isAr ? "توصيل" : "Deliver"}
                          </button>
                        )}
                        {order.status !== 'returned' && (
                          <button className="status-action-btn returned" onClick={() => handleChangeOrderStatus(order.id, 'returned')}>
                            {isAr ? "مرتجعة" : "Return"}
                          </button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button className="status-action-btn cancel" onClick={() => handleChangeOrderStatus(order.id, 'cancelled')}>
                            {isAr ? "إلغاء" : "Cancel"}
                          </button>
                        )}
                      </div>

                      {/* زر الحذف الذي ينشط نافذة التأكيد المنبثقة الجميلة */}
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => confirmDeleteOrder(order.id)}
                          style={{
                            background: 'rgba(225, 29, 72, 0.1)',
                            color: '#E11D48',
                            border: '1px solid rgba(225, 29, 72, 0.3)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#E11D48';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)';
                            e.currentTarget.style.color = '#E11D48';
                          }}
                        >
                          <Trash2 size={14} />
                          <span>{isAr ? "حذف الطلبية نهائياً" : "Delete Order"}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-section">
            <h2>{isAr ? "إدارة وتعديل منتجات المتجر سحابياً" : "Manage Store Products in Supabase"}</h2>
            
            <form onSubmit={handleAddOrUpdateProduct} className="add-product-form">
              <div className="form-header-row">
                <h3>
                  {editingId !== null 
                    ? (isAr ? "تعديل بيانات المنتج" : "Edit Product") 
                    : (isAr ? "إضافة منتج جديد لقاعدة البيانات" : "Add New Product")}
                </h3>
                {editingId !== null && (
                  <button type="button" onClick={handleCancelEdit} className="cancel-edit-btn">
                    {isAr ? "إلغاء التعديل" : "Cancel Edit"}
                  </button>
                )}
              </div>

              <div className="form-grid">
                <input 
                  type="text" 
                  placeholder={isAr ? "اسم المنتج بالعربية" : "Product Name (Arabic)"}
                  value={newProduct.name.ar}
                  onChange={(e) => setNewProduct({...newProduct, name: {...newProduct.name, ar: e.target.value}})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder={isAr ? "اسم المنتج بالإنجليزية" : "Product Name (English)"}
                  value={newProduct.name.en}
                  onChange={(e) => setNewProduct({...newProduct, name: {...newProduct.name, en: e.target.value}})} 
                />
                <input 
                  type="number" 
                  placeholder={isAr ? "السعر الأصلي (د.ج)" : "Regular Price (DZD)"}
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required 
                />
                <input 
                  type="number" 
                  placeholder={isAr ? "سعر التخفيض (اختياري)" : "Discount Price (Optional)"}
                  value={newProduct.discountPrice}
                  onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})}
                />
              </div>

              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '10px' }}>
                <input 
                  type="number" 
                  placeholder={isAr ? "الكمية المتبقية في المخزون" : "Stock Quantity"}
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder={isAr ? "المقاسات المتوفرة (مثال: 56, 58)" : "Available Sizes (e.g., S, M, L)"}
                  value={newProduct.sizes}
                  onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <input 
                    type="checkbox" 
                    id="popularCheckbox"
                    checked={newProduct.is_popular}
                    onChange={(e) => setNewProduct({...newProduct, is_popular: e.target.checked})}
                    style={{ width: '18px', height: '18px', accentColor: '#E11D48', cursor: 'pointer' }}
                  />
                  <label htmlFor="popularCheckbox" style={{ cursor: 'pointer', color: '#ffffff', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={16} color="#E11D48" />
                    {isAr ? "تمييز المنتج كـ (الأكثر طلباً) وإظهار الشارة الحمراء" : "Mark as Most Popular Product"}
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <input 
                    type="checkbox" 
                    id="saleCheckbox"
                    checked={newProduct.is_sale}
                    onChange={(e) => setNewProduct({...newProduct, is_sale: e.target.checked})}
                    style={{ width: '18px', height: '18px', accentColor: '#E11D48', cursor: 'pointer' }}
                  />
                  <label htmlFor="saleCheckbox" style={{ cursor: 'pointer', color: '#ffffff', fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={16} color="#E11D48" />
                    {isAr ? "عرض في قسم (التخفيضات الحصرية)" : "Mark as Special Sale Product"}
                  </label>
                </div>
              </div>

              <div className="form-grid textareas-grid">
                <textarea 
                  placeholder={isAr ? "وصف المنتج بالعربية" : "Product Description (Arabic)"}
                  value={newProduct.description.ar}
                  onChange={(e) => setNewProduct({...newProduct, description: {...newProduct.description, ar: e.target.value}})}
                />
                <textarea 
                  placeholder={isAr ? "وصف المنتج بالإنجليزية (اختياري)" : "Product Description (English)"}
                  value={newProduct.description.en}
                  onChange={(e) => setNewProduct({...newProduct, description: {...newProduct.description, en: e.target.value}})}
                />
              </div>

              <div className="images-upload-wrapper">
                <label className="upload-label-title">
                  {isAr ? `صور المنتج (${newProduct.images.length}/6 مرفوعة):` : `Product Images (${newProduct.images.length}/6 uploaded):`}
                </label>
                
                <div className="upload-controls">
                  {newProduct.images.length < 6 && (
                    <label className="file-upload-btn">
                      <ImageIcon size={18} />
                      <span>{isAr ? "اختر صور" : "Select Images"}</span>
                      <input type="file" accept="image/*" multiple onChange={handleImagesUpload} hidden />
                    </label>
                  )}
                </div>

                <div className="previews-container">
                  {newProduct.images.map((imgSrc, idx) => (
                    <div key={idx} className="preview-thumb-wrapper">
                      <img src={imgSrc} alt={`Preview ${idx + 1}`} className="preview-thumb" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="remove-thumb-btn">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="add-btn" disabled={loading}>
                {editingId !== null ? <Edit3 size={18} /> : <Plus size={18} />}
                <span>
                  {loading 
                    ? (isAr ? "جاري الحفظ بالسحابة..." : "Saving...") 
                    : (editingId !== null ? (isAr ? "حفظ التعديلات" : "Save Changes") : (isAr ? "إضافة المنتج" : "Add Product"))}
                </span>
              </button>
            </form>

            <div className="admin-products-list">
              <h3>{isAr ? "قائمة المنتجات المحفوظة" : "Saved Products List"}</h3>
              <div className="admin-prod-grid">
                {products.map((prod) => (
                  <div key={prod.id} className="admin-prod-card">
                    <div className="prod-info-left">
                      <img src={prod.image} alt={typeof prod.name === 'object' ? prod.name.ar : prod.name} />
                      <div className="prod-text-meta">
                        <h4>{typeof prod.name === 'object' ? (prod.name[lang] || prod.name.en) : prod.name}</h4>
                        <div className="prod-sub-meta">
                          <span className="prod-price">
                            {prod.discount_price ? (
                              <>
                                <span className="old-price">{prod.price} DZD</span>
                               <span>{prod.discount_price} DZD</span>
                              </>
                            ) : (
                              <span>{prod.price} DZD</span>
                            )}
                          </span>
                          <span className="prod-stock-badge">
                            {isAr ? `المخزون: ${prod.stock}` : `Stock: ${prod.stock}`}
                          </span>
                          {prod.sizes && (
                            <span className="prod-stock-badge" style={{background: 'rgba(225, 29, 72, 0.15)', color: '#E11D48'}}>
                              <Ruler size={12} style={{display: 'inline', marginInlineEnd: '3px'}} />
                              {prod.sizes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="prod-actions">
                      <button className="edit-prod-btn" onClick={() => handleStartEdit(prod)}>
                        <Edit3 size="16" />
                      </button>
                      <button className="delete-prod-btn" onClick={() => handleDeleteProduct(prod.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bags' && (
          <BagsAdmin
            lang={lang}
            supabaseClient={supabaseClient}
            showSuccess={showSuccess}
            setConfirmModal={setConfirmModal}
          />
        )}
      </div>
    </div>
  );
}