'use client';
import AdBanner from '@/components/AdBanner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle, ClipboardList } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe} from "lucide-react";

import toast from "react-hot-toast";
import Footer from '@/components/Footer';

export default function EducationDetails() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);
  const [educations, setEducations] = useState([]);
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

// ---------------- useEffect لتحميل التعليم ----------------
useEffect(() => {
  const cv = JSON.parse(safeGetItem('currentCV') || '{}');
  if (cv.education && cv.education.length > 0) {
    setEducations(cv.education);
  } else {
    setEducations([{
      id: Date.now().toString(),
      course: '',
      degree: '',
      institution: '',
      grade: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false
    }]);
  }
}, []);

// ---------------- دوال التحكم ----------------
const handleBack = () => router.back();

const handleAddEducation = () => {
  setEducations([...educations, {
    id: Date.now().toString(),
    course: '',
    degree: '',
    institution: '',
    grade: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false
  }]);
};

const handleEducationChange = (index, field, value) => {
  const updated = [...educations];
  updated[index][field] = value;
  setEducations(updated);
};

const handleCurrentlyStudyingChange = (index, value) => {
  const updated = [...educations];
  updated[index].isCurrentlyStudying = value;
  updated[index].endDate = value ? t['present'] : '';
  setEducations(updated);
};

const handleRemoveEducation = (index) => {
  if (educations.length === 1) {
    toast.error(t['mustHaveAtLeastOne']);
    return;
  }
  if (confirm(t['confirmRemoveEducation'])) {
    setEducations(educations.filter((_, i) => i !== index));
  }
};

// ---------------- حفظ التعليم ----------------
const handleSave = () => {
  for (let i = 0; i < educations.length; i++) {
    const edu = educations[i];

    if (!edu.course?.trim()) {
      toast.error(`${t['please_enter_course']} (${i + 1})`);
      return;
    }
    if (!edu.degree?.trim()) {
      toast.error(`${t['please_enter_degree']} (${i + 1})`);
      return;
    }
    if (!edu.institution?.trim()) {
      toast.error(`${t['please_enter_institution']} (${i + 1})`);
      return;
    }
    if (!edu.startDate?.trim()) {
      toast.error(`${t['please_enter_start_date']} (${i + 1})`);
      return;
    }
    if (!edu.isCurrentlyStudying && !edu.endDate?.trim()) {
      toast.error(`${t['please_enter_end_date']} (${i + 1})`);
      return;
    }
  }

  const cv = JSON.parse(safeGetItem('currentCV') || '{}');
  cv.education = educations;
  safeSetItem('currentCV', JSON.stringify(cv));

  toast.success(t.saved_successfully || "Saved successfully!"); 
  setTimeout(() => {
    router.back();
  }, 1000);
};


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 px-5 py-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-white cursor-pointer text-xl">
          <ChevronRight />
        </button>
        <h1 className="text-white font-bold text-xl text-center flex-1">{t['educationDetails']}</h1>
        <div className="w-6" /> {/* placeholder */}
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
      </div>

      {/* Content */}
      <div className="p-5 space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push(`/${lang}/EducationDetails-sample`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewEducationExample || "View Education Example"}
        </button>
        <h2 className="text-lg font-bold text-gray-800">{t['educationInformation']}</h2>
        <p className="text-gray-500 text-sm mb-4">{t['addYourEducationalBackground']}</p>

        {educations.map((edu, index) => (
          <div key={edu.id} className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-teal-500">{t['education']} {index + 1}</h3>
              {educations.length > 1 && (
                <button onClick={() => handleRemoveEducation(index)} className="text-red-500 cursor-pointer">
                  <CheckCircle size={20} />
                </button>
              )}
            </div>

            <div className="space-y-2">
  <label className="font-semibold text-gray-700">
    {t['courseFieldOfStudy']} <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={edu.course}
    onChange={e => handleEducationChange(index, 'course', e.target.value)}
    placeholder="e.g. Computer Science"
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
  />
</div>

<div className="space-y-2">
  <label className="font-semibold text-gray-700">
    {t['degree']} <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={edu.degree}
    onChange={e => handleEducationChange(index, 'degree', e.target.value)}
    placeholder="e.g. Bachelor's"
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
  />
</div>

<div className="space-y-2">
  <label className="font-semibold text-gray-700">
    {t['schoolUniversity']} <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={edu.institution}
    onChange={e => handleEducationChange(index, 'institution', e.target.value)}
    placeholder="e.g. Cairo University"
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
  />
</div>

<div className="flex gap-4">
  <div className="flex-1 space-y-2">
    <label className="font-semibold text-gray-700">
      {t['startDate']} <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={edu.startDate}
      onChange={e => handleEducationChange(index, 'startDate', e.target.value)}
      placeholder="e.g. Sep 2020"
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
    />
  </div>
  <div className="flex-1 space-y-2">
    <label className="font-semibold text-gray-700">
      {t['endDate']} {!edu.isCurrentlyStudying && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={edu.endDate}
      onChange={e => handleEducationChange(index, 'endDate', e.target.value)}
      placeholder={edu.isCurrentlyStudying ? t['present'] : 'e.g. Jun 2024'}
      disabled={edu.isCurrentlyStudying}
      className={`w-full border border-gray-300 rounded-md px-3 text-gray-700 py-2 ${edu.isCurrentlyStudying ? 'bg-gray-200 text-gray-500' : ''}`}
    />
  </div>
</div>
<div className="space-y-2"> <label className="font-semibold text-gray-700">{t['gradeScore']}</label> <input type="text" value={edu.grade} onChange={e => handleEducationChange(index, 'grade', e.target.value)} placeholder="e.g. 3.8 GPA" className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700" /> </div>

          </div>
        ))}

        <button
          onClick={handleAddEducation}
          className="flex items-center cursor-pointer justify-center gap-2 border border-teal-500 border-dashed rounded-md py-2 text-teal-500 font-semibold cursor-pointer"
        >
          <ClipboardList size={20} /> {t['addAnotherEducation']}
        </button>

        <button
          onClick={handleSave}
          className="bg-teal-500 w-full cursor-pointer py-3 rounded-md text-white font-bold cursor-pointer"
        >
          {t['saveEducation']}
        </button>
      </div>
      {/* <AdBanner adKey={AD_KEY} /> */}
      {/* Education Tips Section */}
      <section className="max-w-4xl mx-auto mt-12 bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.education_tips_title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t.education_tips_intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-800 mb-1">
              {t.courseFieldOfStudy}
            </h3>
            <p className="text-sm text-gray-600">
              {t.education_field_explain}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-800 mb-1">
              {t.degree}
            </h3>
            <p className="text-sm text-gray-600">
              {t.education_degree_explain}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-800 mb-1">
              {t.schoolUniversity}
            </h3>
            <p className="text-sm text-gray-600">
              {t.education_school_explain}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-800 mb-1">
              {t.startDate} & {t.endDate}
            </h3>
            <p className="text-sm text-gray-600">
              {t.education_dates_explain}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-1">
              {t.gradeScore}
            </h3>
            <p className="text-sm text-gray-600">
              {t.education_grade_explain}
            </p>
          </div>
        </div>

        {/* <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
          <h3 className="font-bold text-teal-700 mb-3">
            💡 {t.education_tips_title}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li>{t.education_tip_one}</li>
            <li>{t.education_tip_two}</li>
            <li>{t.education_tip_three}</li>
            <li>{t.education_tip_four}</li>
          </ul>
        </div> */}
      </section>
{/* Education Examples Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.education_examples_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.education_tip_one}</li>
            <li>{t.education_tip_two}</li>
            <li>{t.education_tip_three}</li>
            <li>{t.education_tip_four}</li>
          <li>{t.education_examples_tip_one}</li>
          <li>{t.education_examples_tip_two}</li>
          <li>{t.education_examples_tip_three}</li>
        </ul>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-10 px-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          {t.edu_faq_title}
        </h2>
        <div className="space-y-4">
          {[
            { q: t.edu_faq_1_q, a: t.edu_faq_1_a },
            { q: t.edu_faq_2_q, a: t.edu_faq_2_a },
          ].map((item, index) => (
            <details key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                <span className="font-semibold text-gray-700">{item.q}</span>
                <span className="text-teal-500 transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">{item.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="max-w-4xl mx-auto mt-10 mb-12 px-5">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {t.edu_mistakes_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { t: t.edu_mistake_1_t, d: t.edu_mistake_1_d },
              { t: t.edu_mistake_2_t, d: t.edu_mistake_2_d },
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {item.t}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{item.d}</p>
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
