import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'القبعات',
      about: 'عن المتجر',
    },
    hero: {
      title: 'استايل الشارع الأصلي',
      subtitle: 'اكتشف أفضل تشكيلة قبعات مودرن في الجزائر',
      btn: 'تسوق الآن',
    }
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Caps',
      about: 'About',
    },
    hero: {
      title: 'Original Streetwear',
      subtitle: 'Discover the best modern caps collection in Algeria',
      btn: 'Shop Now',
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  useEffect(() => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    toggleLanguage,
    t: translations[lang] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};