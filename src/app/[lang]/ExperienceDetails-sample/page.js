'use client';
import AdBanner from '@/components/AdBanner';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { Globe} from "lucide-react";
import Footer from '@/components/Footer';

export default function ExperienceExample() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  // 3 أمثلة جاهزة للخبرات
  const exampleExperiences = [
    {
      company: t.company1,
      jobTitle: t.position1,
      startDate: t.startDate1,
      endDate: t.endDate1,
      details: t.description1,
      location: t.location1,
      employmentType: t.type1
    },
    {
      company: t.company2,
      jobTitle: t.position2,
      startDate: t.startDate2,
      endDate: t.endDate2,
      details: t.description2,
      location: t.location2,
      employmentType: t.type2
    },
    {
      company: t.company3,
      jobTitle: t.position3,
      startDate: t.startDate3,
      endDate: t.endDate3,
      details: t.description3,
      location: t.location3,
      employmentType: t.type3
    },
  ];

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 px-5 py-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-white cursor-pointer text-xl">
          <ChevronRight />
        </button>
        <h1 className="text-white font-bold text-xl flex-1 text-center">{t['experienceExample'] || 'Experience Example'}</h1>
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
        <div className="w-6" /> {/* placeholder */}
      </div>
            {/* Experience Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.experience_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.experience_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.experience_examples_note}
        </p>
      </section>
      <AdBanner adKey={AD_KEY} />
      {/* Content */}
      <div className="max-w-4xl mx-auto p-5 space-y-6">
        <h2 className="text-lg font-bold text-gray-800">{t['exampleWorkExperience'] || 'Example Work Experience'}</h2>

        {exampleExperiences.map((exp, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-teal-500">{t['experience']} {index + 1}</h3>
            <p className='text-black'><span className="font-semibold">{t['companyName'] || 'Company:'}</span> {exp.company}</p>
            <p className='text-black'><span className="font-semibold">{t['jobTitle'] || 'Job Title:'}</span> {exp.jobTitle}</p>
            <p className='text-black'><span className="font-semibold">{t['employmentType'] || 'Employment Type:'}</span> {exp.employmentType}</p>
            <p className='text-black'><span className="font-semibold">{t['location'] || 'Location:'}</span> {exp.location}</p>
            <p className='text-black'>
              <span className="font-semibold">{t['startDate'] || 'Start Date:'}</span> {exp.startDate} | 
              <span className="font-semibold ml-2">{t['endDate'] || 'End Date:'}</span> {exp.endDate}
            </p>
            <p className='text-black'><span className="font-semibold">{t['responsibilitiesAchievements'] || 'Responsibilities & Achievements:'}</span> {exp.details}</p>
          </div>
        ))}
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
      <AdBanner adKey={AD_KEY} />
      <Footer/>
    </div>
  );
}
