"use client";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

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
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
