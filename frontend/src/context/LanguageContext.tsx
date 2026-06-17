import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LanguageContextType {
  language: string;
  setLanguage: (_lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n: i18nInstance } = useTranslation();
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("language") || "vi";
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    i18nInstance.changeLanguage(lang);
  };

  useEffect(() => {
    const saved = localStorage.getItem("language") || "vi";
    if (saved !== language) {
      setLanguageState(saved);
      i18nInstance.changeLanguage(saved);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
