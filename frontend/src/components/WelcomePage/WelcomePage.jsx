import React, { useEffect } from 'react';

const WelcomePage = ({ onEnter }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onEnter) onEnter();
    }, 500); // 3.5 seconds before auto-entering the store

    return () => clearTimeout(timer);
  }, [onEnter]);

  // CSS Animation styles injection - تم تحديث الألوان لتتوافق مع الثيم الأسود والأبيض
  const animationStyles = `
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translateY(30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulseGlow {
      0%, 100% {
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
      }
      50% {
        text-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
      }
    }

    .welcome-title {
      animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .brand-name {
      display: inline-block;
      color: #ffffff; /* لون أبيض نقي متناسق مع الثيم الفخم */
      font-weight: 900;
      animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards, 
                 pulseGlow 2s infinite 1.5s;
      opacity: 0;
    }

    .welcome-subtitle {
      animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
      opacity: 0;
    }
  `;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000', // خلفية سوداء صريحة وفخمة متناسقة تماماً مع الثيم
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center',
    flexDirection: 'column',
    gap: '20px',
    cursor: 'pointer',
    overflow: 'hidden'
  };

  const textStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    margin: '0',
    lineHeight: '1.4',
    color: '#ffffff'
  };

  return (
    <div style={containerStyle} onClick={onEnter}>
      <style>{animationStyles}</style>
      
      <div className="welcome-title" style={textStyle}>
        Welcome to <br />
        <span className="brand-name">Yancap.dz</span>
      </div>
    </div>
  );
};

export default WelcomePage;