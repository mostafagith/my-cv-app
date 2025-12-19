'use client';

import { useState, useEffect } from 'react';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Globe} from "lucide-react";
import Footer from '@/components/Footer';

export default function EducationExample() {
    const router = useRouter();
    const { t, lang, changeLang } = useLanguage();
    const [openLang, setOpenLang] = useState(false);
    const toggleLangMenu = () => setOpenLang(!openLang);

  // 3 أمثلة جاهزة للتعليم
  const exampleEducations = [
    {
      course: t.computerScience,
      degree: t.bachelor,
      institution: t.cairoUniversity,
      grade: t.gpa38,
      startDate: t.sep2018,
      endDate: t.jun2022,
      isCurrentlyStudying: false
    },
    {
      course: t.softwareEngineering,
      degree: t.master,
      institution: t.ainShamsUniversity,
      grade: t.gpa40,
      startDate: t.sep2022,
      endDate: t.jun2024,
      isCurrentlyStudying: true
    },
    {
      course: t.dataScience,
      degree: t.phd,
      institution: t.mit,
      grade: '',
      startDate: t.sep2024,
      endDate: '',
      isCurrentlyStudying: true
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
        <h1 className="text-white font-bold text-xl text-center flex-1">{t['educationExample'] || 'Education Example'}</h1>
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

      

      {/* Education Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.education_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.education_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.education_examples_note}
        </p>
      </section>

      {/* Content */}
      <div className=" max-w-4xl mx-auto p-5 space-y-6">
        <h2 className="text-lg font-bold text-gray-800">{t['exampleEducationalBackground'] || 'Example Educational Background'}</h2>

        {exampleEducations.map((edu, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-teal-500">{t['education']} {index + 1}</h3>
            <p className='text-black'><span className="font-semibold">{t['courseFieldOfStudy'] || 'Course:'}</span> {edu.course}</p>
            <p className='text-black'><span className="font-semibold">{t['degree'] || 'Degree:'}</span> {edu.degree}</p>
            <p className='text-black'><span className="font-semibold">{t['schoolUniversity'] || 'Institution:'}</span> {edu.institution}</p>
            <p className='text-black'><span className="font-semibold">{t['gradeScore'] || 'Grade:'}</span> {edu.grade || '-'}</p>
            <p className='text-black'>
              <span className="font-semibold">{t['startDate'] || 'Start Date:'}</span> {edu.startDate} | 
              <span className="font-semibold ml-2">{t['endDate'] || 'End Date:'}</span> {edu.isCurrentlyStudying ? t['present'] || 'Present' : edu.endDate}
            </p>
          </div>
        ))}

      </div>
      
      {/* Education Examples Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.education_examples_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.education_examples_tip_one}</li>
          <li>{t.education_examples_tip_two}</li>
          <li>{t.education_examples_tip_three}</li>
        </ul>
      </section>
      <Footer/>
    </div>
  );
}
