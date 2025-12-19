"use client"; import AdBanner from "@/components/AdBanner";
;

import { useEffect, useState } from "react";

import cv_en from "@/cvLocales/en.json";
import cv_ar from "@/cvLocales/ar.json";
import cv_fr from "@/cvLocales/fr.json";
import cv_es from "@/cvLocales/es.json";
import cv_de from "@/cvLocales/de.json";
import cv_it from "@/cvLocales/it.json";
import cv_pt from "@/cvLocales/pt.json";

export function useCVLanguage() {
  const [cvLang, setCvLang] = useState("en");
  const [cvT, setCvT] = useState(cv_en);

  const cvTranslations = { en: cv_en, ar: cv_ar, fr: cv_fr, es: cv_es, de: cv_de, it: cv_it, pt: cv_pt };

  useEffect(() => {
    let savedCvLang = null;
    try {
      savedCvLang = localStorage.getItem("cvLang") || sessionStorage.getItem("cvLang");
    } catch (e) {
      console.warn("Could not access storage:", e);
    }

    if (savedCvLang && cvTranslations[savedCvLang]) {
      changeCvLang(savedCvLang);
    }
  }, []);

  function changeCvLang(newLang) {
    const selected = cvTranslations[newLang] || cv_en;
    setCvLang(newLang);
    setCvT(selected);

    try {
      localStorage.setItem("cvLang", newLang);
      sessionStorage.setItem("cvLang", newLang);
    } catch (e) {
      console.warn("Could not save CV language to storage:", e);
    }
  }

  return { cvT, cvLang, changeCvLang };
}
