import React from 'react';
import './Home.css';
import HeroSection from '../../components/HeroSection/HeroSection';
import ProductCard from '../../components/ProductCard/ProductCard';
import BagCard from '../../components/BagCard/BagCard';
import { Sparkles, Flame, Clock, Truck, ShieldCheck, Headphones, Tag ,ShoppingBag } from 'lucide-react';

export default function Home({ lang, products, bags = [], onAddToCart, onViewDetails, onGoToReviews }) {
  const isAr = lang === 'ar';

  const allProducts = products || [];

  const popularProducts = allProducts.filter(p => p.is_featured === true || p.popular === true);
  const displayPopular = popularProducts; 

  const newProducts = [...allProducts]
    .sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id))
    .slice(0, 4);

  // التصفية بناءً على خاصية is_sale (مع دعم الطرق الأخرى كاحتياط)
  const saleProducts = allProducts.filter(p => p.is_sale === true || p.sale_price || p.discount || (p.old_price && p.old_price > p.price));

  return (
    <div id="hero" className="home-page">
      <HeroSection lang={lang} onGoToReviews={onGoToReviews} />
      
      {/* --- الشريط المتحرك المتلصق ويدعم اللغتين --- */}
      <div className="space-marquee-container">
        <div className="space-marquee-track">
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><Truck size={18} /></span> 
            {isAr ? "توصيل سريع لـ 58 ولاية" : "Fast Delivery 58 Wilayas"}
          </div>
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><ShieldCheck size={18} /></span> 
            {isAr ? "ضمان الاستبدال لمدة 14 يوماً" : "14 Days Guarantee"}
          </div>
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><Headphones size={18} /></span> 
            {isAr ? "خدمة العملاء 24/7" : "24/7 Support"}
          </div>
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><Truck size={18} /></span> 
            {isAr ? "توصيل سريع لـ 58 ولاية" : "Fast Delivery 58 Wilayas"}
          </div>
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><ShieldCheck size={18} /></span> 
            {isAr ? "ضمان الاستبدال لمدة 14 يوماً" : "14 Days Guarantee"}
          </div>
          <div className="space-marquee-item">
            <span className="marquee-icon-box"><Headphones size={18} /></span> 
            {isAr ? "خدمة العملاء 24/7" : "24/7 Support"}
          </div>
        </div>
      </div>

      {/* --- القسم الأول: الأكثر طلباً --- */}
      <section id="popular" className="products-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="products-container">
          <div className="section-header">
            <div className="section-badge">
              <Flame size={16} />
              <span>{isAr ? "الأكثر طلباً" : "Most Popular"}</span>
            </div>
            <h2 className="section-title">
              {isAr ? "المنتجات الأكثر طلباً" : "Most Popular Products"}
            </h2>
            <p className="section-subtitle">
              {isAr 
                ? "المنتجات التي نالت إعجاب ورضا زبائننا الأكثر مبيعاً" 
                : "Customer favorites and top selling items right now."
              }
            </p>
          </div>

          {allProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "جاري تحميل المنتجات..." : "Loading products..."}
            </div>
          ) : displayPopular.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "لا توجد منتجات في قسم الأكثر طلباً حالياً" : "No popular products at the moment"}
            </div>
          ) : (
            <div className="products-grid">
              {displayPopular.map((product) => (
                <ProductCard 
                  key={`pop-${product.id}`}
                  product={product}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isPopular={true} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- القسم الجديد: التخفيضات (يعتمد على is_sale: true) --- */}
      <section id="sale" className="products-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="products-container">
          <div className="section-header">
            <div className="section-badge" style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#E11D48' }}>
              <Tag size={16} />
              <span>{isAr ? "تخفيضات حصرية" : "Special Sale"}</span>
            </div>
            <h2 className="section-title">
              {isAr ? "العروض والتخفيضات" : "Sale & Discounts"}
            </h2>
            <p className="section-subtitle">
              {isAr 
                ? "استفد من أفضل الأسعار على تشكيلة مختارة من القبعات" 
                : "Grab our best deals on selected caps and drops."
              }
            </p>
          </div>

          {allProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "جاري تحميل المنتجات..." : "Loading products..."}
            </div>
          ) : saleProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "لا توجد تخفيضات حالياً، ترقبوا العروض القادمة!" : "No active sales at the moment"}
            </div>
          ) : (
            <div className="products-grid">
              {saleProducts.map((product) => (
                <ProductCard 
                  key={`sale-${product.id}`}
                  product={product}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isSale={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- القسم الثاني: المنتجات الجديدة --- */}
      <section id="new" className="products-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="products-container">
          <div className="section-header">
            <div className="section-badge">
              <Clock size={16} />
              <span>{isAr ? "وصول حديث" : "New Arrivals"}</span>
            </div>
            <h2 className="section-title">
              {isAr ? "المنتجات الجديدة" : "New Arrivals"}
            </h2>
            <p className="section-subtitle">
              {isAr 
                ? "اكتشف أحدث ما وصلنا من تشكيلات مميزة وحصرية" 
                : "Check out our latest added collections and drops."
              }
            </p>
          </div>

          {allProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "جاري تحميل المنتجات..." : "Loading products..."}
            </div>
          ) : (
            <div className="products-grid">
              {newProducts.map((product) => (
                <ProductCard 
                  key={`new-${product.id}`}
                  product={product}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  isNew={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {bags.length > 0 && (
        <section id="bags" className="products-section">
          <div className="products-container">
            <div className="section-header">
              <div className="section-badge">
                <ShoppingBag size={16} />
                <span>{isAr ? "حقائب" : "Bags"}</span>
              </div>
              <h2 className="section-title">
                {isAr ? "تشكيلة الحقائب" : "Our Bags Collection"}
              </h2>
              <p className="section-subtitle">
                {isAr
                  ? "اكتشف أحدث الحقائب المتوفرة بعدة ألوان في متجر Yancap.dz"
                  : "Explore our latest bags, available in several colors."}
              </p>
            </div>
            <div className="products-grid">
              {bags.map((bag) => (
                <BagCard
                  key={`bag-${bag.id}`}
                  bag={bag}
                  lang={lang}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- القسم الثالث: كافة المنتجات --- */}
      <section id="products" className="products-section">
        <div className="products-container">
          <div className="section-header">
            <div className="section-badge">
              <Sparkles size={16} />
              <span>{isAr ? "تشكيلة مميزة" : "Featured Collection"}</span>
            </div>
            <h2 className="section-title">
              {isAr ? "أحدث القبعات والإصدارات" : "Latest Caps & Drops"}
            </h2>
            <p className="section-subtitle">
              {isAr 
                ? "اكتشف أفضل التصاميم الحصرية المتوفرة حصرياً في متجر Yancap.dz" 
                : "Explore our premium selection of streetwear caps, available now across Algeria."
              }
            </p>
          </div>

          {allProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              {isAr ? "جاري تحميل المنتجات أو لا توجد منتجات مضافة حالياً..." : "Loading products or no products available..."}
            </div>
          ) : (
            <div className="products-grid">
              {allProducts.map((product) => (
                <ProductCard 
                  key={`all-${product.id}`}
                  product={product}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}