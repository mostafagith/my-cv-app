"use client";

import { IoArrowBack } from "react-icons/io5";
import { useLanguage } from '@/context/LanguageContext';
import { Globe} from "lucide-react";
import { useState } from 'react';

export default function SkillsExample() {
    const { t, lang, changeLang } = useLanguage();
    const [openLang, setOpenLang] = useState(false);
    const toggleLangMenu = () => setOpenLang(!openLang);
  const exampleSkills = [
    { id: "1", name: "JavaScript", level: 4 },
    { id: "2", name: "React.js", level: 5 },
    { id: "3", name: "Next.js", level: 4 },
    { id: "4", name: "HTML & CSS", level: 5 },
    { id: "5", name: "Problem Solving", level: 3 },
  ];

  const getLevelDescription = (level) => {
    switch (level) {
      case 1: return t.beginner;
      case 2: return t.basic;
      case 3: return t.intermediate;
      case 4: return t.advanced;
      case 5: return t.expert;
      default: return t.notRated;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-teal-600 text-white p-4 mb-6">
        <button onClick={() => history.back()}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">{t.skillsExample}</h1>
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
        {/* <div className="w-6" /> */}
      </div>

      <div className="space-y-6 p-4 md:p-8">
        {exampleSkills.map((skill, idx) => (
          <div key={skill.id} className="bg-gray-100 p-4 rounded-md border border-gray-200">

            <h2 className="font-semibold text-teal-600 mb-3">
              {t.skill} {idx + 1}
            </h2>

            {/* Skill Name (Read Only) */}
            <input
              type="text"
              value={skill.name}
              readOnly
              className="w-full border rounded-md p-2 mb-3 bg-gray-200 text-gray-700"
            />

            {/* Level Buttons (Disabled) */}
            <div className="flex space-x-2 mb-2">
              {[1,2,3,4,5].map(lvl => (
                <button
                  key={lvl}
                  disabled
                  className={`w-10 h-10 flex items-center justify-center border rounded-md 
                    ${skill.level === lvl ? 'bg-teal-600 text-white' : 'bg-white'}
                  `}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <p className="text-teal-600 text-sm">
              {getLevelDescription(skill.level)}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}
