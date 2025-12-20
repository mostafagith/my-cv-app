"use client"; import AdBanner from "@/components/AdBanner";
;
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MoreVertical, Trash2, Edit, PlusCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Share2, Gift, Bell, Settings, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CreatePage() {
    const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const router = useRouter();
  const [cvs, setCvs] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  // Helpers للـ storage
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

// ------------------ استخدام الكود ------------------

// تحميل الـ CVs عند mount
useEffect(() => {
  const saved = safeGetItem("cvs");
  if (saved) setCvs(JSON.parse(saved));
}, []);

// حذف CV
function handleDelete(index) {
  const updated = cvs.filter((_, i) => i !== index);
  setCvs(updated);
  safeSetItem("cvs", JSON.stringify(updated));
  setMenuIndex(null);
}

// تعديل CV → نحفظه كـ currentCV وندخل على صفحة التعديل
function handleEdit(cv) {
  safeSetItem("currentCV", JSON.stringify(cv));
  router.push(`/${lang}/create-new?isEditMode=true`);
}

// إنشاء CV جديد
function handleCreateNew() {
  safeSetItem("currentCV", ""); // امسح الـ CV الحالي
  router.push(`/${lang}/create-new`);
}


  // تنسيق التاريخ
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  return (
    <div className="bg-white">
      <Navbar/>
      <div className="min-h-screen bg-gray-50 font-sans">

        <div className="py-3 px-5 md:py-6 md:px-20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="lg:text-xl font-extrabold text-teal-700 md:text-xl text-sm">
              {t.createPageTitle || "My CVs"}
            </h1>
            <button
              onClick={handleCreateNew}
              className="flex items-center cursor-pointer gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <PlusCircle size={20} />
              <span>{t.createNew || "Create New"}</span>
            </button>
          </div>

          {/* المحتوى */}
          {cvs.length === 0 ? (
            <>
              {/* --- محتوى تعليمي قبل عرض الـ CVs --- */}
              <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-teal-700">{t.downloads_content_title1}</h2>
                {t.downloads_content_paragraphs1.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
                ))}

                <h2 className="text-2xl font-bold text-teal-700">{t.downloads_content_title2}</h2>
                {t.downloads_content_paragraphs2.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
                ))}

                <h2 className="text-2xl font-bold text-teal-700">{t.downloads_content_title3}</h2>
                {t.downloads_content_paragraphs3.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
                ))}

                <h2 className="text-2xl font-bold text-teal-700">{t.downloads_content_title4}</h2>
                {t.downloads_content_paragraphs4.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
                ))}
              </div>
              <AdBanner adKey={AD_KEY} />
              <p className="text-gray-600 text-center mt-20">
                {t.noCvs || "No CVs saved yet."}
              </p>
            </>
          ) : (
            <>
            <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-md space-y-6">
              <h2 className="text-2xl font-bold text-teal-700 text-md">{t.downloads_content_title1}</h2>
              {t.downloads_content_paragraphs1.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}

              <h2 className="text-2xl font-bold text-teal-700 text-md">{t.downloads_content_title2}</h2>
              {t.downloads_content_paragraphs2.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}

              <h2 className="text-2xl font-bold text-teal-700 text-md">{t.downloads_content_title3}</h2>
              {t.downloads_content_paragraphs3.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}

              <h2 className="text-2xl font-bold text-teal-700 text-md">{t.downloads_content_title4}</h2>
              {t.downloads_content_paragraphs4.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}
            </div>
            <AdBanner adKey={AD_KEY} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvs.map((cv, index) => (
                  <div
                    key={cv.id || index}
                    className="relative bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border border-gray-100 hover:shadow-xl transition"
                  >
                    {/* الصورة */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500 mb-4">
                      {cv?.personalDetails?.photoPreview ? (
                        <img
                          src={cv.personalDetails.photoPreview}
                          alt={cv.personalDetails.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-700 text-3xl font-bold">
                          {cv.title?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    {/* الاسم */}
                    <h3 className="font-bold text-lg text-gray-900">
                      {cv.personalDetails?.fullName || cv.title || t.unknown}
                    </h3>

                    {/* الوظيفة */}
                    <p className="text-gray-600 text-sm mb-2">
                      {cv.personalDetails?.jobTitle || "No Job Title"}
                    </p>

                    {/* تاريخ آخر تعديل */}
                    <p className="text-xs text-gray-500 mb-4">
                      Last updated: {formatDate(cv.lastUpdated)}
                    </p>

                    {/* زر الثلاث نقاط */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() =>
                          setMenuIndex(menuIndex === index ? null : index)
                        }
                        className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition"
                      >
                        <MoreVertical className="text-black" size={18} />
                      </button>

                      {/* القائمة */}
                      {menuIndex === index && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleEdit(cv)}
                            className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit size={16} /> {t.edit || "Edit"}
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 size={16} /> {t.delete || "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* --- محتوى تعليمي قبل عرض الـ CVs --- */}


            </>
          )}
        </div>
      </div>
      <AdBanner adKey={AD_KEY} />
      <Footer/>
    </div>
  );
}
