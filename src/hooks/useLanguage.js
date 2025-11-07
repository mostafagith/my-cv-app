"use client";

import { useEffect, useState } from "react";

// استيراد كل ملفات الترجمة
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import de from "@/locales/de.json";
import it from "@/locales/it.json";
import pt from "@/locales/pt.json";

export function useLanguage() {
  const [lang, setLang] = useState("en");
  const [t, setT] = useState(en);

  // خريطة اللغات
  const translations = { en, ar, fr, es, de, it, pt };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && translations[savedLang]) {
      changeLang(savedLang);
    } else {
      // أول مرة يفتح الموقع
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, []);

  function changeLang(newLang) {
    const selected = translations[newLang] || en;
    setLang(newLang);
    setT(selected);
    localStorage.setItem("lang", newLang);

    // اللغة العربية فقط تكون RTL
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  }

  return { t, lang, changeLang };
}
