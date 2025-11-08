"use client";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function PrivacyPage() {
  const { t, lang,changeLang } = useLanguage();
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <header className="relative bg-teal-600 shadow-lg flex justify-between items-center py-3 px-5 md:py-6 md:px-20">
  <h1 className="text-md  md:text-2xl font-bold text-white tracking-wide">
    {t.privacy_title}
  </h1>

  {/* Language Icon */}
  <div className="relative flex-shrink-0">
    <button
      onClick={toggleLangMenu}
      className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
    >
      <Globe size={22} className="text-white" />
    </button>

    {/* Dropdown Menu */}
    {openLang && (
      <div
        className={`w-[160px] absolute mt-2 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50
          ${lang === "ar" ? "left-0" : "right-0"}
        `}
      >
        <button
          onClick={() => {
            changeLang("en");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇺🇸 en - English
        </button>

        <button
          onClick={() => {
            changeLang("ar");
            setOpenLang(false);
          }}
          className="block cursor-pointer px-4 py-2  hover:bg-gray-100 w-full text-right"
        >
          🇸🇦 ar - عربي
        </button>

        <button
          onClick={() => {
            changeLang("fr");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇫🇷 fr - Français
        </button>

        <button
          onClick={() => {
            changeLang("es");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇪🇸 es - Español
        </button>

        <button
          onClick={() => {
            changeLang("de");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇩🇪 de - Deutsch
        </button>

        <button
          onClick={() => {
            changeLang("it");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇮🇹 it - Italiano
        </button>

        <button
          onClick={() => {
            changeLang("pt");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
        >
          🇵🇹 pt - Português
        </button>
      </div>
    )}
  </div>
</header>
      {/* <h1 className="text-3xl font-bold text-teal-600 mb-5">
        {t.privacy_title}
      </h1> */}
      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line py-3 px-5 md:py-6 md:px-20">
        {t.privacy_text}
      </p>
    </div>
  );
}
