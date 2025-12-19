"use client";
export const dynamic = "force-dynamic";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { blogPostsData } from "@/data/blogData";

import {
  IoArrowBack,
  IoColorPaletteOutline,
  IoEyeOutline,
  IoInformationCircle,
  IoPencil,
} from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { Globe,ArrowRight,Calendar } from "lucide-react";
import Footer from "@/components/Footer";

export default function FinalizeCV() {
  const router = useRouter();
    const trendingPosts = blogPostsData.slice(0, 6);
  
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
  // if (cv.summary?.trim()) completed++;
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
    `/${lang}/select-template?cvTitle=${encodeURIComponent(cvTitle)}&isEditMode=${isEditMode}`
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
                } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
              >
                <button
                  onClick={() => {
                    changeLang("en");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left text-black"
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
            {completionStatus.completed}/{completionStatus.total} {t["sections1"]})
          </p>
        </div>

        {/* CV Title */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            {t["CV Title *"]}
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700" 
            placeholder={t["Please enter a title for your CV"]}
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
          />
        </div>

       

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
          disabled={completionStatus.percentage < 10 || isSaving}
          className={`w-full flex items-center cursor-pointer justify-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
            completionStatus.percentage < 10 || isSaving
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

        {completionStatus.percentage < 10 && (
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
      {/* --- قسم الأسئلة الشائعة (FAQ) --- */}
              <section className="py-16 bg-gray-50 px-4 md:px-20">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    {t.faq_main_title}
                  </h2>
                  <div className="space-y-4">
                    {/* هنا بنعمل Loop على الـ 20 سؤال */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <details 
                        key={i} 
                        className="group bg-white border border-gray-200 rounded-xl shadow-sm transition-all overflow-hidden"
                      >
                        <summary className={`flex items-center justify-between p-4 cursor-pointer list-none font-bold text-gray-800 hover:text-teal-600 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <span className="text-base md:text-lg">{t[`faq_q_${i + 1}`]}</span>
                          <span className="text-teal-500 group-open:rotate-180 transition-transform duration-300">
                            <ArrowRight size={18} className="rotate-90" />
                          </span>
                        </summary>
                        <div className={`px-4 pb-5 text-gray-600 border-t border-gray-50 pt-4 leading-relaxed text-sm md:text-base ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t[`faq_a_${i + 1}`]}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>

              {/* --- قسم نصائح ذهبية للـ CV --- */}
              <section className="py-16 bg-white px-4 md:px-20">
                {/* 2. أهم المقالات */}
                      <section className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                              {t.trending_posts}
                          </h3>
                          <Link href={`/${lang}/blogs`} className="text-teal-600 font-bold flex items-center gap-1 hover:underline">
                            {t.view_all} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {trendingPosts.map((post) => (
                            <Link 
                              href={`/${lang}/blogs/${post.slug}`} 
                              key={post.id}
                              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 transition-all"
                            >
                              <div className="aspect-video overflow-hidden">
                                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={t[post.titleKey]} />
                              </div>
                              <div className="p-4 flex-grow flex flex-col">
                                <span className="text-teal-600 text-[10px] font-black uppercase tracking-tighter mb-2">{t[post.categoryKey]}</span>
                                <h5 className="font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors text-lg mb-4">
                                  {t[post.titleKey]}
                                </h5>
                                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400 text-xs">
                                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                                  <ArrowRight size={14} className={`group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                <div className="max-w-6xl mx-auto text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t.cv_tips_title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t.cv_tips_subtitle}
                  </p>
                </div>

                
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`p-6 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-black mb-4 ${lang === 'ar' ? 'mr-0' : 'ml-0'} mx-auto sm:mx-0`}>
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        {t[`tip_title_${i + 1}`]}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t[`tip_desc_${i + 1}`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
      <Footer/>
    </div>
  );
}
