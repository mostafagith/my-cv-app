"use client";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  const { t, lang } = useLanguage();

  return (
    <>
    <Navbar/>
      <div
        className={`min-h-screen bg-gray-50 py-10 px-5 md:px-20 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        <h1 className="text-3xl font-bold text-teal-700 mb-4">
          {t.about_title}
        </h1>
        <div className="text-gray-700 text-lg leading-relaxed">
          {t.about_text.map((paragraph, idx) => (
          <div key={idx}>
            {/* الفقرة العادية */}
            <p className="mb-4">{paragraph}</p>

            {/* إضافة CTA بعد منتصف الفقرات */}
            {idx === Math.floor(t.about_text.length / 3) && (
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

        </div>
      </div>
    </>
  );
}
