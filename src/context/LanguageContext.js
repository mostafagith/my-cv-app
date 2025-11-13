"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import de from "@/locales/de.json";
import it from "@/locales/it.json";
import pt from "@/locales/pt.json";

const translations = { en, ar, fr, es, de, it, pt };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(en);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // جلب اللغة المحفوظة
    const savedLang = localStorage.getItem("lang") || sessionStorage.getItem("lang") || "en";
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
      setT(translations[savedLang]);
    }
  }, []);

  const changeLang = (newLang) => {
    if (!translations[newLang]) return;
    
    setLang(newLang);
    setT(translations[newLang]);

    // حفظ في التخزين
    localStorage.setItem("lang", newLang);
    sessionStorage.setItem("lang", newLang);

    // تحديث اتجاه الصفحة
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // تحديث الرابط
    updateUrlLanguage(newLang);
  };

  const updateUrlLanguage = (newLang) => {
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // إذا كان الرابط الحالي يحتوي على لغة
    const currentLang = pathSegments[0];
    if (translations[currentLang]) {
      // استبدل اللغة في الرابط
      pathSegments[0] = newLang;
      const newPath = `/${pathSegments.join('/')}`;
      
      // استخدم replace بدل push علشان مايضيفش history جديد
      router.replace(newPath);
    } else {
      // إذا لم يكن هناك لغة، أضف اللغة الجديدة
      const newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
      router.replace(newPath);
    }
  };

  return (
    <LanguageContext.Provider value={{ t, lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}