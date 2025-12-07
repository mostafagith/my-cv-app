"use client";
import { useState, useEffect } from "react";
import { IoArrowBack, IoTrash, IoPencil, IoAdd, IoCheckmarkCircle } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExampleCertificates() {
    const router = useRouter();

    const { t, lang, changeLang } = useLanguage();
    const [openLang, setOpenLang] = useState(false);
    const toggleLangMenu = () => setOpenLang(!openLang);
  const examples = [
    {
      id: 1,
      name: t.googleDataAnalyticsCertification,
      issuer: t.google,
      date: "2023",
      description:
        t.googleDataAnalyticsDescription,
    },
    {
      id: 2,
      name: t.metaFrontEndCertificate,
      issuer: t.meta,
      date: "2024",
      description:
        t.metaFrontEndDescription,
    },
    {
      id: 3,
      name: t.microsoftAzureFundamentals,
      issuer: t.microsoft,
      date: "2022",
      description:
        t.microsoftAzureDescription,
    },
    {
      id: 4,
      name: t.udacityWebDevelopment,
      issuer: t.udacity,
      date: "2023",
      description:
        t.udacityWebDescription,
    },
    {
      id: 5,
      name: t.courseraPython,
      issuer: t.universityOfMichigan,
      date: "2021",
      description:
        t.courseraPythonDescription,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 hover:bg-teal-600 cursor-pointer rounded-full">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-xl font-bold">{t["Certificates-Example"]|| "Certificates Example"}</h1>
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
      </header>
        <main className="flex-1 p-6 space-y-6">
        <div className="bg-white p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-4">{t.exampleCertificates}</h3>

            <div className="space-y-3">
            {examples.map((cert) => (
                <div
                key={cert.id}
                className="bg-gray-50 border p-4 rounded-xl"
                >
                <p className="font-bold text-gray-900">{cert.name}</p>
                <p className="text-gray-700">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{t.issued} {cert.date}</p>
                <p className="text-sm text-gray-600 mt-2">
                    {cert.description}
                </p>
                </div>
            ))}
            </div>
        </div>
        </main>
    </div>
  );
}
