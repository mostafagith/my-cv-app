"use client"; import AdBanner from "@/components/AdBanner";
;
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { t, lang,changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  return (
    <div className="bg-white">
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
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer/>
    </div>
  );
}
