import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import './SizeGuideModal.css';

export default function SizeGuideModal({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const isAr = lang === 'ar';

  return (
    <>
      {/* زر فتح دليل المقاسات */}
      <button 
        type="button" 
        className="size-guide-trigger-btn"
        onClick={() => setIsOpen(true)}
      >
        <Ruler size={16} />
        <span>{isAr ? "دليل المقاسات الرسمي وكيفية القياس" : "Official Size Guide & Measurement"}</span>
      </button>

      {/* النافذة المنبثقة (Modal) */}
      {isOpen && (
        <div className="size-modal-overlay" onClick={() => setIsOpen(false)} style={{ zIndex: 9999, paddingTop: '80px' }}>
          <div className="size-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            
            {/* زر الإغلاق */}
            <button className="size-modal-close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>

            <div className="size-modal-header">
              <p>{isAr ? "اتبع الصور التوضيحية أدناه لقياس محيط رأسك بدقة:" : "Follow the visual instructions below to accurately measure your head:"}</p>
            </div>

            <div className="size-modal-body">
              
              {/* قسم صور خطوات القياس (عرض أفقياً بجانب بعضها) */}
              <div className="guide-section">
                <h3>{isAr ? "1. خطوات قياس محيط الرأس" : "1. Head Measurement Steps"}</h3>
                <div className="steps-images-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
                  <img src="/a.jpg" alt="Step 1" style={{ width: '100%', height: 'auto', borderRadius: '6px', border: '1px solid #333', objectFit: 'cover' }} />
                  <img src="/b.jpg" alt="Step 2" style={{ width: '100%', height: 'auto', borderRadius: '6px', border: '1px solid #333', objectFit: 'cover' }} />
                </div>
              </div>

            </div>

            <div className="size-modal-footer">
              <button className="size-modal-ok-btn" onClick={() => setIsOpen(false)}>
                {isAr ? "فهمت، شكراً!" : "Got it, thanks!"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}