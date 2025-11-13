"use client";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";

const supportedLanguages = ["en", "ar", "fr", "es", "de", "it", "pt"];

const siteMetadata = {
  title: {
    en: "Create CV Master | Professional CV Builder",
    ar: "Create CV Master | صانع السيرة الذاتية الاحترافي",
    fr: "Create CV Master | Créateur de CV Professionnel",
    es: "Create CV Master | Creador de CV Profesional",
    de: "Create CV Master | Professioneller Lebenslauf-Builder",
    it: "Create CV Master | Creatore di CV Professionale",
    pt: "Create CV Master | Criador de CV Profissional",
  },
  description: {
    en: "Create your CV for free in minutes with professional templates. Download as PDF or share online easily.",
    ar: "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة.",
    fr: "Créez votre CV gratuitement en quelques minutes avec des modèles professionnels. Téléchargez en PDF ou partagez en ligne facilement.",
    es: "Crea tu CV gratis en minutos con plantillas profesionales. Descarga en PDF o comparte en línea fácilmente.",
    de: "Erstellen Sie Ihren Lebenslauf in Minuten kostenlos mit professionellen Vorlagen. Laden Sie als PDF herunter oder teilen Sie online.",
    it: "Crea il tuo CV gratis in pochi minuti con modelli professionali. Scarica in PDF o condividi online facilmente.",
    pt: "Crie seu CV gratuitamente em minutos com modelos profissionais. Baixe em PDF ou compartilhe online facilmente.",
  },
  keywords: [
    "CV","Resume Builder","سيرة ذاتية","إنشاء CV","Create CV Online",
    "قوالب سيرة ذاتية","Create CV Master","سيرة ذاتية مجانية","Free CV",
    "تحميل PDF","PDF سيره ذاتيه","Free Resume PDF","انشاء سيرة ذاتية PDF",
    "CV مجاني","CV PDF","Resume PDF",
  ],
  ogImage: "https://createcvmaster.com/og-image.jpg",
};

export default function LangLayout({ children }) {
  const params = useParams();
  const { lang, changeLang } = useLanguage();
  const urlLang = params?.lang || "en";

  useEffect(() => {
    // فقط غير اللغة إذا كانت مختلفة وممدعومة
    if (supportedLanguages.includes(urlLang) && urlLang !== lang) {
      console.log("Changing lang from URL:", urlLang);
      changeLang(urlLang);
    }
  }, [urlLang]); // أزل lang من dependencies علشان مايحصلش loop

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = siteMetadata.title[lang] || siteMetadata.title.en;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = siteMetadata.description[lang] || siteMetadata.description.en;

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = siteMetadata.keywords.join(",");

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = siteMetadata.title[lang] || siteMetadata.title.en;

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = siteMetadata.description[lang] || siteMetadata.description.en;

      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.content = siteMetadata.ogImage;

      const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
      existingHreflangs.forEach(link => link.remove());

      supportedLanguages.forEach(l => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = l;
        link.href = `https://createcvmaster.com/${l}`;
        document.head.appendChild(link);
      });
    }
  }, [lang]);

  return <>{children}</>;
}