import React, { useState } from 'react';
import '../ProductCard/ProductCard.css';
import { Eye, ShoppingBag } from 'lucide-react';
import './BagCart.css';
export default function BagCard({ bag, lang, onViewDetails }) {
  const isAr = lang === 'ar';
  const colors = Array.isArray(bag.colors) ? bag.colors : [];
  const gallery = Array.isArray(bag.images) ? bag.images : [];
  const [activeColor, setActiveColor] = useState(0);

  // يقرأ النص سواء كان كائنًا {ar, en} أو نصًا عاديًا
  const pick = (field) => {
    if (!field) return '';
    if (typeof field === 'object') return field[lang] || field.ar || field.en || '';
    return field;
  };

  const name = pick(bag.name);
  const description = pick(bag.description);
  const currentImage =
    colors[activeColor]?.image ||
    bag.image ||
    gallery[0] ||
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500';

  const normalPrice = Number(bag.price || 0);
  const salePrice = Number(bag.discount_price || 0);
  const hasDiscount = Boolean(bag.is_sale && salePrice > 0 && salePrice < normalPrice);
  const finalPrice = hasDiscount ? salePrice : normalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((normalPrice - salePrice) / normalPrice) * 100)
    : null;
  const stock = bag.stock !== undefined ? bag.stock : 0;

  // الكائن الذي يُرسل إلى صفحة التفاصيل ثم السلة
  // ملاحظة: نترك images كما هي (صور الحقيبة العامة) ولا نستبدلها
  const bagToSend = {
    ...bag,
    id: `bag-${bag.id}`, // رقم نصي حتى لا يتعارض مع رقم قبعة
    bagId: bag.id,       // الرقم الحقيقي في جدول bags (لخصم المخزون)
    isBag: true,
    price: finalPrice,
    discount_price: hasDiscount ? salePrice : null,
    activePrice: finalPrice,
    sizes: '',
    selectedColorIndex: activeColor
  };

  return (
    <div className="streetflex-product-card">
      <div
        className="product-image-container"
        onClick={() => onViewDetails && onViewDetails(bagToSend)}
        style={{ cursor: 'pointer' }}
      >
        {hasDiscount && <div style={{          background: 'linear-gradient(135deg, #E11D48 0%, #9f1239 100%)', }} className="product-badge">-{discountPercent}%</div>}
        <img src={currentImage} alt={name} className="product-image" loading="lazy" />
        <div className="product-overlay-actions">
          <button
            className="overlay-btn"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(bagToSend);
            }}
            title={isAr ? 'عرض التفاصيل' : 'View Details'}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3
          className="product-title"
          onClick={() => onViewDetails && onViewDetails(bagToSend)}
          style={{ cursor: 'pointer' }}
        >
          {name}
        </h3>

        {colors.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#666666', fontWeight: 600 }}>
              {isAr ? 'الألوان المتوفرة:' : 'Available colors:'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveColor(i)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #000000',
                    background: i === activeColor ? '#000000' : '#ffffff',
                    color: i === activeColor ? '#ffffff' : '#000000'
                  }}
                >
                  {pick(c.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`product-stock-indicator ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {stock > 0
            ? isAr
              ? `متبقي في المخزون: ${stock} قطع`
              : `In Stock: ${stock} left`
            : isAr
              ? 'نفدت الكمية'
              : 'Out of stock'}
        </div>

        {description && <p className="product-description">{description}</p>}

        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="product-current-price">
              {finalPrice.toLocaleString()} <small>د.ج</small>
            </span>
            {hasDiscount && (
              <span className="product-old-price">{normalPrice.toLocaleString()} د.ج</span>
            )}
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(bagToSend);
            }}
          >
            <ShoppingBag  size={16} />
            <span>{isAr ? 'شراء' : 'Buy'}</span>
            
          </button>
        </div>
      </div>
    </div>
  );
}
