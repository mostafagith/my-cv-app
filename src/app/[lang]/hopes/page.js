"use client"; 
import AdBanner from "@/components/AdBanner";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { IoArrowBack, IoBulbOutline, IoCheckmarkCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

export default function Hopes() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const [hopes, setHopes] = useState("");
  const [isSaved, setIsSaved] = useState(false);

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

// ---------------- Load Hopes ----------------
useEffect(() => {
  const storedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  setHopes(storedCV?.hopes || "");
  setIsSaved(!!storedCV?.hopes);
}, []);

// ---------------- Save Hopes ----------------
const handleSave = () => {
  if (!hopes.trim()) {
    toast.error(t["Please enter your hopes and aspirations"]);
    return;
  }

  // Get currentCV or empty object
  const currentCV = JSON.parse(safeGetItem("currentCV") || "{}");

  // Update hopes section
  const updatedCV = {
    ...currentCV,
    hopes,
  };

  safeSetItem("currentCV", JSON.stringify(updatedCV));

  toast.success(t["Hopes saved successfully!"]);
  setIsSaved(true);

  setTimeout(() => {
    router.back();
  }, 1000);
};

// ---------------- Back with unsaved changes ----------------
const handleBack = () => {
  const currentCV = JSON.parse(safeGetItem("currentCV") || "{}");
  if (isSaved || hopes === currentCV?.hopes) {
    router.back();
  } else {
    if (confirm(t["You have unsaved changes. Do you want to go back?"])) {
      router.back();
    }
  }
};


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 text-white py-5 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 cursor-pointer">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-lg font-bold">{t["Hopes & Aspirations"]}</h1>
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
        {/* <div className="w-6" /> */}
      </div>

      <div className="max-w-4xl mx-auto flex-1 overflow-y-auto p-6 space-y-6">
        <button
          onClick={() => router.push(`/${lang}/hopes-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewHopesExample || "View hopes Example"}
        </button>
        {/* Instructions */}
        <div className="flex items-start bg-green-50 border border-green-200 p-4 rounded-xl">
          <IoBulbOutline size={24} className="text-green-600 mt-1" />
          <div className="ml-3">
            <h2 className="font-bold text-green-800 text-base">
              {t["Share Your Aspirations"]}
            </h2>
            <p className="text-green-700 text-sm mt-1 leading-6">
              {t[
                "Describe your career goals, future aspirations, and what you hope to achieve. This helps employers understand your motivation and direction."
              ]}
            </p>
          </div>
        </div>

        {/* Hopes Input */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <label className="block text-gray-800 font-semibold mb-2">
            {t["Your Hopes & Aspirations"]}
          </label>
          <textarea
            className={`w-full border text-gray-700 ${
              hopes.length > 0 ? "border-teal-500" : "border-gray-300"
            } rounded-lg p-3 text-sm min-h-[120px] focus:outline-none`}
            placeholder={t[
              "Describe your career goals, future plans, and aspirations..."
            ]}
            value={hopes}
            onChange={(e) => setHopes(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right mt-1">
            {hopes.length}/500 {t["characters"]}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hopes.trim()}
          className={`w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
            !hopes.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          <IoCheckmarkCircle size={20} />
          <span>{t["Save Hopes"]}</span>
        </button>
      </div>
      <AdBanner adKey={AD_KEY} />

      {/* Hopes & Aspirations Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t["Tips for Writing Hopes:"]}
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
      <AdBanner adKey={AD_KEY} />
      {/* FAQ Section for Hopes & Aspirations */}
      <section className="max-w-4xl mx-auto mt-12 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          {t.hopes_faq_title}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-teal-200">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-teal-50/30 list-none">
                <span className="font-semibold text-gray-700">{t[`hopes_faq_${num}_q`]}</span>
                <span className="text-teal-500 transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {t[`hopes_faq_${num}_a`]}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section for Hopes & Aspirations */}
      <section className="max-w-4xl mx-auto mt-12 mb-16 px-6">
        <div className="bg-red-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {t.hopes_mistakes_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="bg-white p-4 rounded-xl border border-purple-50 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {t[`hopes_mistake_${num}_t`]}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t[`hopes_mistake_${num}_d`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <AdBanner adKey={AD_KEY} />
      <Footer/>
    </div>
  );
}
