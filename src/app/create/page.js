"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MoreVertical, Trash2, Edit, PlusCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe, Share2, Gift, Bell, Settings, ArrowRight } from "lucide-react";

export default function CreatePage() {
    const { t, lang, changeLang } = useLanguage();

  const [cvs, setCvs] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  // تحميل البيانات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cvs");
    if (saved) setCvs(JSON.parse(saved));
  }, []);

  // حذف CV
  function handleDelete(index) {
    const updated = cvs.filter((_, i) => i !== index);
    setCvs(updated);
    localStorage.setItem("cvs", JSON.stringify(updated));
    setMenuIndex(null);
  }

  // تعديل CV → نحفظه كـ currentCV وندخل على صفحة التعديل
  function handleEdit(cv) {
    localStorage.setItem("currentCV", JSON.stringify(cv));
    window.location.href = "/create-new?isEditMode=true";
  }

  // ➕ إنشاء CV جديد
  function handleCreateNew() {
    localStorage.removeItem("currentCV"); // ✅ امسح الـ CV الحالي
    window.location.href = "/create-new"; // ✅ روح على صفحة الإنشاء
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* العنوان */}
      <header
  className={`relative bg-teal-600 mb-4 shadow-lg flex justify-between items-center py-3 px-5 md:py-6 md:px-20 ${
    "flex-row"
  }`}
>
  {/* العنوان */}
  <h1 className="text-2xl font-extrabold text-white tracking-wide">
    {t.app_title}
  </h1>

  {/* زر اختيار اللغة */}
  <div className="relative">
    <button
      onClick={toggleLangMenu}
      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
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
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇺🇸 en - English
        </button>

        <button
          onClick={() => {
            changeLang("ar");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-right"
        >
          🇸🇦 ar - عربي
        </button>

        <button
          onClick={() => {
            changeLang("fr");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇫🇷 fr - Français
        </button>

        <button
          onClick={() => {
            changeLang("es");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇪🇸 es - Español
        </button>

        <button
          onClick={() => {
            changeLang("de");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇩🇪 de - Deutsch
        </button>

        <button
          onClick={() => {
            changeLang("it");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇮🇹 it - Italiano
        </button>

        <button
          onClick={() => {
            changeLang("pt");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇵🇹 pt - Português
        </button>
      </div>
    )}
  </div>
</header>

      <div className="py-3 px-5 md:py-6 md:px-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold text-teal-700">
            {t.createPageTitle || "My CVs"}
          </h1>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <PlusCircle size={20} />
            <span>{t.createNew || "Create New"}</span>
          </button>
        </div>

        {/* المحتوى */}
        {cvs.length === 0 ? (
          <p className="text-gray-600 text-center mt-20">
            {t.noCvs || "No CVs saved yet."}
          </p>
        ) : (
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
                <h3 className="font-bold text-lg">
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
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* القائمة */}
                  {menuIndex === index && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleEdit(cv)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit size={16} /> {t.edit || "Edit"}
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 size={16} /> {t.delete || "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
