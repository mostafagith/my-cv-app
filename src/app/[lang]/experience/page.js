'use client';
import AdBanner from '@/components/AdBanner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline } from 'react-icons/io5';
import { useLanguage } from '@/context/LanguageContext';
import { Globe} from "lucide-react";

import toast from "react-hot-toast";
import Footer from '@/components/Footer';

export default function ExperienceDetails() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const [experiences, setExperiences] = useState([]);

// ---------------- Safe storage helpers ----------------
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

// ---------------- useEffect لتحميل الخبرات ----------------
useEffect(() => {
  const cv = JSON.parse(safeGetItem('currentCV') || '{}');
  if (cv.experience && cv.experience.length > 0) {
    setExperiences(cv.experience);
  } else {
    setExperiences([{
      id: Date.now().toString(),
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      details: '',
      location: '',
      employmentType: ''
    }]);
  }
}, []);

// ---------------- دوال التحكم ----------------
const handleBack = () => router.back();

const handleChange = (index, field, value) => {
  const updated = [...experiences];
  updated[index][field] = value;
  setExperiences(updated);
};

const handleAddExperience = () => {
  setExperiences([...experiences, {
    id: Date.now().toString(),
    company: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    details: '',
    location: '',
    employmentType: ''
  }]);
};

const handleRemoveExperience = (index) => {
  if (experiences.length === 1) {
    toast.error(t["mustHaveAtLeastOne"]);
    return;
  }
  if (confirm(t['confirmRemoveExperience'])) {
    setExperiences(experiences.filter((_, i) => i !== index));
  }
};

// ---------------- حفظ الخبرات ----------------
const handleSave = () => {
  for (let i = 0; i < experiences.length; i++) {
    const exp = experiences[i];

    if (!exp.company?.trim()) {
      toast.error(`${t.please_enter_company_name} (${i + 1})`);
      return;
    }
    if (!exp.jobTitle?.trim()) {
      toast.error(`${t['please_enter_job_title']} (${i + 1})`);
      return;
    }
  }

  const cv = JSON.parse(safeGetItem('currentCV') || '{}');
  cv.experience = experiences;
  safeSetItem('currentCV', JSON.stringify(cv));

  toast.success(t.saved_successfully); 
  setTimeout(() => {
    router.back();
  }, 1000);
};

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 px-5 py-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-white cursor-pointer text-xl">
          <IoArrowBack />
        </button>
        <h1 className="text-white font-bold text-xl flex-1 text-center">{t['experienceDetails']}</h1>
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
        <div className="w-6" />
      </div>
            {/* {/* <AdBanner adKey={AD_KEY} /> */} */}
        {/* Content */}
        <div className="max-w-4xl mx-auto p-5 space-y-6">
          <button
            onClick={() => router.push(`/${lang}/ExperienceDetails-sample`)}
            className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {t.viewExperienceExample || "View Experience Example"}
          </button>
          <h2 className="text-lg font-bold text-gray-800">{t['workExperience']}</h2>
          <p className="text-gray-500 text-sm mb-4">{t['addYourWorkExperience']}</p>

          {experiences.map((exp, index) => (
            <div key={exp.id} className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-teal-500">{t['experience']} {index + 1}</h3>
                {experiences.length > 1 && (
                  <button onClick={() => handleRemoveExperience(index)} className="text-red-500 cursor-pointer">
                    <IoTrashOutline size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-700">
                  {t['companyName']} <span className="text-red-500">*</span>
                </label>              
                <input
                  type="text"
                  value={exp.company}
                  onChange={e => handleChange(index, 'company', e.target.value)}
                  placeholder={t['companyName']}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-700">
                  {t['jobTitle']} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={e => handleChange(index, 'jobTitle', e.target.value)}
                  placeholder={t['jobTitle']}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="font-semibold text-gray-700">{t['employmentType']}</label>
                  <input
                    type="text"
                    value={exp.employmentType}
                    onChange={e => handleChange(index, 'employmentType', e.target.value)}
                    placeholder="Full-time / Part-time"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-semibold text-gray-700">{t['location']}</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={e => handleChange(index, 'location', e.target.value)}
                    placeholder="Cairo, Egypt"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="font-semibold text-gray-700">{t['startDate']} *</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={e => handleChange(index, 'startDate', e.target.value)}
                    placeholder="Jan 2022"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="font-semibold text-gray-700">{t['endDate']}</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={e => handleChange(index, 'endDate', e.target.value)}
                    placeholder="Dec 2023 / Present"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-700">{t['responsibilitiesAchievements']}</label>
                <textarea
                  value={exp.details}
                  onChange={e => handleChange(index, 'details', e.target.value)}
                  placeholder="Describe your responsibilities, achievements..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 text-gray-700"
                />
                <p className="text-right text-gray-500 text-sm">{exp.details?.length || 0}/500</p>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddExperience}
            className="flex items-center  justify-center gap-2 border border-teal-500 cursor-pointer border-dashed rounded-md py-2 text-teal-500 font-semibold"
          >
            <IoAddCircleOutline size={20} /> {t['addAnotherExperience']}
          </button>

          <button
            onClick={handleSave}
            className="bg-teal-500  w-full py-3 rounded-md text-white font-bold cursor-pointer"
          >
            {t['saveExperience']}
          </button>
        </div>
        {/* Experience Tips */}
        <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-teal-700 mb-4">
            {t.experience_tips_title}
          </h3>
  
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>{t.experience_tip_one}</li>
            <li>{t.experience_tip_two}</li>
            <li>{t.experience_tip_three}</li>
          </ul>
        </section>
        {/* <AdBanner adKey={AD_KEY} /> */}
        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mt-10 px-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
            {t.exp_faq_title}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                  <span className="font-semibold text-gray-700">{t[`exp_faq_${num}_q`]}</span>
                  <span className="text-teal-500 transition-transform group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                  {t[`exp_faq_${num}_a`]}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="max-w-4xl mx-auto mt-10 mb-12 px-5">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {t.exp_mistakes_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="bg-white p-4 rounded-xl border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {t[`exp_mistake_${num}_t`]}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{t[`exp_mistake_${num}_d`]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* <AdBanner adKey={AD_KEY} /> */}
        <Footer/>
    </div>
  );
}
