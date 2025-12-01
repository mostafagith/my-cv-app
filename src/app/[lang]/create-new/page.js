"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, CheckCircle, ClipboardList } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";


const SECTION_DEFINITIONS = [
  { key: "personal-details", titleKey: "personal", icon: "person" },
  { key: "education", titleKey: "education", icon: "school" },
  { key: "experience", titleKey: "experience", icon: "briefcase" },
  { key: "skills", titleKey: "skills", icon: "build" },
  { key: "languages", titleKey: "languages", icon: "language" },
  { key: "objective", titleKey: "objective", icon: "file-text" },
  { key: "projects", titleKey: "projects", icon: "folder" },
  { key: "certificates", titleKey: "certificates", icon: "award" },
  { key: "awards-activities", titleKey: "awards", icon: "trophy" },
  { key: "references", titleKey: "references", icon: "users" },
  { key: "hopes", titleKey: "hopes", icon: "users" },
];

export default function CreateNewPage() {
  const { t, lang,changeLang } = useLanguage();
  const router = useRouter();

  const [currentCV, setCurrentCV] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(SECTION_DEFINITIONS.length);

  // Helper: create empty CV template
  function makeEmptyCV() {
    return {
      id: Date.now().toString(),
      title: "",
      personalDetails: {},
      education: [],
      experience: [],
      skills: [],
      languages: [],
      summary: "",
      projects: [],
      certificates: [],
      awardsActivities: [],
      references: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isDraft: true,
    };
  }

// helpers for safe storage
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

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// ------------------------ main logic ------------------------

useEffect(() => {
  const raw = safeGetItem("currentCV");
  console.log(raw, "currentCV raw value");
  if (raw) {
    const parsed = safeParse(raw);
    if (parsed) setCurrentCV(parsed);
    else {
      const empty = makeEmptyCV();
      safeSetItem("currentCV", JSON.stringify(empty));
      setCurrentCV(empty);
    }
  } else {
    const empty = makeEmptyCV();
    safeSetItem("currentCV", JSON.stringify(empty));
    setCurrentCV(empty);
  }
}, []);

// compute completion status
const computeStatus = (cv) => {
  if (!cv) return { completed: 0, total: SECTION_DEFINITIONS.length, percentage: 0 };

  let c = 0;
  if (cv.personalDetails?.fullName && cv.personalDetails?.email) c++;
  if (cv.education?.length && cv.education.some(e => e.course || e.institution)) c++;
  if (cv.experience?.length && cv.experience.some(e => e.company || e.jobTitle)) c++;
  if (cv.skills?.length && cv.skills.some(s => s.name)) c++;
  if (cv.languages?.length && cv.languages.some(l => l.name)) c++;
  if (cv.objective?.trim()) c++;
  if (cv.projects?.length && cv.projects.some(p => p.title)) c++;
  if (cv.certificates?.length && cv.certificates.some(cert => cert.name)) c++;
  if (cv.awardsActivities?.length && cv.awardsActivities.some(a => a.name)) c++;
  if (cv.references?.length && cv.references.some(r => r.name)) c++;
  if (cv.hopes?.trim()) c++;

  const pct = Math.round((c / SECTION_DEFINITIONS.length) * 100);
  return { completed: c, total: SECTION_DEFINITIONS.length, percentage: pct };
};

// update progress whenever currentCV changes
useEffect(() => {
  const status = computeStatus(currentCV);
  setCompleted(status.completed);
  setTotal(status.total);
  setPercentage(status.percentage);
}, [currentCV]);

// navigate to section page: save currentCV then navigate
const openSection = (sectionKey) => {
  const cvToSave = currentCV || makeEmptyCV();
  cvToSave.lastUpdated = new Date().toISOString();
  safeSetItem("currentCV", JSON.stringify(cvToSave));
  router.push(`/${lang}/${encodeURIComponent(sectionKey)}`);
};

// finalize and save CV
const finalizeAndSave = () => {
  try {
    const rawList = safeGetItem("cvs");
    const list = rawList ? safeParse(rawList) || [] : [];
    const cvToSave = currentCV || makeEmptyCV();
    cvToSave.lastUpdated = new Date().toISOString();

    const idx = list.findIndex(item => item.id === cvToSave.id);
    if (idx >= 0) list[idx] = cvToSave;
    else list.unshift(cvToSave);

    safeSetItem("cvs", JSON.stringify(list));
    safeSetItem("currentCV", JSON.stringify(cvToSave));

    router.push(`/${lang}/finalize-cv`);
  } catch (err) {
    console.error("Failed to finalize/save CV", err);
    alert(t.failed_to_save_cv || "Failed to save CV");
  }
};

// reset CV
const resetCV = () => {
  const empty = makeEmptyCV();
  safeSetItem("currentCV", JSON.stringify(empty));
  setCurrentCV(empty);
};


  // small helper to render icon (uses lucide-react icons by name fallback)
  const Icon = ({ name }) => {
    // Simple mapping for few icons; extend if needed
    const map = {
      person: "👤",
      school: "🎓",
      briefcase: "💼",
      build: "🛠️",
      language: "🌐",
      "file-text": "📝",
      folder: "📁",
      award: "🏅",
      trophy: "🏆",
      users: "👥",
    };
    return <span className="text-xl">{map[name] || "📋"}</span>;
  };
  const handleBack = () => {
    router.push(`/${lang}/create`);
  };
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  return (
    <div
      className={`min-h-screen bg-gray-50 ${lang === "ar" ? "text-right" : "text-left"}`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif" }}
    >
      <div className="bg-teal-500 py-3 px-5 md:py-6 md:px-20 flex items-center justify-between mb-4">
        <button onClick={handleBack} className="text-white cursor-pointer text-xl">
          <ChevronRight />
        </button>
        <h1 className="text-white font-bold text-xl text-center flex-1">{t['createNewCv']}</h1>
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
      <div className="w-6" /> {/* placeholder */}
    </div>
      <div className="max-w-5xl mx-auto py-3 px-5 md:py-6 md:px-20">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="w-full sm:w-auto">
                {/* <h1 className="text-2xl font-extrabold text-teal-700">{t.createNewTitle || "Create New CV"}</h1> */}
                <p className="text-sm text-gray-600 mt-1">{t.createNewSubtitle || "Fill sections below to build your CV"}</p>
            </div>

            <div className="flex flex-col  sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                onClick={resetCV}
                className="flex cursor-pointer items-center justify-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm hover:shadow-md w-full sm:w-auto"
                >
                <ClipboardList size={18} />
                <span className="text-sm text-gray-700">{t.reset || "Reset"}</span>
                </button>

                <button
                  onClick={finalizeAndSave}
                  className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-lg text-white w-full sm:w-auto ${
                      percentage < 10 ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  disabled={percentage < 10}
                >
                <CheckCircle size={18} />
                <span>{isNaN(percentage) ? t['save'] : (percentage < 10 ? t['completeMore'] : t['finalizeSave'])}</span>
                </button>
            </div>
        </header>


        {/* Progress */}
        <section className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <CheckCircle size={20} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">{t.progressTitle || "CV Progress"}</div>
                <div className="text-xs text-gray-500">{t.progressSubtitle || `${completed}/${total} ${t.sectionsComplete || "sections complete"}`}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">{percentage}%</div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div className="h-3 rounded-full bg-teal-600 transition-all" style={{ width: `${percentage}%` }} />
          </div>
        </section>

        {/* Sections Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTION_DEFINITIONS.map((sec) => (
            <div key={sec.key} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-2xl">
                    <Icon name={sec.icon} />
                  </div>
                  <div>
                    {/* {console.log(sec.titleKey)} */}
                    <h3 className="font-semibold text-gray-800">{t[sec.titleKey] || sec.titleKey}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t[`${sec.key}Hint`] || ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{/* could show completion indicator per-section */}</span>
                  <button
                    onClick={() => openSection(sec.key)}
                    className="p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                    aria-label={`Open ${sec.key}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
        
      </div>
    </div>
  );
}
