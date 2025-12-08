"use client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function CvTipsPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 leading-relaxed bg-white">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">
          {t.cv_tips_title}
        </h1>
        <p className="mb-4 text-gray-700">{t.cv_tips_intro}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_design_title}
        </h2>
        <p className="mb-3 text-gray-700">{t.cv_tips_design_desc}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_experience_title}
        </h2>
        <p className="mb-3 text-gray-700">{t.cv_tips_experience_desc}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_skills_title}
        </h2>
        <p className="mb-3 text-gray-700">{t.cv_tips_skills_desc}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_education_title}
        </h2>
        <p className="mb-3 text-gray-700">{t.cv_tips_education_desc}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_ats_title}
        </h2>
        <p className="mb-3 text-gray-700">{t.cv_tips_ats_desc}</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_common_mistakes_title}
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>{t.cv_tips_common_mistake_1}</li>
          <li>{t.cv_tips_common_mistake_2}</li>
          <li>{t.cv_tips_common_mistake_3}</li>
          <li>{t.cv_tips_common_mistake_4}</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
          {t.cv_tips_examples_title}
        </h2>
        <p className="text-gray-700">{t.cv_tips_examples_desc}</p>
      </div>
    </>
  );
}
