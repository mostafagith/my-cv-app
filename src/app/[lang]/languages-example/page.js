"use client";
import { useEffect, useState } from "react";

import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe} from "lucide-react";

export default function LanguagesExamplePage() {
    const router = useRouter();
    const { t, lang, changeLang } = useLanguage();
    const [openLang, setOpenLang] = useState(false);
    const toggleLangMenu = () => setOpenLang(!openLang);

  // ثابتة – 3 لغات
  const exampleLanguages = [
    { id: "1", name: "English", proficiency: t["Advanced"] },
    { id: "2", name: "French", proficiency: t["Intermediate"] },
    { id: "3", name: "Arabic", proficiency: t["Native"] },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="bg-teal-600 text-white flex items-center justify-between px-6 py-5">
        <button onClick={() => router.back()} className="p-2 cursor-pointer">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">{t["Languages Example"] || "Languages Example"}</h1>
        <div className="relative">
            <button
              onClick={toggleLangMenu}
              className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
            >
              <Globe size={22} className="text-white" />
            </button>

            {/* قائمة اللغات */}
            {openLang && (
              <div
                className={`w-[160px] absolute mt-2 ${
                  lang === "ar" ? "left-0" : "right-0"
                } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
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
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 w-full text-right"
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
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {t["Example of Languages Section"]}
        </h2>

        {exampleLanguages.map((lang) => (
          <div
            key={lang.id}
            className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
          >
            <div>
              <p className="font-bold text-gray-800">{lang.name}</p>
              <p className="text-gray-500 text-sm">{lang.proficiency}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
