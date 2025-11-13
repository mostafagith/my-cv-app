"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  const { t, lang,changeLang } = useLanguage();
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  return (
    <>
      <Navbar/>
      <div
        className={`min-h-screen bg-gray-50 py-10 px-5 md:px-20 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        
          <h1 className="text-3xl font-bold text-teal-700 mb-4">
            {t.privacy_title}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line ">
            {t.privacy_text}
          </p>
        
      </div>
    </>
  );
}
