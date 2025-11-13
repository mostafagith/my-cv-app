"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { IoArrowBack, IoInformationCircle, IoCheckmark } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { useCVLanguage } from "@/hooks/useCVLanguage";

import { Globe } from "lucide-react";

export default function SelectTemplate() {
  const router = useRouter();
  const { t, lang,changeLang } = useLanguage();
  const { cvT, cvLang, changeCvLang } = useCVLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);
  // ---------------- Safe Storage ----------------
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`localStorage failed for key "${key}", fallback to sessionStorage`, err);
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
    }
  }
};

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch (err) {
    console.warn(`localStorage failed for key "${key}", fallback to sessionStorage`, err);
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
      return null;
    }
  }
};

// ---------------- Load CV Data ----------------
useEffect(() => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  setCvData(savedCV);
}, []);


  // بيانات التيمبلتس
  const templates = [
    { id: "templet1", name: "Template 1", image: "/templates/templet1.jpg", page: "/templet1" },
    { id: "templet2", name: "Template 2", image: "/templates/templet2.jpg", page: "/templet2" },
    { id: "templet3", name: "Template 3", image: "/templates/templet3.jpg", page: "/templet3" },
    { id: "creative", name: "Creative", image: "/templates/creative.jpg", page: "/templet4" },
    { id: "executive", name: "Executive", image: "/templates/executive.jpg", page: "/templet5" },
    { id: "academic", name: "Academic", image: "/templates/academic.jpg", page: "/templet6" },
    { id: "templet7", name: "Template 7", image: "/templates/templet7.jpg", page: "/templet7" },
    { id: "templet8", name: "Template 8", image: "/templates/templet8.jpg", page: "/templet8" },
    { id: "templet9", name: "Template 9", image: "/templates/templet9.jpg", page: "/templet9" },
    { id: "templet10", name: "Template 10", image: "/templates/templet10.jpg", page: "/templet10" },
  ];

  const handleBack = () => router.back();

  const handleTemplateSelect = (template) => {
    if (!cvData || Object.keys(cvData).length === 0) {
      alert(t["no_cv_data"]);
      return;
    }

    setSelectedTemplate(template.id);
    router.push(`/${lang}/select-template-preview/${template.page}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-teal-500  py-3 px-5 md:py-6 md:px-20 flex items-center justify-between shadow-md">
        <button onClick={handleBack} className="cursor-pointer text-white p-2 hover:bg-teal-600 rounded-full transition">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-lg font-bold text-white">{t["choose_template"]}</h1>
        {/* اختيار اللغة */}
          <div className="relative flex-shrink-0">
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
                } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50`}
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-3 px-5 md:py-6 md:px-20">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{t["select_cv_template"]}</h2>
        <p className="text-gray-500 text-center mb-8">{t["choose_from_templates"]}</p>
        <div className="mb-6">
  <label
    htmlFor="cvLangSelect"
    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    {t.select_cv_language}
  </label>
  <select
    id="cvLangSelect"
    value={cvLang}
    onChange={(e) => changeCvLang(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
  >
    <option value="en">{t.english}</option>
    <option value="ar">{t.arabic}</option>
    <option value="fr">{t.french}</option>
    <option value="es">{t.spanish}</option>
    <option value="de">{t.german}</option>
    <option value="it">{t.italian}</option>
    <option value="pt">{t.portuguese}</option>
  </select>
</div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 ">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`relative border-2 overflow-hidden cursor-pointer transition transform hover:scale-[1.02] ${
                selectedTemplate === template.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-400"
              }`}
            >
              <div className="relative w-full ">
                <img
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-contain"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1.5">
                    <IoCheckmark size={18} className="text-white" />
                  </div>
                )}
              </div>
              {/* <div className="p-3 text-center">
                <p className="font-semibold text-gray-800">{template.name}</p>
              </div> */}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg p-4 mt-8">
          <IoInformationCircle size={22} className="text-teal-500" />
          <span className="text-gray-700 text-sm">{t["you_can_change_template_later"]}</span>
        </div>
      </div>
    </div>
  );
}
