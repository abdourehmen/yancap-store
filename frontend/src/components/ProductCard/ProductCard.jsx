import React, { useState, useEffect } from 'react';
import './ProductCard.css';
import { Eye, ChevronLeft, ChevronRight, Flame, Clock, Tag, Zap } from 'lucide-react';

export default function ProductCard({ product, lang, onViewDetails, isPopular, isNew, isSale }) {
  const isAr = lang === 'ar';

  const parseJSONField = (field) => {
    if (!field) return '';
    if (typeof field === 'object') return field;
    try {
      const parsed = JSON.parse(field);
      return typeof parsed === 'object' ? parsed : field;
    } catch (e) {
      return field;
    }
  };

  const getImagesList = () => {
    let imgs = product.images;
    if (typeof imgs === 'string') {
      try { imgs = JSON.parse(imgs); } catch (e) {}
    }
    if (Array.isArray(imgs) && imgs.length > 0) {
      return imgs;
    }
    return [product.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'];
  };

  const imagesList = getImagesList();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (imagesList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [imagesList.length, isPaused]);

  // منطق التخفيض الآمن
  const salePrice = Number(product.discount_price || 0);
  const normalPrice = Number(product.price || 0);
  const hasDiscount = Boolean(isSale && salePrice > 0 && salePrice < normalPrice);
  
  const discountPercent = hasDiscount 
    ? Math.round(((normalPrice - salePrice) / normalPrice) * 100) 
    : null;
    
  const finalPrice = hasDiscount ? salePrice : normalPrice;

  const productToSend = {
    ...product,
    price: finalPrice,
    discount_price: hasDiscount ? salePrice : null,
    activePrice: finalPrice
  };

  const nameObj = parseJSONField(product.name);
  let productName = '';
  if (typeof nameObj === 'object' && nameObj !== null) {
    productName = nameObj[lang] || nameObj.ar || nameObj.en || '';
  } else {
    productName = nameObj;
    if (!isAr && productName === 'قبعة') {
      productName = 'Cap';
    }
  }

  const categoryObj = parseJSONField(product.category);
  const productCategory = typeof categoryObj === 'object' && categoryObj !== null 
    ? (categoryObj[lang] || categoryObj.ar || categoryObj.en || '') 
    : categoryObj;

  const descObj = parseJSONField(product.description);
  let productDescription = '';
  if (typeof descObj === 'object' && descObj !== null) {
    productDescription = descObj[lang] || descObj.ar || descObj.en || '';
  } else {
    if (!isAr) {
      productDescription = "Official FIFTY cap. Look sharp with luxury streetwear featuring the New Era 50 cap for Los Angeles Dodgers. This premium cap features a classic design.";
    } else {
      productDescription = descObj;
    }
  }
  
  const productStock = product.stock !== undefined ? product.stock : 0;

  return (
    <div 
      className="streetflex-product-card"
      style={{
        animation: 'fadeInUpCard 0.6s ease-out forwards',
        position: 'relative'
      }}
    >
      <style>{`
        @keyframes fadeInUpCard {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div 
        className="product-image-container" 
        onClick={() => onViewDetails && onViewDetails(productToSend)}
        style={{ cursor: 'pointer', position: 'relative' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {hasDiscount && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: isAr ? 'unset' : '12px',
            left: isAr ? '12px' : 'unset',
            background: 'linear-gradient(135deg, #E11D48 0%, #9f1239 100%)',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(225, 29, 72, 0.4)',
            zIndex: 3,
            letterSpacing: '0.3px'
          }}>
            <Tag size={14} />
            <span>-{discountPercent}%</span>
          </div>
        )}

        {isPopular && (
          <div style={{
            position: 'absolute',
            top: hasDiscount ? '48px' : '12px',
            right: isAr ? 'unset' : '12px',
            left: isAr ? '12px' : 'unset',
            background: 'linear-gradient(135deg, #E11D48 0%, #9f1239 100%)',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(225, 29, 72, 0.4)',
            zIndex: 3,
            letterSpacing: '0.3px'
          }}>
            <Flame size={14} />
            <span>{isAr ? "الأكثر طلباً" : "Most Popular"}</span>
          </div>
        )}
        
        {isNew && (
          <div style={{
            position: 'absolute',
            top: (hasDiscount || isPopular) ? '84px' : '12px',
            right: isAr ? 'unset' : '12px',
            left: isAr ? '12px' : 'unset',
            background: 'linear-gradient(135deg, #E11D48 0%, #9f1239 100%)',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(225, 29, 72, 0.4)',
            zIndex: 3,
            letterSpacing: '0.3px'
          }}>
            <Clock size={14} />
            <span>{isAr ? "جديد" : "New"}</span>
          </div>
        )}

        <img 
          src={imagesList[activeImageIndex]} 
          alt={productName} 
          className="product-image"
          loading="lazy"
          decoding="async"
        />
        {imagesList.length > 1 && (
          <>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isAr ? handleNextImage(e) : handlePrevImage(e);
              }} 
              className="card-gallery-arrow card-prev-arrow"
              title={isAr ? "الصورة السابقة" : "Previous Image"}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isAr ? handlePrevImage(e) : handleNextImage(e);
              }} 
              className="card-gallery-arrow card-next-arrow"
              title={isAr ? "الصورة التالية" : "Next Image"}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="product-overlay-actions">
          <button 
            className="overlay-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(productToSend);
            }}
            title={isAr ? "عرض التفاصيل" : "View Details"}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="product-info">
        {productCategory && (
          <span className="product-category">
            {productCategory}
          </span>
        )}
        
        <h3 
          className="product-title" 
          onClick={() => onViewDetails && onViewDetails(productToSend)}
          style={{ cursor: 'pointer' }}
        >
          {productName}
        </h3>

        <div className={`product-stock-indicator ${productStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {productStock > 0 
            ? (isAr ? `متبقي في المخزون: ${productStock} قطع` : `In Stock: ${productStock} left`)
            : (isAr ? 'نفدت الكمية' : 'Out of stock')
          }
        </div>

        {productDescription && (
          <p className="product-description">
            {productDescription}
          </p>
        )}

        <div className="product-footer">
          <div className="product-price-wrapper">
            {hasDiscount ? (
              <>
                <span className="product-current-price">
                  {salePrice.toLocaleString()} <small>د.ج</small>
                </span>
                <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: '#cccccc' }}>
                  {normalPrice.toLocaleString()} د.ج
                </span>
              </>
            ) : (
              <span className="product-current-price">
                {normalPrice.toLocaleString()} <small>د.ج</small>
              </span>
            )}
          </div>

          <button 
            className="buy-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(productToSend);
            }}
            title={isAr ? "شراء" : "Buy"}
          >
            <Zap size={15} />
            <span>{isAr ? "شراء" : "Buy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}