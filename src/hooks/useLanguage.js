"use client";

import { useEffect, useState } from "react";

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

  const translations = { en, ar, fr, es, de, it, pt };

  useEffect(() => {
    let savedLang = null;
    try {
      savedLang = localStorage.getItem("lang") || sessionStorage.getItem("lang");
    } catch (e) {
      console.warn("Could not access storage:", e);
    }

    if (savedLang && translations[savedLang]) {
      changeLang(savedLang);
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, []);

  function changeLang(newLang) {
    const selected = translations[newLang] || en;
    setLang(newLang);
    setT(selected);

    try {
      localStorage.setItem("lang", newLang);
      sessionStorage.setItem("lang", newLang);
    } catch (e) {
      console.warn("Could not save language to storage:", e);
    }

    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  }

  return { t, lang, changeLang };
}
