"use client";
import { useLanguage } from "@/hooks/useLanguage";

export default function AboutPage() {
  const { t, lang } = useLanguage();

  return (
    <div
      className={`min-h-screen bg-gray-50 py-10 px-5 md:px-20 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h1 className="text-3xl font-bold text-teal-600 mb-5">
        {t.about_title}
      </h1>
      <p className="text-gray-700 text-lg leading-relaxed">{t.about_text}</p>
    </div>
  );
}
