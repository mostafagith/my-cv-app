"use client";
import { createContext, useContext, useState, useEffect } from "react";
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
  }

  return (
    <LanguageContext.Provider value={{ t, lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
