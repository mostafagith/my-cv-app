"use client"; import AdBanner from "@/components/AdBanner";
;
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

export default function ReferencesExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  // --- 3 أمثلة ثابتة ---
  const examples = [
    {
      id: "1",
      name: t.ref1Job,
      jobTitle: t.ref1Job,
      company:  t.ref1Company,
      email: t.ref1Email,
      phone: t.ref1Phone,
    },
    {
      id: "2",
      name: t.ref2Job,
      jobTitle: t.ref2Job,
      company:  t.ref2Company,
      email: t.ref2Email,
      phone: t.ref2Phone,
    },
    {
      id: "3",
      name: t.ref3Job,
      jobTitle: t.ref3Job,
      company:  t.ref3Company,
      email: t.ref3Email,
      phone: t.ref3Phone,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-600 text-white flex items-center justify-between px-6 py-5">
        <button onClick={() => router.back()} className="p-2">
          <IoArrowBack size={24} className="cursor-pointer" />
        </button>

        <h1 className="text-xl font-bold">
          {t["referencesExample"] || "References Example"}
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
      {/* References Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.references_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.references_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.references_examples_note}
        </p>
      </section>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {t["professionalReferences"] || "Professional References"}
        </h2>
        <p className="text-gray-500 mb-6">
          {t["Add people who can recommend you professionally"] ||
            "Here are examples of professional references"}
        </p>
            {/* <AdBanner adKey={AD_KEY} /> */}
        {/* Example Cards */}
        {examples.map((ref, index) => (
          <div key={ref.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
            <h3 className="text-teal-600 font-semibold mb-3">
              {t["Reference"]} {index + 1}
            </h3>

            <div className="space-y-2">
              <p className="text-gray-800">
                <span className="font-semibold">{t["Reference's Name"]}: </span>
                {ref.name}
              </p>

              <p className="text-gray-800">
                <span className="font-semibold">{t["Job Title"]}: </span>
                {ref.jobTitle}
              </p>

              <p className="text-gray-800">
                <span className="font-semibold">{t["Company Name"]}: </span>
                {ref.company}
              </p>

              <p className="text-gray-800">
                <span className="font-semibold">{t["Email Address"]}: </span>
                {ref.email}
              </p>

              <p className="text-gray-800">
                <span className="font-semibold">{t["Phone Number"]}: </span>
                {ref.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* References Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.references_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.references_tip_one}</li>
          <li>{t.references_tip_two}</li>
          <li>{t.references_tip_three}</li>
        </ul>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer/>
    </div>
  );
}
