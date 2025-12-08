"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ObjectiveExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const examples = [
    t["objective1"] ||
      "Seeking a challenging position in software development where I can utilize my programming skills and contribute to innovative projects.",
    t["objective2"] ||
      "To obtain a marketing manager position where I can apply my experience to drive brand growth and build effective marketing strategies.",
    t["objective3"] ||
      "Looking for an accounting role in a reputable company to apply analytical skills and maintain accurate financial records.",
    t["objective4"] ||
      "Seeking a customer service position where I can enhance customer satisfaction using strong communication and problem-solving skills.",
    t["objective5"] ||
      "To join a dynamic team as a graphic designer where I can use my creativity and design experience to deliver impactful visuals.",
  ];

  return (
    <div
      className={`min-h-screen flex flex-col bg-white ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 px-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:text-gray-200 cursor-pointer"
        >
          <IoArrowBack size={22} />
        </button>

        <h1 className="text-xl font-bold">
          {t["careerObjectiveExamples"] || "Career Objective Examples"}
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
                    lang === "ar" && lng === "ar"
                      ? "text-right"
                      : "text-left"
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
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {t["chooseExampleYouLike"] || "Choose an example you like:"}
        </h2>

        <div className="space-y-4">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-1 bg-teal-600 rounded-full flex-shrink-0"></div>
                <p className="text-gray-700 break-words whitespace-normal leading-relaxed">
                  {ex}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Back Button */}
      <div className="p-5 border-t border-gray-200 bg-white">
        <button
          onClick={() => router.back()}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-teal-700 transition"
        >
          {t["back"] || "Back"}
        </button>
      </div>
    </div>
  );
}
