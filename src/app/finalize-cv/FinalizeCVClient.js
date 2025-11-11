"use client";
export const dynamic = "force-dynamic";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoArrowBack,
  IoColorPaletteOutline,
  IoEyeOutline,
  IoInformationCircle,
  IoPencil,
} from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function FinalizeCV() {
  const router = useRouter();
const searchParams = useSearchParams();
const { t, lang, changeLang } = useLanguage();

const [cvTitle, setCvTitle] = useState("");
const [completionStatus, setCompletionStatus] = useState({
  completed: 0,
  total: 11,
  percentage: 0,
});
const [isSaving, setIsSaving] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [currentCV, setCurrentCV] = useState(null);
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

// ---------------- Check edit mode ----------------
useEffect(() => {
  if (!searchParams) return;
  const editMode = searchParams.get("isEditMode") === "true";
  setIsEditMode(editMode);
}, [searchParams]);

// ---------------- Load current CV ----------------
useEffect(() => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  setCurrentCV(savedCV);

  if (savedCV) {
    setCvTitle(savedCV.title || `My CV - ${new Date().toLocaleDateString()}`);
    setCompletionStatus(getCompletionStatus(savedCV));
  }
}, []);

// ---------------- Compute completion ----------------
const getCompletionStatus = (cv) => {
  if (!cv) return { completed: 0, total: 11, percentage: 0 };

  let completed = 0;
  const total = 11;

  if (cv.personalDetails?.fullName && cv.personalDetails?.email) completed++;
  if (cv.education?.some((e) => e.course && e.institution)) completed++;
  if (cv.experience?.some((e) => e.company && e.jobTitle)) completed++;
  if (cv.skills?.some((s) => s.name)) completed++;
  if (cv.objective?.trim()) completed++;
  if (cv.hopes?.trim()) completed++;
  if (cv.summary?.trim()) completed++;
  if (cv.references?.some((r) => r.name && r.company)) completed++;
  if (cv.awardsActivities?.length > 0) completed++;
  if (cv.certificates?.length > 0) completed++;
  if (cv.languages?.length > 0) completed++;
  if (cv.projects?.length > 0) completed++;

  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
};

// ---------------- Save CV ----------------
const handleSaveCV = () => {
  if (isSaving) return;

  if (!cvTitle.trim()) {
    toast.error(t["Please enter a title for your CV"]);
    return;
  }

  setIsSaving(true);

  // بيانات الـ CV الحالي
  const cv = {
    ...currentCV,
    id: currentCV?.id || Date.now(),
    title: cvTitle.trim(),
    lastUpdated: new Date().toISOString(),
  };

  // حفظ الـ currentCV
  safeSetItem("currentCV", JSON.stringify(cv));

  // حفظه داخل مجلد cvs
  const existingCvs = JSON.parse(safeGetItem("cvs") || "[]");

  const updatedCvs = existingCvs.some((item) => item.id === cv.id)
    ? existingCvs.map((item) => (item.id === cv.id ? cv : item))
    : [...existingCvs, cv];

  safeSetItem("cvs", JSON.stringify(updatedCvs));

  // توجيه للصفحة التالية
  router.push(
    `/select-template?cvTitle=${encodeURIComponent(cvTitle)}&isEditMode=${isEditMode}`
  );
};

// ---------------- Back with confirmation ----------------
const handleBack = () => {
  if (confirm(t["You have unsaved changes. Are you sure you want to go back?"])) {
    router.back();
  }
};

// ---------------- Preview CV ----------------
const handlePreview = () => {
  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  if (!cv || Object.keys(cv).length === 0) return toast.error(t["No CV data to preview"]);
  router.push(`/preview-cv?cvData=${encodeURIComponent(JSON.stringify(cv))}`);
};


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-teal-500  py-3 px-5 md:py-6 md:px-20 flex items-center justify-between gap-4">
          {/* زر الرجوع */}
          <button onClick={handleBack} className="p-2 flex-shrink-0 cursor-pointer text-white">
            <IoArrowBack size={22} />
          </button>

          {/* العنوان */}
          <h1 className="text-lg font-bold text-center flex-1 text-white">
            {isEditMode ? t["Update CV"] : t["Finalize CV"]}
          </h1>

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


      <div className="flex-1 overflow-y-auto p-6 space-y-6 py-3 px-5 md:py-6 md:px-20">
        {isEditMode && (
          <div className="flex items-center justify-center bg-amber-100 border border-amber-400 p-3 rounded-lg gap-2">
            <IoPencil size={18} className="text-amber-700" />
            <span className="text-amber-700 font-semibold">
              {t["Editing Existing CV"]}
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <h2 className="font-bold text-gray-800 text-base mb-2">
            {isEditMode ? t["Update Progress"] : t["CV Completion"]}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${completionStatus.percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {completionStatus.percentage}% {t["Complete"]} (
            {completionStatus.completed}/{completionStatus.total} {t["sections"]})
          </p>
        </div>

        {/* CV Title */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            {t["CV Title *"]}
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            placeholder={t["Please enter a title for your CV"]}
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
          />
        </div>

        {/* Preview Button
        <button
          onClick={handlePreview}
          className="w-full flex cursor-pointer items-center justify-center gap-2 py-3 border border-teal-300 rounded-xl bg-teal-50 text-teal-600 font-semibold"
        >
          <IoEyeOutline size={20} />
          {t["Preview CV"]}
        </button> */}

        {/* CV Summary */}
        {currentCV && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <h3 className="font-bold mb-2 text-gray-800">{t["CV Summary"]}</h3>
            <p className="text-sm text-gray-700">
              {t["Personal Details"]}:{" "}
              {currentCV.personalDetails?.fullName
                ? "✅ " + t["Complete"]
                : "❌ " + t["Incomplete"]}
            </p>
            <p className="text-sm text-gray-700">
              {t["Education"]}: {currentCV.education?.length || 0} {t["entries"]}
            </p>
            <p className="text-sm text-gray-700">
              {t["Experience"]}: {currentCV.experience?.length || 0} {t["entries"]}
            </p>
            <p className="text-sm text-gray-700">
              {t["Skills"]}: {currentCV.skills?.length || 0} {t["skills"]}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveCV}
          disabled={completionStatus.percentage < 50 || isSaving}
          className={`w-full flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
            completionStatus.percentage < 50 || isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          <IoColorPaletteOutline size={22} />
          {isSaving
            ? t["Preparing..."]
            : isEditMode
            ? t["Choose Template & Update"]
            : t["Choose Template & Save"]}
        </button>

        {completionStatus.percentage < 50 && (
          <p className="text-xs text-red-500 text-center">
            {t["Complete at least 50% of sections to save your CV"]}
          </p>
        )}

        <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg p-3 mt-4">
          <IoInformationCircle size={20} className="text-teal-500" />
          <span className="text-gray-700 text-sm">
            {t["Next step: Choose a beautiful template for your CV"]}
          </span>
        </div>
      </div>
    </div>
  );
}
