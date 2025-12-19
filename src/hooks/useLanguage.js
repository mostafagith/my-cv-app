"use client"; import AdBanner from "@/components/AdBanner";
;
import { createContext, useContext, useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
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
  const [lang, setLang] = useState("");
  const [t, setT] = useState(en);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    const savedLang =
      localStorage.getItem("lang") || sessionStorage.getItem("lang") || "en";
    changeLang(savedLang);
  }, []);

  function changeLang(newLang) {
    const selected = translations[newLang] || en;
    setLang(newLang);
    setT(selected);

    localStorage.setItem("lang", newLang);
    sessionStorage.setItem("lang", newLang);

    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // تحديث الرابط مع الحفاظ على المسار الحالي
    updateUrlWithNewLanguage(newLang);
  }

  function updateUrlWithNewLanguage(newLang) {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // إذا كان الرابط الحالي يحتوي على لغة
    if (translations[pathSegments[0]]) {
      // استبدل اللغة في الرابط
      pathSegments[0] = newLang;
      const newPath = `/${pathSegments.join('/')}`;
      router.push(newPath);
    } else {
      // إذا لم يكن هناك لغة، أضف اللغة الجديدة
      const newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
      router.push(newPath);
    }
  }

  // دالة مساعدة لتغيير اللغة مع مسار محدد
  function changeLangWithPath(newLang, path = null) {
    const selected = translations[newLang] || en;
    setLang(newLang);
    setT(selected);

    localStorage.setItem("lang", newLang);
    sessionStorage.setItem("lang", newLang);

    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    if (path) {
      // إذا تم تحديد مسار، اذهب إليه مباشرة
      router.push(`/${newLang}${path}`);
    } else {
      // إذا لم يتم تحديد مسار، عدل الرابط الحالي
      updateUrlWithNewLanguage(newLang);
    }
  }

  return (
    <LanguageContext.Provider value={{ 
      t, 
      lang, 
      changeLang,
      changeLangWithPath 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}