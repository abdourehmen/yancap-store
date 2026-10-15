import React, { useState, useRef, useEffect } from 'react';
import './ProductDetails.css';
import { ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SizeGuideModal from '../../components/SizeGuideModal/SizeGuideModal';

export default function ProductDetails({ product, lang, onClose, onAddToCart }) {
  const isAr = lang === 'ar';

  // 🚀 مرجع (Ref) لكرت المقاسات أو زر الإضافة للتمكن من التمرير إليه تلقائياً
  const sizeSectionRef = useRef(null);

  // معالجة آمنة لاستخراج النصوص والتعامل مع الكائنات أو الـ JSON Strings
  const getLocalizedText = (field) => {
    if (!field) return '';
    
    let parsedField = field;
    
    // إذا كان الحقل مخزناً كنص JSON
    if (typeof field === 'string') {
      try {
        parsedField = JSON.parse(field);
      } catch (e) {
        return field; // إذا كان نصاً عادياً وليس JSON
      }
    }
    
    // إذا أصبح كائناً يحتوي على اللغات
    if (typeof parsedField === 'object' && parsedField !== null) {
      return parsedField[lang] || parsedField.ar || parsedField.en || Object.values(parsedField)[0] || '';
    }
    
    return String(field);
  };

  // تحويل أي قيمة (مصفوفة أو نص JSON) إلى مصفوفة
  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch (e) {
        return [value];
      }
    }
    return [];
  };

  // 👜 الحقائب: ألوان الحقيبة + صورها العامة (حتى 6)
  const isBag = Boolean(product.isBag);
  const colorsList = isBag && Array.isArray(product.colors) ? product.colors : [];

  // شرائح معرض الحقيبة: صورة كل لون أولاً ثم الصور العامة
  const buildBagSlides = () => {
    const slides = [];
    colorsList.forEach((c, i) => {
      if (c.image) slides.push({ src: c.image, colorIndex: i });
    });
    toArray(product.images).forEach((src) => {
      if (src && !slides.some((s) => s.src === src)) slides.push({ src, colorIndex: null });
    });
    if (slides.length === 0 && product.image) {
      slides.push({ src: product.image, colorIndex: null });
    }
    return slides;
  };

  const bagSlides = isBag ? buildBagSlides() : [];

  // معالجة آمنة 100% لاستخراج الصور وتجنب خطأ .map is not a function
  const getImagesList = () => {
    if (isBag && bagSlides.length > 0) {
      return bagSlides.map((s) => s.src);
    }
    if (!product.images) {
      return [product.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'];
    }
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return [product.images];
      }
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.image || 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'];
  };

  const imagesList = getImagesList();

  // اللون الذي كان مختاراً في بطاقة الحقيبة
  const initialColorIndex = (() => {
    const i = Number(product.selectedColorIndex);
    return colorsList.length > 0 && Number.isInteger(i) && i >= 0 && i < colorsList.length ? i : 0;
  })();

  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);
  const [activeImageIndex, setActiveImageIndex] = useState(() => {
    if (isBag && bagSlides.length > 0) {
      const idx = bagSlides.findIndex((s) => s.colorIndex === initialColorIndex);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  
  // حالة حفظ المقاس المختار عبر الأزرار
  const [selectedSize, setSelectedSize] = useState('');
  // حالة لتتبع ما إذا حاول المستخدم الإضافة بدون إدخال المقاس لإظهار التحذير
  const [sizeError, setSizeError] = useState(false);

  const selectedColor = colorsList.length > 0 ? colorsList[selectedColorIndex] : null;
  const selectedColorName = selectedColor ? getLocalizedText(selectedColor.name) : '';

  // الانتقال إلى صورة معينة (وإن كانت صورة لون نختار هذا اللون)
  const goToSlide = (idx) => {
    setActiveImageIndex(idx);
    if (isBag && bagSlides[idx] && bagSlides[idx].colorIndex !== null) {
      setSelectedColorIndex(bagSlides[idx].colorIndex);
    }
  };

  // اختيار لون من الأزرار: ننتقل إلى صورته إن وُجدت
  const handleSelectColor = (i) => {
    setSelectedColorIndex(i);
    const slideIdx = bagSlides.findIndex((s) => s.colorIndex === i);
    if (slideIdx >= 0) setActiveImageIndex(slideIdx);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    goToSlide(activeImageIndex === 0 ? imagesList.length - 1 : activeImageIndex - 1);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    goToSlide(activeImageIndex === imagesList.length - 1 ? 0 : activeImageIndex + 1);
  };

  useEffect(() => {
    // للحقائب نوقف التبديل التلقائي حتى لا يتغير اللون المختار وحده
    if (isBag || imagesList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [imagesList.length, isPaused, isBag]);

  // استخدام دالة الترجمة واستخراج النصوص بسلاسة
  const productName = getLocalizedText(product.name);
  const productDescription = getLocalizedText(product.description) || (isAr ? "لا يوجد وصف متاح لهذا المنتج حالياً." : "No description available for this product yet.");
  const productCategory = getLocalizedText(product.category);

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : null;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;

  const productStock = product.stock !== undefined ? product.stock : 0;
  const isOutOfStock = productStock <= 0;

  // دالة التعامل مع الإضافة للسلة مع شرط إلزاميّة المقاس
  const handleAddToCartClick = () => {
    if (isOutOfStock) return;

    // 👜 حقيبة: كل لون سطر مستقل في السلة (رقم فريد لكل لون)
    if (isBag && selectedColor) {
      const { colors: _omitColors, ...productWithoutColors } = product;
      const cartImage = selectedColor.image || imagesList[activeImageIndex] || product.image;
      onAddToCart({
        ...productWithoutColors,
        id: `${product.id}-c${selectedColorIndex}`,
        name: productName,
        description: productDescription,
        selectedColor: selectedColorName,
        // نخزّن اللون في selectedSize أيضاً ليظهر تلقائياً في السلة وفي لوحة الطلبات
        selectedSize: selectedColorName,
        image: cartImage,
        images: [cartImage],
        price: finalPrice,
        discountPrice: null,
        activePrice: finalPrice
      });
      onClose();
      return;
    }

    // التحقق هل المنتج يحتوي على مقاسات ولم يتم اختيار أي مقاس
    if (product.sizes && product.sizes.trim() !== '' && !selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    onAddToCart({
      ...product,
      name: productName, 
      description: productDescription,
      selectedSize: selectedSize ? selectedSize.trim() : 'Standard', 
      price: finalPrice,
      discountPrice: hasDiscount ? product.discountPrice : null,
      activePrice: finalPrice
    });
    onClose();
  };

  return (
    <div className="product-details-overlay" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="product-details-modal">
        
        <button className="close-modal-btn" onClick={onClose} title={isAr ? "إغلاق" : "Close"}>
          <X size={22} />
        </button>

        <div className="product-details-grid">
          
          <div 
            className="product-gallery-section"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="main-preview-image-container" style={{ position: 'relative' }}>
              {hasDiscount && (
                <span className="details-badge">-{discountPercent}%</span>
              )}
              <img 
                src={imagesList[activeImageIndex]} 
                alt={productName} 
                className="main-preview-image" 
              />

              {imagesList.length > 1 && (
                <>
                  <button 
                    onClick={isAr ? handleNextImage : handlePrevImage} 
                    className="gallery-arrow-btn prev-arrow"
                    title={isAr ? "الصورة السابقة" : "Previous Image"}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={isAr ? handlePrevImage : handleNextImage} 
                    className="gallery-arrow-btn next-arrow"
                    title={isAr ? "الصورة التالية" : "Next Image"}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="thumbnails-row">
                {imagesList.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            {productCategory && (
              <span className="details-category">{productCategory}</span>
            )}
            
            <h2 className="details-title">{productName}</h2>

            <div style={{ fontSize: '0.9rem', margin: '0.5rem 0 1rem 0', color: '#ffffff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: !isOutOfStock ? '#cccccc' : '#ff6b6b', display: 'inline-block' }}></span>
              {!isOutOfStock 
                ? (isAr ? `متبقي في المخزون: ${productStock} قطع متوفرة` : `In Stock: ${productStock} items left`)
                : (isAr ? 'نفدت الكمية من المخزون' : 'Out of stock')
              }
            </div>

            <div className="details-price-box">
              {hasDiscount ? (
                <>
                  <span className="details-current-price">
                    {product.discountPrice.toLocaleString()} <small>د.ج</small>
                  </span>
                  <span className="details-old-price">
                    {product.price.toLocaleString()} د.ج
                  </span>
                </>
              ) : (
                <span className="details-current-price">
                  {product.price.toLocaleString()} <small>د.ج</small>
                </span>
              )}
            </div>

            {/* 👜 اختيار لون الحقيبة (يظهر للحقائب فقط) */}
            {colorsList.length > 0 && (
              <div className="product-colors-container" style={{ margin: '1rem 0' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.95rem', color: '#fff', marginBottom: '8px' }}>
                  {isAr ? "اللون:" : "Color:"}{' '}
                  <strong style={{ color: '#E11D48' }}>{selectedColorName}</strong>
                </label>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {colorsList.map((c, i) => {
                    const isActive = i === selectedColorIndex;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleSelectColor(i)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: c.image ? '6px 12px 6px 6px' : '8px 16px',
                          border: isActive ? '2px solid #E11D48' : '1px solid rgba(255, 255, 255, 0.2)',
                          background: isActive ? '#FFF1F2' : '#222',
                          color: isActive ? '#E11D48' : '#fff',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {c.image && (
                          <img
                            src={c.image}
                            alt=""
                            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        )}
                        <span>{getLocalizedText(c.name)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🚀 قسم أزرار المقاسات الاحترافية بدلاً من خانة الإدخال القديمة */}
            {product.sizes && product.sizes.trim() !== '' && (
              <div className="product-sizes-container" style={{ margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.95rem', color: '#fff' }}>
                    {isAr ? "اختر المقاس المطلوب *" : "Select Required Size "}
                  </label>
                  <SizeGuideModal lang={lang} />
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.sizes.split(',').map((size, index) => {
                    const trimmedSize = size.trim();
                    const isSelected = selectedSize === trimmedSize;
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => {
                          setSelectedSize(trimmedSize);
                          setSizeError(false);
                        }}
                        style={{
                          padding: '8px 16px',
                          border: isSelected ? '2px solid #E11D48' : '1px solid rgba(255, 255, 255, 0.2)',
                          background: isSelected ? '#FFF1F2' : '#222',
                          color: isSelected ? '#E11D48' : '#fff',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {trimmedSize}
                      </button>
                    );
                  })}
                </div>

                {/* تحذير أحمر يظهر إذا حاول الزبون الإضافة دون تحديد المقاس */}
                {sizeError && (
                  <span style={{ 
                    color: '#ff6b6b', 
                    fontSize: '0.75rem', 
                    marginTop: '6px', 
                    display: 'block',
                    textAlign: isAr ? 'right' : 'left'
                  }}>
                    {isAr ? "⚠️ يرجى اختيار المقاس المطلّوب أولاً" : "⚠️ Please select the required size first"}
                  </span>
                )}
              </div>
            )}

            <div className="details-desc-box">
              <h3>{isAr ? "وصف المنتج:" : "Product Description:"}</h3>
              <p>{productDescription}</p>
            </div>

            <div className="details-actions" ref={sizeSectionRef}>
              <button 
                className="add-to-cart-main-btn"
                disabled={isOutOfStock}
                style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                onClick={handleAddToCartClick}
              >
                <ShoppingBag size={20} />
                <span>
                  {isOutOfStock 
                    ? (isAr ? "المنتج نفد من المخزون" : "Out of Stock") 
                    : (isAr ? "شراء" : "buying")
                  }
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
