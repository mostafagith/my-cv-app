"use client"; import AdBanner from "@/components/AdBanner";
;

import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProjectsExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const examples = [
    {
      title: t.project1_title,
      description: t.project1_description,
      technologies: t.project1_technologies,
      url: t.project1_url,
      date: t.project1_year,
    },
    {
      title: t.project2_title,
      description: t.project2_description,
      technologies: t.project2_technologies,
      url: t.project2_url,
      date: t.project2_year,
    },
    {
      title: t.project3_title,
      description: t.project3_description,
      technologies: t.project3_technologies,
      url: t.project3_url,
      date: t.project3_year,
    },
    {
      title: t.project4_title,
      description: t.project4_description,
      technologies: t.project4_technologies,
      url: t.project4_url,
      date: t.project4_year,
    },
  ];

  return (
    <div
      className="min-h-screen bg-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <div className="bg-teal-500 text-white flex items-center justify-between px-5 py-5">
        <button onClick={() => router.back()}>
          <IoArrowBack size={24} className="cursor-pointer" />
        </button>
        <h1 className="text-xl font-bold">
          {t["projectsExamples"] || "Projects Examples"}
        </h1>

        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
          >
            <Globe size={22} className="text-white" />
          </button>

          {openLang && (
            <div
              className={`w-[160px] absolute mt-2 ${
                lang === "ar" ? "left-0" : "right-0"
              } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
            >
              {["en", "ar", "fr", "es", "de", "it", "pt"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    changeLang(lng);
                    setOpenLang(false);
                  }}
                  className={`block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer ${
                    lng === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {lng === "en" && "🇺🇸 English"}
                  {lng === "ar" && "🇸🇦 عربي"}
                  {lng === "fr" && "🇫🇷 Français"}
                  {lng === "es" && "🇪🇸 Español"}
                  {lng === "de" && "🇩🇪 Deutsch"}
                  {lng === "it" && "🇮🇹 Italiano"}
                  {lng === "pt" && "🇵🇹 Português"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <AdBanner adKey={AD_KEY} /> */}
      {/* Projects Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.projects_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.projects_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.projects_examples_note}
        </p>
      </section>
      {/* Content */}
      <div className="max-w-4xl mx-auto p-5 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t["projectsExamples"] || "Sample Projects"}
        </h2>

        <p className="text-gray-600 mb-6">
          {t["projectsSubtext"] ||
            "Here are 4 ready examples you can use for your CV:"}
        </p>

        {examples.map((p, i) => (
          <div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
          >
            <h3 className="text-lg font-bold text-teal-600">
              {i + 1}. {p.title}
            </h3>

            <p className="text-gray-700 mt-2">{p.description}</p>

            <p className="text-gray-600 mt-2">
              <span className="font-semibold">
                {t["technologies"] || "Technologies"}:
              </span>{" "}
              {p.technologies}
            </p>

            <p className="text-gray-600 mt-1">
              <span className="font-semibold">{t["year"] || "Year"}:</span>{" "}
              {p.date}
            </p>

            <a
              href={p.url}
              target="_blank"
              className="text-blue-600 underline mt-2 block"
            >
              {p.url}
            </a>
          </div>
        ))}
      {/* Back Button */}
      <div className="p-5 border-t bg-white">
        <button
          onClick={() => router.back()}
          className="w-full bg-teal-500 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-teal-600 transition"
        >
          {t["back"] || "Back"}
        </button>
      </div>
      </div>
        {/* <AdBanner adKey={AD_KEY} /> */}
      {/* Projects Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.projects_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.projects_tip_one}</li>
          <li>{t.projects_tip_two}</li>
          <li>{t.projects_tip_three}</li>
        </ul>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer/>
    </div>
  );
}
