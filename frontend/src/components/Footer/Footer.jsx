import React from 'react';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';

// تعريف أيقونة Instagram بلون أبيض نقي متناسق
const Instagram = ({ size = 18, color = '#ffffff' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// تعريف أيقونة Telegram بلون أبيض نقي متناسق
const Telegram = ({ size = 18, color = '#ffffff' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

// تعريف أيقونة TikTok بلون أبيض نقي متناسق
const TikTok = ({ size = 18, color = '#ffffff' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

export default function Footer({ lang, setCurrentPage }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAr = lang === 'ar';

  return (
    <footer style={{ 
      background: '#000000', 
      color: '#ffffff', 
      padding: '5rem 2rem 2.5rem', 
      borderTop: '1px solid rgba(255, 255, 255, 0.15)', 
      position: 'relative', 
      overflow: 'hidden',
      direction: 'ltr', 
      textAlign: 'left'   
    }}>
      
      {/* تأثير ضوئي خلفي هادئ ومتناسق مع الثيم الأسود */}
      <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '350px', height: '100px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '3.5rem', position: 'relative', zIndex: '1' }}>
        
        {/* العمود الأول: نبذة عن المتجر والشعار */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{display: 'flex',transform: 'translateX(35%)', color: '#ffffff', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 }}>
            Yancap<span style={{ color: '#ffffff' }}>.DZ</span>
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#cccccc', margin: 0, direction: 'ltr', textAlign: 'left' }}>
            Votre première destination pour les meilleurs et les plus récents modèles de casquettes en Algérie avec une haute qualité et des prix compétitifs.
          </p>
        </div>

        {/* العمود الثاني: روابط سريعة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
            {isAr ? 'روابط سريعة' : 'Quick Links'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <a href="#products" onClick={() => setCurrentPage && setCurrentPage('home')} style={{ color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#cccccc'}>
                {isAr ? 'المنتجات اخرا' : 'Products'}
              </a>
            </li>
            <li>
              <a href="#new" onClick={() => setCurrentPage && setCurrentPage('home')} style={{ color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#cccccc'}>
                {isAr ? 'الجديد' : 'New Arrivals'}
              </a>
            </li>
            <li>
              <a href="#sale" onClick={() => setCurrentPage && setCurrentPage('home')} style={{ color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#cccccc'}>
                {isAr ? 'التخفيضات' : 'Sale'}
              </a>
            </li>
            <li>
              <a href="#popular" onClick={() => setCurrentPage && setCurrentPage('home')} style={{ color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#cccccc'}>
                {isAr ? 'الاكثر طلبا' : 'Best Sellers'}
              </a>
            </li>
          </ul>
        </div>

        {/* العمود الثالث: تواصل معنا */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Phone */}
            <a 
              href="tel:0542658907" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
            >
              <Phone size={18} color="#ffffff" />
              <span>0542658907</span>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/yancap.dz/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
            >
              <Instagram size={18} color="#ffffff" />
              <span>@Yancap.DZ</span>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@yancap.dz?_r=1&_t=ZS-99TW1ZnQDui" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
            >
              <TikTok size={18} color="#ffffff" />
              <span>TikTok</span>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/+Nt-fqSoS3HwyNjBk" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
            >
              <Telegram size={18} color="#ffffff" />
              <span>Telegram</span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/message/M5Z2CX5BTWMIE1" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#cccccc', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', width: 'fit-content' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#cccccc'}
            >
              <MessageCircle size={18} color="#ffffff" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* الشريط السفلي الفاصل (مع الحقوق وروابط الخصوصية) */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: '1' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.85rem', color: '#aaaaaa', margin: 0 }}>
            © {new Date().getFullYear()} Yancap.DZ. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          
          {/* روابط سياسة الخصوصية ومركز الخصوصية بجانب الحقوق */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <a 
              href="#privacy" 
              onClick={(e) => { e.preventDefault(); if (setCurrentPage) setCurrentPage('privacy'); }} 
              style={{ color: '#aaaaaa', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} 
              onMouseEnter={(e) => e.target.style.color = '#ffffff'} 
              onMouseLeave={(e) => e.target.style.color = '#aaaaaa'}
            >
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </a>
            <a 
              href="#centre" 
              onClick={(e) => { e.preventDefault(); if (setCurrentPage) setCurrentPage('centre'); }} 
              style={{ color: '#aaaaaa', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} 
              onMouseEnter={(e) => e.target.style.color = '#ffffff'} 
              onMouseLeave={(e) => e.target.style.color = '#aaaaaa'}
            >
              {isAr ? 'مركز الخصوصية' : 'Privacy Centre'}
            </a>
          </div>
        </div>

        {/* زر الصعود للأعلى */}
        <button 
          onClick={scrollToTop}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        >
          <span>{isAr ? 'العودة للأعلى' : 'Back to top'}</span>
          <ArrowUp size={14} />
        </button>
      </div>

    </footer>
  );
}