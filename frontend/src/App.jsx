import React, { useState, useEffect } from 'react';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';
import CheckoutModal from './components/CheckoutModal/CheckoutModal'; 
import Home from './pages/Home/Home';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import PrivacyCentre from './pages/PrivacyCentre/PrivacyCentre';
import { ShieldCheck, Lock, User } from 'lucide-react';
import CustomerReviews from './components/CustomerReviews/CustomerReviews'; 
import Footer from './components/Footer/Footer'; 
import WelcomePage from './components/WelcomePage/WelcomePage';
import { supabase } from './supabaseClient';
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton"; // 🟢 إضافة مكون زر الواتساب العائم


function MainLayout() {
  const [bags, setBags] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lang, setLang] = useState('ar');
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 🟢 حالة لتحديد الصفحة الحالية (home, privacy, centre)

  // تفعيل مكتبة AOS للأنيميشن عند تحميل المكون
  useEffect(() => {
    ({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);
  
  const [isAdminPath, setIsAdminPath] = useState(window.location.pathname === '/admin');

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminPath(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdminPath(path === '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleGoHome = (section = 'hero') => {
    setCurrentPage('home'); // العودة للرئيسية عند الضغط
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const topEl = document.getElementById('top') || document.getElementById('hero');
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleScrollToReviews = () => {
    setCurrentPage('home');
    const reviewsEl = document.getElementById('reviews');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const isAr = lang === 'ar';

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (adminUser === 'admin' && adminPass === correctPassword) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
    navigateTo('/');
  };
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ✅ جلب حالات السلة ومودال الدفع من الـ Context
  const { cartItems, addToCart, isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen, totalPrice } = useCart();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchBags();
  }, []);

  const fetchBags = async () => {
    const { data, error } = await supabase
      .from('bags')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching bags:', error);
    } else if (data) {
      setBags(data);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
      
    if (error) {
      console.error('Error fetching products:', error);
    } else if (data && data.length > 0) {
      setProducts(data);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching orders:', error);
    } else if (data) {
      setOrders(data);
    }
  };

  const contentAnimStyle = {
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
    transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  if (showWelcome && !isAdminPath) {
    return (
      <WelcomePage onEnter={() => setShowWelcome(false)} />
    );
  }

  if (isAdminPath) {
    return (
      <div className="admin-container ltr" dir="ltr" style={contentAnimStyle}>
        {isAdminLoggedIn ? (
          <AdminDashboard 
            products={products} 
            bags={bags}
            setProducts={setProducts} 
            orders={orders} 
            setOrders={setOrders} 
            lang={lang}
            onLogout={handleAdminLogout}
            onBackToStore={() => navigateTo('/')}
            supabaseClient={supabase}
          />
        ) : (
          <div className="admin-login-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0b0f17', padding: '1rem' }}>
            <form onSubmit={handleAdminLogin} style={{ backgroundColor: '#121824', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(225, 29, 72, 0.15)', color: '#E11D48', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <ShieldCheck size={32} />
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  {isAr ? 'لوحة تحكم المشرف' : 'Admin Dashboard'}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {isAr ? 'أدخل بيانات الدخول للمتابعة' : 'Enter credentials to continue'}
                </p>
              </div>

              {loginError && (
                <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid #E11D48', color: '#ff85a1', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                  {loginError}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {isAr ? 'اسم المستخدم' : 'Username'}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                  <input 
                    type="text" 
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#0b0f17', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                  <input 
                    type="password" 
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#0b0f17', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', color: '#ffffff', outline: 'none' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', backgroundColor: '#E11D48', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                {isAr ? 'تسجيل الدخول' : 'Login'}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="top" className="app-container ltr" dir="ltr">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        cartCount={cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        setActiveSection={handleGoHome} 
      />
      
      <div style={contentAnimStyle}>
        {currentPage === 'home' && (
          <>
            <Home 
              lang={lang} 
              products={products}
              bags={bags} 
              onAddToCart={addToCart} 
              onViewDetails={(productOrId) => {
                const prod = typeof productOrId === 'object' 
                  ? productOrId 
                  : products.find(p => p.id === productOrId);
                setSelectedProduct(prod);
                
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }} 
              onGoToReviews={handleScrollToReviews}
            />

            {selectedProduct && (
              <ProductDetails 
                product={selectedProduct}
                lang={lang}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(productData) => {
                  addToCart(productData);
                  setIsCartOpen(false);  
                  setIsCheckoutOpen(true); 
                }}
              />
            )}
            <section id="reviews">
              <CustomerReviews lang={lang} />
            </section>
          </>
        )}

        {/* 🟢 عرض صفحة سياسة الخصوصية */}
        {currentPage === 'privacy' && (
          <PrivacyPolicy lang={lang} onBack={() => setCurrentPage('home')} />
        )}

        {/* 🟢 عرض صفحة مركز الخصوصية */}
        {currentPage === 'centre' && (
          <PrivacyCentre lang={lang} onBack={() => setCurrentPage('home')} />
        )}

        <Footer lang={lang} setCurrentPage={setCurrentPage} />
      </div>

      {/* سلة التسوق */}
      <CartDrawer lang={lang} />

      {/* نافذة إتمام الطلب في المستوى الأب تماماً لتكون فوق كل شيء */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
          lang={lang}
        />
      )}

      {/* 🟢 زر الواتساب العائم */}
      <WhatsAppButton 
        phoneNumber="+2130542658907" 
        lang={lang} 
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}