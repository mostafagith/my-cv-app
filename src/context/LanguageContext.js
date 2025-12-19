"use client"; import AdBanner from "@/components/AdBanner";
;
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
  // تحديد اللغة من مصادر مختلفة مع الأولوية للرابط
  const getInitialLang = () => {
    // 1. الأولوية للغة من الرابط (URL) - إذا كنا في المتصفح
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const urlLang = pathSegments[0];
      
      // تحقق إذا كانت اللغة من الرابط مدعومة
      if (urlLang && translations[urlLang]) {
        console.log("🌐 Using language from URL:", urlLang);
        return urlLang;
      }
    }

    // 2. إذا مفيش لغة في الرابط، جيب من localStorage
    const savedLang = localStorage.getItem("lang");
    if (savedLang && translations[savedLang]) {
      console.log("💾 Using language from localStorage:", savedLang);
      return savedLang;
    }

    // 3. إذا مفيش في localStorage، جيب من sessionStorage
    const sessionLang = sessionStorage.getItem("lang");
    if (sessionLang && translations[sessionLang]) {
      console.log("🔐 Using language from sessionStorage:", sessionLang);
      return sessionLang;
    }

    // 4. إذا مفيش أي حاجة، استخدم en
    console.log("⚡ Using default language: en");
    return "en";
  };

  const initialLang = getInitialLang();
  
  // غير اللغة فقط إذا كانت مختلفة عن الحالية
  if (initialLang && initialLang !== lang) {
    console.log("🎯 Setting initial language:", initialLang);
    setLang(initialLang);
    setT(translations[initialLang]);
    
    // تحديث الـ HTML attributes
    if (typeof document !== "undefined") {
      document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = initialLang;
    }

    // إذا كانت اللغة من الرابط مختلفة عن المحفوظة، حدث التخزين
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const urlLang = pathSegments[0];
      
      if (urlLang && translations[urlLang] && urlLang !== initialLang) {
        localStorage.setItem("lang", urlLang);
        sessionStorage.setItem("lang", urlLang);
      }
    }
  }
}, []); // مرة واحدة عند التحميل الأول

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