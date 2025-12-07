"use client";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function ReferencesExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  // --- 3 أمثلة ثابتة ---
  const examples = [
    {
      id: "1",
      name: "Ahmed Hassan",
      jobTitle: "Senior Software Engineer",
      company: "Microsoft",
      email: "ahmed.hassan@microsoft.com",
      phone: "+20 100 123 4567",
    },
    {
      id: "2",
      name: "Sarah Ali",
      jobTitle: "Project Manager",
      company: "Vodafone",
      email: "sarah.ali@vodafone.com",
      phone: "+20 115 987 6543",
    },
    {
      id: "3",
      name: "John Miller",
      jobTitle: "Team Leader",
      company: "IBM",
      email: "john.miller@ibm.com",
      phone: "+1 202 555 0198",
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
          {t["References Example"] || "References Example"}
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

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {t["Professional References"] || "Professional References"}
        </h2>
        <p className="text-gray-500 mb-6">
          {t["Add people who can recommend you professionally"] ||
            "Here are examples of professional references"}
        </p>

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
    </div>
  );
}
