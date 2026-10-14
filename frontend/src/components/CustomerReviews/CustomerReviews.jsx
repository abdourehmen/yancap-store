import React from 'react';

export default function CustomerReviews({ lang }) {
  const totalReviews = 24;
  const reviews = Array.from({ length: totalReviews }, (_, i) => i + 1);
  
  // مضاعفة المصفوفة لحركة دائرية لا نهائية وسلسة
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section 
      id="reviews" 
      style={{ 
        margin: '5rem 0', 
        padding: '5rem 0', 
        background: '#000000', // خلفية سوداء صريحة تتطابق مع ثيم الأقسام الداكنة
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* لمسة جمالية متناسقة مع الثيم الأسود الفخم */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '0.5px', position: 'relative', zIndex: 1, color: '#ffffff' }}>
        {lang === 'ar' ? 'آراء وثقة زبائننا' : 'Customer Reviews'}
      </h2>

      <style>
        {`
          @keyframes scrollTicker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .reviews-slider-container {
            position: relative;
            width: 100%;
            overflow: hidden;
            z-index: 1;
          }

          /* تدرجات جانبية مخملية متناسقة مع الخلفية السوداء */
          .reviews-slider-container::before,
          .reviews-slider-container::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 120px;
            z-index: 2;
            pointer-events: none;
          }
          .reviews-slider-container::before {
            left: 0;
            background: linear-gradient(to right, #000000, transparent);
          }
          .reviews-slider-container::after {
            right: 0;
            background: linear-gradient(to left, #000000, transparent);
          }

          .reviews-slider-track {
            display: flex;
            gap: 2rem;
            width: max-content;
            animation: scrollTicker 50s linear infinite;
            padding: 1rem 0;
          }
          .reviews-slider-track:hover {
            animation-play-state: paused;
          }
          
          .review-card-wrapper {
            flex-shrink: 0;
            width: 220px; 
            height: 300px; 
            position: relative;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .review-card-wrapper:hover {
            transform: translateY(-8px) scale(1.02);
          }
          
          /* البطاقات بإطار أبيض وإضاءة واضحة متناسقة مع الثيم */
          .review-card {
            position: relative;
            width: 100%;
            height: 100%;
            background: #111111;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 15px 30px -5px rgba(0,0,0,0.8);
            transition: all 0.3s ease;
          }
          
          .review-card-wrapper:hover .review-card {
            border-color: #ffffff;
            box-shadow: 0 20px 35px -5px rgba(255, 255, 255, 0.15);
          }
        `}
      </style>

      <div className="reviews-slider-container">
        <div className="reviews-slider-track">
          {duplicatedReviews.map((num, index) => (
            <div key={index} className="review-card-wrapper">
              <div className="review-card">
                <img 
                  src={`/reviews/review (${num}).jpg`} 
                  alt={`Review ${num}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ffffff; font-size: 0.8rem; text-align: center; padding: 1rem;">صورة رقم ${num}</div>`;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}