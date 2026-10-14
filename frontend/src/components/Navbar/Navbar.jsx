import React, { useState } from 'react';
import './Navbar.css';
import { ShoppingBag, Menu, X, Globe, ShieldAlert } from 'lucide-react';

export default function Navbar({ lang, setLang, cartCount, currentView, setCurrentView, activeSection, setActiveSection, onOpenCart, isAdminLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (currentView && currentView !== 'store' && typeof setCurrentView === 'function') {
      setCurrentView('store');
    }

    if (setActiveSection) {
      setActiveSection('hero');
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });

      const heroEl = document.getElementById('hero') || document.getElementById('top');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (currentView && currentView !== 'store' && typeof setCurrentView === 'function') {
      setCurrentView('store');
    }

    if (setActiveSection) {
      setActiveSection(sectionId);
    }

    setTimeout(() => {
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        const navbarHeight = 85;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 650, behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToReviews = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (currentView && currentView !== 'store' && typeof setCurrentView === 'function') {
      setCurrentView('store');
    }

    if (setActiveSection) {
      setActiveSection('reviews');
    }

    setTimeout(() => {
      const reviewsEl = document.getElementById('reviews');
      if (reviewsEl) {
        const navbarHeight = 85;
        const elementPosition = reviewsEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <header className="streetflex-navbar">
      <div className="navbar-inner">
        
        {/* الشعار يعيدنا دائماً للأعلى مع الاسم الجديد yancap.dz */}
        <a href="#top" className="brand-logo" onClick={handleHomeClick}>
          YAN<span className="brand-accent">CAP</span>
        </a>

        {/* روابط سطح المكتب الأساسية */}
        <nav className="desktop-links">
          <a 
            href="#hero" 
            className="nav-link"
            onClick={handleHomeClick}
          >
            {isAr ? "الرئيسية" : "Home"}
          </a>

          {/* رابط الجديد يوجه إلى القسم #new */}
          <a 
            href="#new" 
            className="nav-link"
            onClick={(e) => scrollToSection('new', e)}
          >
            {isAr ? "الجديد" : "New Arrivals"}
          </a>

          {/* رابط الأكثر طلباً يوجه إلى القسم #popular */}
          <a 
            href="#popular" 
            className="nav-link"
            onClick={(e) => scrollToSection('popular', e)}
          >
            {isAr ? "الأكثر طلباً" : "Best Sellers"}
          </a>

          {/* رابط التخفيضات المضاف حديثاً */}
          <a 
            href="#sale" 
            className="nav-link"
            onClick={(e) => scrollToSection('sale', e)}
            style={{ color: '#333333', fontWeight: 'bold' }}
          >
            {isAr ? "التخفيضات" : "Sale"}
          </a>
          
          <a 
            href="#products" 
            className="nav-link"
            onClick={(e) => scrollToSection('products', e)}
          >
            {isAr ? "المنتجات اخرا" : "Products"}
          </a>
        </nav>

        {/* الأزرار والإجراءات الجانبية */}
        <div className="navbar-actions">
          
          {isAdminLoggedIn || currentView === 'admin' ? (
            <button 
              className="lang-toggle-btn admin-toggle-btn" 
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              title={isAr ? "لوحة التحكم" : "Admin Dashboard"}
            >
              <ShieldAlert size={16} />
              <span>{currentView === 'store' ? (isAr ? 'التحكم' : 'Admin') : (isAr ? 'المتجر' : 'Store')}</span>
            </button>
          ) : null}

          {/* زر تبديل اللغة */}
          <button className="lang-toggle-btn" onClick={toggleLanguage} title="Change Language">
            <Globe size={16} />
            <span>{lang === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          {/* زر سلة التسوق */}
          <button className="cart-icon-btn desktop-cart-btn" onClick={onOpenCart} title={isAr ? "سلة التسوق" : "Cart"}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
          </button>

          {/* زر قائمة الجوال */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* القائمة المنسدلة للجوال */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <a 
            href="#hero" 
            className="mobile-nav-link"
            onClick={handleHomeClick}
          >
            {isAr ? "الرئيسية" : "Home"}
          </a>

          <a 
            href="#new" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection('new', e)}
          >
            {isAr ? "الجديد" : "New Arrivals"}
          </a>

          <a 
            href="#popular" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection('popular', e)}
          >
            {isAr ? "الأكثر طلباً" : "Best Sellers"}
          </a>

          {/* رابط التخفيضات لقائمة الجوال */}
          <a 
            href="#sale" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection('sale', e)}
            style={{ color: '#', fontWeight: 'bold' }}
          >
            {isAr ? "التخفيضات" : "Sale"}
          </a>
          
          <a 
            href="#products" 
            className="mobile-nav-link"
            onClick={(e) => scrollToSection('products', e)}
          >
            {isAr ? "المنتجات اخرا" : "Products"}
          </a>

          {/* زر سلة التسوق داخل قائمة الجوال مع عرض عدد المنتجات */}
          <button 
            className="mobile-nav-link mobile-cart-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              textAlign: isAr ? 'right' : 'left', 
              cursor: 'pointer', 
              width: '100%', 
              padding: '0.6rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#cbd5e1'
            }}
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenCart();
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} />
              {isAr ? "سلة التسوق" : "Shopping Cart"}
            </span>
            {cartCount > 0 && (
              <span style={{ 
                backgroundColor: '#E11D48', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold' 
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {(isAdminLoggedIn || currentView === 'admin') && (
            <button 
              className="mobile-nav-link"
              style={{ background: 'none', border: 'none', textAlign: isAr ? 'right' : 'left', cursor: 'pointer', width: '100%', padding: '0.6rem 0' }}
              onClick={() => {
                setCurrentView(currentView === 'store' ? 'admin' : 'store');
                setIsMobileMenuOpen(false);
              }}
            >
              {currentView === 'store' ? (isAr ? "لوحة التحكم" : "Admin Dashboard") : (isAr ? "عرض المتجر" : "View Store")}
            </button>
          )}
        </div>
      )}
    </header>
  );
}