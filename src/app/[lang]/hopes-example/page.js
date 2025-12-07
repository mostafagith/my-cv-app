"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { IoArrowBack, IoBulbOutline } from "react-icons/io5";
import { Globe } from "lucide-react";

export default function HopesExample() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  // ---- أمثلة ثابتة ----
  const hopesExamples = [
    
      t.hope1
    ,
      t.hope2
    ,
    
      t.hope3
    ,
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white py-5 px-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 cursor-pointer">
          <IoArrowBack size={22} />
        </button>

        <h1 className="text-lg font-bold">
          {t["hopesExamples"] || "Hopes Examples"}
        </h1>

        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
          >
            <Globe size={22} className="text-white" />
          </button>

          {openLang && (
            <div
              className={`w-[160px] absolute mt-2 ${
                lang === "ar" ? "left-0" : "right-0"
              } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
            >
              {["en", "ar", "fr", "es", "de", "it", "pt"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    changeLang(lng);
                    setOpenLang(false);
                  }}
                  className={`block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer ${
                    lng === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {lng === "en" && "🇺🇸 English"}
                  {lng === "ar" && "🇸🇦 عربي"}
                  {lng === "fr" && "🇫🇷 Français"}
                  {lng === "es" && "🇪🇸 Español"}
                  {lng === "de" && "🇩🇪 Deutsch"}
                  {lng === "it" && "🇮🇹 Italiano"}
                  {lng === "pt" && "🇵🇹 Português"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Info box */}
        <div className="flex items-start bg-green-50 border border-green-200 p-4 rounded-xl">
          <IoBulbOutline size={24} className="text-green-600 mt-1" />
          <div className="ml-3">
            <h2 className="font-bold text-green-800 text-base">
              {t["strongAspirations"]||"Examples of Strong Aspirations"}
            </h2>
            <p className="text-green-700 text-sm mt-1 leading-6">
              {t[
                "description"
              ]||"These are sample aspirations to help you write your own in a professional way."}
            </p>
          </div>
        </div>

        {/* Example Cards */}
        {hopesExamples.map((example, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 p-4 rounded-xl"
          >
            <h3 className="font-semibold text-teal-600 mb-2">
              {t["exampleLabel"]||"Example"} {index + 1}
            </h3>
            <p className="text-gray-800 text-sm leading-6">{example}</p>
          </div>
        ))}

        {/* Tips section (نفس نسخة صفحة Hopes بالظبط) */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-800 mb-2">
            💡 {t["Tips for Writing Hopes:"]}
          </h3>
          <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
            <li>{t["Be specific about your career goals"]}</li>
            <li>{t["Mention skills you want to develop"]}</li>
            <li>{t["Connect your aspirations to the role"]}</li>
            <li>{t["Keep it professional and realistic"]}</li>
            <li>{t["Show enthusiasm and motivation"]}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
