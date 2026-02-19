import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'zh-CN' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const normalizeLanguage = (lang: string | undefined): Language => {
  return lang === 'en-US' ? 'en-US' : 'zh-CN';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(normalizeLanguage(i18n.language));

  useEffect(() => {
    const normalizedLanguage = normalizeLanguage(i18n.language);
    setLanguageState(normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;
  }, [i18n.language]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
