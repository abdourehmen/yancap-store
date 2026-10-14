import React from 'react';
import './HeroSection.css';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ lang }) {
  const content = {
    en: {
      badge: "Shop Online 🇩🇿",
      titleLine1: "Best Quality",
      titleAccent: "Best Price.",
      description: "Discover the exclusive and luxury collection of caps, choose the cap that suits you, and order it now With Yancap.dz",
      floatingTitle: "Yancap.dz"
    },
    ar: {
      badge: "تسوق أونلاين 🇩🇿",
      titleLine1: "أفضل جودة",
      titleAccent: "أفضل سعر.",
      description: "اكتشف تشكيلة القبعات الحصرية والفخمة واختر القبعة التي تناسبك واطلبها الآن بكل سهولة مع Yancap.dz",
      floatingTitle: "Yancap.dz"
    }
  };

  const t = content[lang] || content.en;

  return (
    <section className="streetflex-hero">
      <div className="hero-container">
        
        {/* المحتوى النصي مع حركات متسلسلة */}
        <div className="hero-content">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hero-badge"
          >
            <Sparkles size={16} />
            <span>{t.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hero-title"
          >
            {t.titleLine1} <br />
            <span className="hero-title-accent">{t.titleAccent}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="hero-description"
          >
            {t.description}
          </motion.p>
        </div>

      </div>
    </section>
  );
}