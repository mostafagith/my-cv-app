"use client"; 
import AdBanner from "@/components/AdBanner";

import { useEffect, useState } from "react";
import { IoArrowBack, IoTrashOutline, IoAdd, IoCheckmark } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe} from "lucide-react";
import Footer from "@/components/Footer";

export default function LanguagesPage() {
  const router = useRouter();
   const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ✅ Load from currentCV
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

// ---------------- Load Languages ----------------
useEffect(() => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  if (savedCV.languages) {
    setLanguages(savedCV.languages);
  }
}, []);

// ---------------- Save Languages ----------------
const saveToLocalStorage = (updated) => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  const updatedCV = { ...savedCV, languages: updated };
  safeSetItem("currentCV", JSON.stringify(updatedCV));
};

// ---------------- Add / Edit Language ----------------
const addLanguage = () => {
  if (!languageName.trim()) {
    toast.error(t["Please enter a language name"]);
    return;
  }

  let updated;
  if (editingId) {
    updated = languages.map((lang) =>
      lang.id === editingId
        ? { ...lang, name: languageName.trim(), proficiency: proficiency || t["Intermediate"] }
        : lang
    );
    toast.success(t["Language updated successfully!"]);
  } else {
    const newLang = {
      id: Date.now().toString(),
      name: languageName.trim(),
      proficiency: proficiency || t["Intermediate"],
    };
    updated = [...languages, newLang];
    toast.success(t["Language added successfully!"]);
  }

  setLanguages(updated);
  saveToLocalStorage(updated);
  setLanguageName("");
  setProficiency("");
  setEditingId(null);
};

// ---------------- Edit ----------------
const editLanguage = (language) => {
  setLanguageName(language.name);
  setProficiency(language.proficiency);
  setEditingId(language.id);
};

// ---------------- Remove ----------------
const removeLanguage = (id) => {
  if (confirm(t["Are you sure you want to remove this language?"])) {
    const updated = languages.filter((lang) => lang.id !== id);
    setLanguages(updated);
    saveToLocalStorage(updated);
    toast.success(t["Language removed successfully!"]);
  }
};


  const handleSave = () => {
    toast.success(t.saved_successfully); 
    setTimeout(()=>{
      router.back();
    },1000)
  };

  const proficiencyLevels = [
    t["Beginner"],
    t["Intermediate"],
    t["Advanced"],
    t["Native"],
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-600 text-white flex items-center justify-between px-6 py-5">
        <button onClick={() => router.back()} className="p-2 cursor-pointer">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">{t["Languages"]}</h1>
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
        {/* <div className="w-6" /> */}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Add/Edit Form */}
        <button
          onClick={() => router.push(`/${lang}/languages-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewLanguagesExample || "View languages Example"}
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editingId ? t["Edit Language"] : t["Add Language"]}
        </h2>

        <input
          className="w-full border border-gray-300 rounded-md p-3 mb-3 text-gray-700"
          placeholder={t["Language (e.g., English, French)"]}
          value={languageName}
          onChange={(e) => setLanguageName(e.target.value)}
        />

        <p className="font-semibold text-gray-700 mb-2">{t["Proficiency Level"]}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {proficiencyLevels.map((level) => (
            <button
              key={level}
              className={`px-4 py-2 rounded-full border cursor-pointer ${
                proficiency === level
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-gray-100 border-gray-300 text-gray-700"
              }`}
              onClick={() => setProficiency(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          {editingId && (
            <button
              onClick={() => {
                setLanguageName("");
                setProficiency("");
                setEditingId(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 cursor-pointer rounded-md font-bold"
            >
              {t["Cancel"]}
            </button>
          )}
          <button
            onClick={addLanguage}
            className="flex-1 bg-teal-600 text-white cursor-pointer py-3 rounded-md font-bold flex items-center justify-center gap-2"
          >
            {editingId ? <IoCheckmark /> : <IoAdd />}
            {editingId ? t["Update Language"] : t["Add Language"]}
          </button>
        </div>

        {/* List */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {t["Your Languages"]} ({languages.length})
        </h3>

        {languages.length === 0 ? (
          <p className="text-gray-500 italic">{t["No languages added yet"]}</p>
        ) : (
          languages.map((lang) => (
            <div
              key={lang.id}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
            >
              <div>
                <p className="font-bold text-gray-800">{lang.name}</p>
                <p className="text-gray-500 text-sm">{lang.proficiency}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => editLanguage(lang)}>
                  <IoCheckmark size={20} className="text-teal-600 cursor-pointer" />
                </button>
                <button onClick={() => removeLanguage(lang.id)}>
                  <IoTrashOutline size={20} className="text-red-500 cursor-pointer" />
                </button>
              </div>
            </div>
          ))
        )}

        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold mt-6 cursor-pointer"
        >
          {t["Save Languages"]}
        </button>
      </div>
      <AdBanner adKey={AD_KEY} />
      {/* Languages Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.languages_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.languages_tip_one}</li>
          <li>{t.languages_tip_two}</li>
          <li>{t.languages_tip_three}</li>
        </ul>
      </section>
      <AdBanner adKey={AD_KEY} />
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-10 px-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          {t.lang_faq_title}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                <span className="font-semibold text-gray-700">{t[`lang_faq_${num}_q`]}</span>
                <span className="text-teal-500 transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {t[`lang_faq_${num}_a`]}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="max-w-4xl mx-auto mt-10 mb-12 px-5">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {t.lang_mistakes_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="bg-white p-4 rounded-xl border border-red-50 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {t[`lang_mistake_${num}_t`]}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t[`lang_mistake_${num}_d`]}</p>
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
