"use client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AtsSystemPage() {
  const { t, lang, changeLang } = useLanguage();

  return (
    <div className="bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 leading-relaxed bg-white">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">
          {t.ats_title}
        </h1>

        <p className="mb-4 text-gray-700">{t.ats_intro}</p>
        {[...Array(10)].map((_, i) => (
            <div key={i}>
              {/* العنصر العادي */}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
                {t[`ats_${i + 1}_title`]}
              </h2>
              <p className="mb-3 text-gray-700">{t[`ats_${i + 1}_text`]}</p>

              {/* إضافة CTA بعد العنصر الخامس */}
              {i === 3 && (
                <div className="max-w-5xl mx-auto my-16 p-8 bg-teal-600 rounded-3xl text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">{t.cv_cta_title}</h3>
                  <p className="mb-6 opacity-90">{t.cv_cta_subtitle}</p>
                  <Link
                    href={`/${lang}/create`}
                    className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors"
                  >
                    {t.cv_cta_button}
                  </Link>
                </div>
              )}
            </div>
          ))}


        <p className="mt-6 text-gray-700 italic">{t.ats_conclusion}</p>
      </div>
    </div>
  );
}
