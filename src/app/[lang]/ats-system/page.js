"use client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
export default function AtsSystemPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 leading-relaxed bg-white">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">
          {t.ats_title}
        </h1>

        <p className="mb-4 text-gray-700">{t.ats_intro}</p>

        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
              {t[`ats_${i + 1}_title`]}
            </h2>
            <p className="mb-3 text-gray-700">{t[`ats_${i + 1}_text`]}</p>
          </div>
        ))}

        <p className="mt-6 text-gray-700 italic">{t.ats_conclusion}</p>
      </div>
    </>
  );
}
