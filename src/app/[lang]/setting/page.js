"use client";

import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCVLanguage } from "@/hooks/useCVLanguage";

export default function SettingsPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const { cvLang, changeCvLang } = useCVLanguage();
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const toggleLangMenu = () => setOpenLangMenu(!openLangMenu);

  const handleBack = () => router.push(`/${lang}/`);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 py-4 px-6 flex items-center justify-between shadow-md">
        <button
          onClick={handleBack}
          className="text-white p-2 hover:bg-teal-600 rounded-full transition cursor-pointer"
        >
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-lg font-bold text-white">{t["settings"] || "Settings"}</h1>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Site Language */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            {t["site_language"] || "Site Language"}
          </label>
          <div className="relative">
            <button
              onClick={toggleLangMenu}
              className="w-full border border-gray-300 rounded-lg p-2 flex justify-between items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span>{lang}</span>
              <Globe size={20} />
            </button>
            {openLangMenu && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("en");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["english"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("ar");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["arabic"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("fr");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["french"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("es");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["spanish"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("de");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["german"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("it");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["italian"]}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    changeLang("pt");
                    setOpenLangMenu(false);
                  }}
                >
                  {t["portuguese"]}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CV Language */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {t["cv_language"] || "CV Language"}
          </label>
          <select
            value={cvLang}
            onChange={(e) => changeCvLang(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="en">{t["english"] || "English"}</option>
            <option value="ar">{t["arabic"] || "Arabic"}</option>
            <option value="fr">{t["french"] || "French"}</option>
            <option value="es">{t["spanish"] || "Spanish"}</option>
            <option value="de">{t["german"] || "German"}</option>
            <option value="it">{t["italian"] || "Italian"}</option>
            <option value="pt">{t["portuguese"] || "Portuguese"}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
