"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function SamplePersonalDetailsPage() {
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const router = useRouter();

  const toggleLangMenu = () => setOpenLang(!openLang);
const handleBack = () => router.back();
  // 🔥 بيانات جاهزة (Demo)
  const sampleData = {
    fullName: t.fullName,
    email: t.emailex,
    phone: t.phoneex,
    address: t.addressex,
    website: t.websiteex,
    jobTitle: t.jobTitleex,
    summary: t.bio,
    photoPreview:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-500 text-white py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
            <button onClick={handleBack} className="p-2 hover:text-gray-200 cursor-pointer">
                <IoArrowBack size={22} />
            </button>
          <h1 className="text-xl font-bold">{t.personal_details} (Demo)</h1>

          {/* زر اختيار اللغة */}
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
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left cursor-pointer text-black"
                  >
                    {lng}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Personal Details Examples Intro Section */}
<section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-3">
    {t.personal_examples_title}
  </h2>

  <p className="text-gray-600 leading-relaxed mb-4">
    {t.personal_examples_intro}
  </p>

  <p className="text-gray-600 leading-relaxed">
    {t.personal_examples_note}
  </p>
</section>

      {/* Page Content */}
      <main className="max-w-4xl mx-auto container mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          
          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              {t.profile_photo}
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={sampleData.photoPreview}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-[50%] border-4 border-teal-500 object-cover"
              />
            </div>
          </div>

          {/* Inputs Preview */}
          <div className="grid md:grid-cols-2 gap-5">
            <ReadOnlyField label={t.full_name} value={sampleData.fullName} />
            <ReadOnlyField label={t.email} value={sampleData.email} />
            <ReadOnlyField label={t.phone} value={sampleData.phone} />
            <ReadOnlyField label={t.address} value={sampleData.address} />
            <ReadOnlyField label={t.website} value={sampleData.website} />
            <ReadOnlyField label={t.job_title} value={sampleData.jobTitle} />
          </div>

          {/* Summary */}
          <div className="mt-5">
            <label className="block text-gray-700 font-semibold mb-2">
              {t.summary}
            </label>
            <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {sampleData.summary}
            </div>
          </div>
        </div>
      </main>
      
<section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 border border-gray-200 space-y-6 mb-8">
      {/* عنوان القسم */}
      <div>
        <h2 className="text-2xl font-bold text-teal-600 mb-2">{t.personal_info_best_title}</h2>
        <p className="text-gray-700">{t.personal_info_best_intro}</p>
      </div>

      {/* التلميحات */}
      <Tip text={t.tip_photo} />
      <Tip text={t.tip_fullName} />
      <Tip text={t.tip_email} />
      <Tip text={t.tip_phone} />
      <Tip text={t.tip_address} />
      <Tip text={t.tip_website} />
      <Tip text={t.tip_jobTitle} />
      <Tip text={t.tip_summary} />

      {/* نص إضافي */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-700">
        {t.personal_info_extra}
      </div>
    </section>
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.personal_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.personal_tip_one}</li>
          <li>{t.personal_tip_two}</li>
          <li>{t.personal_tip_three}</li>
        </ul>
      </section>
      <Footer/>
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-700">
      {text}
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <div className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
        {value}
      </div>
    </div>
  );
}
