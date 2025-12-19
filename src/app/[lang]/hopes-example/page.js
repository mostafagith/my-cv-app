"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { IoArrowBack, IoBulbOutline } from "react-icons/io5";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-white">
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

      {/* Hopes & Aspirations Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.hopes_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.hopes_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.hopes_examples_note}
        </p>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto flex-1 overflow-y-auto p-6 space-y-6">
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
      </div>
      {/* Hopes & Aspirations Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.hopes_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.hopes_tip_one}</li>
          <li>{t.hopes_tip_two}</li>
          <li>{t.hopes_tip_three}</li>
          <li>{t["Be specific about your career goals"]}</li>
          <li>{t["Mention skills you want to develop"]}</li>
          <li>{t["Show enthusiasm and motivation"]}</li>
        </ul>
      </section>
      <Footer/>
    </div>
  );
}
