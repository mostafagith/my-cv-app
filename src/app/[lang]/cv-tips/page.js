"use client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function CvTipsPage() {
  const { t, lang, changeLang } = useLanguage();

  return (
    <div className="bg-white">
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
        <div className="max-w-5xl mx-auto my-16 p-8 bg-teal-600 rounded-3xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">{t.cv_cta_title}</h3>
              <p className="mb-6 opacity-90">{t.cv_cta_subtitle}</p>
              <Link href={`/${lang}/create`} className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors">
                  {t.cv_cta_button}
              </Link>
        </div>
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
    </div>
  );
}
