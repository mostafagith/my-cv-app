"use client";
import { IoArrowBack, IoTrophyOutline, IoPeople, IoHeart, IoMedal } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function AwardsExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);

  // --- ثابتة 4 أمثلة ---
  const examples = [
    {
      id: "1",
      type: "Award",
      name: t.bestStudentAward,
      organization: t.cairoUniversity,
      date: "2023",
      description: t.awardDescription,
    },
    {
      id: "2",
      type: t.activity,
      name: t.reactHackathon,
      organization: t.googleDeveloperGroup,
      date: "2024",
      description: t.reactHackathonDescription,
    },
    {
      id: "3",
      type: t.volunteer,
      name: t.charityEventOrganizer,
      organization: t.resalaOrganization,
      date: "2022",
      description: t.charityDescription,
    },
    {
      id: "4",
      type: t.competition,
      name: t.webDesignCompetition,
      organization: t.techZone,
      date: "2023",
      description: t.competitionDescription,
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "Award":
        return <IoTrophyOutline className="text-yellow-500" />;
      case "Activity":
        return <IoPeople className="text-green-500" />;
      case "Volunteer":
        return <IoHeart className="text-red-500" />;
      case "Competition":
        return <IoMedal className="text-purple-500" />;
      default:
        return <IoTrophyOutline />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 hover:bg-teal-600 rounded-full">
          <IoArrowBack size={22} />
        </button>

        <h1 className="text-xl font-bold">{t["Awards Example"] || "Awards Example"}</h1>

        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
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
      {/* Awards & Activities Examples Intro Section */}
<section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-3">
    {t.awards_examples_title}
  </h2>

  <p className="text-gray-600 leading-relaxed mb-4">
    {t.awards_examples_intro}
  </p>

  <p className="text-gray-600 leading-relaxed">
    {t.awards_examples_note}
  </p>
</section>

      {/* Awards Examples Intro Section */}
      <section className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t.awards_examples_title}
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          {t.awards_examples_intro}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {t.awards_examples_note}
        </p>
      </section>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold text-teal-600 mb-6">
          {t.awardsActivitiesExamples || "Awards & Activities Examples"}
        </h1>

        <div className="space-y-3">
          {examples.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-xl flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(item.type)}
                  <span className="font-semibold text-black">{item.name}</span>
                </div>
                <p className="text-gray-600 text-sm">{item.organization}</p>
                {item.date && <p className="text-gray-500 text-xs">{item.date}</p>}
                {item.description && (
                  <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Awards & Activities Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.awards_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.awards_tip_one}</li>
          <li>{t.awards_tip_two}</li>
          <li>{t.awards_tip_three}</li>
        </ul>
      </section>
      <Footer/>
    </div>
  );
}
