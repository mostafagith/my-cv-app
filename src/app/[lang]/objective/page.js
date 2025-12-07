"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe} from "lucide-react";

export default function ObjectivePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);
  const [objective, setObjective] = useState("");

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

// ---------------- Load Objective ----------------
useEffect(() => {
  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  if (cv.objective) setObjective(cv.objective);
}, []);

// ---------------- Save Objective ----------------
const handleSave = () => {
  if (!objective.trim()) {
    toast.error(t["pleaseEnterObjective"] || t["Please enter your career objective"]);
    return;
  }

  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  const updated = { ...cv, objective, lastUpdated: new Date().toISOString() };
  safeSetItem("currentCV", JSON.stringify(updated));

  toast.success(t["savedSuccessfully"] || t["Career Objective Saved Successfully!"]);

  setTimeout(() => {
    router.back();
  }, 1000);
};

// ---------------- Back ----------------
const handleBack = () => {
  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  if (objective === cv.objective) {
    router.back();
  } else {
    if (confirm(t["You have unsaved changes. Do you want to go back?"])) {
      router.back();
    }
  }
};


  const tips = [
    t["tip1"] || t["Keep it brief (2-3 sentences)"],
    t["tip2"] || t["Mention your career goals"],
    t["tip3"] || t["Highlight what you can offer"],
    t["tip4"] || t["Tailor it to the specific job"],
  ];

  const examples = [
    t["example1"] ||
      t["Seeking a challenging position in software development where I can utilize my programming skills and contribute to innovative projects while continuing to learn and grow professionally."],
    t["example2"] ||
      t["To obtain a marketing manager position in a dynamic organization where I can apply my 5 years of experience in digital marketing to drive brand growth and increase market share."],
  ];

  return (
    <div
      className={`min-h-screen flex flex-col bg-white ${lang === "ar" ? "text-right" : "text-left"}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif" }}
    >
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 hover:text-gray-200 cursor-pointer">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-xl font-bold">{t["careerObjective"] || t["Career Objective"]}</h1>
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
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Objective Input */}
        {/* Add/Edit Form */}
        <button
          onClick={() => router.push(`/${lang}/object-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.demo_example || "View object Example"}
        </button>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            {t["yourCareerObjective"] || t["Your Career Objective"]}
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 text-gray-800 bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            rows={8}
            maxLength={500}
            placeholder={
              t["objectivePlaceholder"] ||
              t["Example: Seeking a challenging position in a reputable organization where I can utilize my skills and knowledge for the organization's growth..."]
            }
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
          <p className="text-right text-sm text-gray-500 mt-1">
            {objective.length}/500 {t["characters"] || t["characters"]}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-3">{t["tipsTitle"] || t["Tips for a great objective:"]}</h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <IoCheckmarkCircle size={18} className="text-teal-600" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples
        <div className="bg-green-50 border-l-4 border-teal-500 p-5 rounded-xl">
          <h3 className="font-bold text-teal-800 mb-3">{t["goodExamples"] || t["Good Examples:"]}</h3>
          {examples.map((ex, i) => (
            <blockquote
              key={i}
              className="bg-white border border-green-100 p-3 rounded-lg text-gray-700 italic mb-3"
            >
              “{ex}”
            </blockquote>
          ))}
        </div> */}
      </main>

      {/* Save Button */}
      <div className="p-5 border-t border-gray-200 bg-white">
        <button
          onClick={handleSave}
          className="w-full cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold transition"
        >
          {t["saveObjective"] || t["Save Objective"]}
        </button>
      </div>
    </div>
  );
}
