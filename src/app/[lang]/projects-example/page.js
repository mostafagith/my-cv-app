"use client";

import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function ProjectsExamplePage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const examples = [
    {
      title: "E-Commerce Web App",
      description:
        "A complete online store with product browsing, cart system, order tracking, and secure payment integration using Stripe.",
      technologies: "React, Next.js, Node.js, MongoDB, Stripe API",
      url: "https://github.com/username/ecommerce",
      date: "2023",
    },
    {
      title: "Real-Time Chat Application",
      description:
        "A real-time chat platform supporting private rooms, user authentication, and instant message updates using WebSockets.",
      technologies: "React, Firebase, Socket.io, TailwindCSS",
      url: "https://github.com/username/chat-app",
      date: "2024",
    },
    {
      title: "Task Management Dashboard",
      description:
        "A Kanban-style dashboard for task tracking with drag-and-drop, analytics, and role-based permissions.",
      technologies: "Next.js, Prisma, PostgreSQL, Zustand",
      url: "https://github.com/username/task-manager",
      date: "2023",
    },
    {
      title: "Portfolio Website",
      description:
        "A modern responsive personal portfolio showing projects, skills, and contact form with email integration.",
      technologies: "Next.js, TailwindCSS, Framer Motion",
      url: "https://github.com/username/portfolio",
      date: "2024",
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
          {t["Projects Example"] || "Projects Examples"}
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

      {/* Content */}
      <div className="p-5 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {t["Projects Examples"] || "Sample Projects"}
        </h2>

        <p className="text-gray-600 mb-6">
          {t["Here are some professional project examples"] ||
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
                {t["Technologies"] || "Technologies"}:
              </span>{" "}
              {p.technologies}
            </p>

            <p className="text-gray-600 mt-1">
              <span className="font-semibold">{t["Year"] || "Year"}:</span>{" "}
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
      </div>

      {/* Back Button */}
      <div className="p-5 border-t bg-white">
        <button
          onClick={() => router.back()}
          className="w-full bg-teal-500 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-teal-600 transition"
        >
          {t["Back"] || "Back"}
        </button>
      </div>
    </div>
  );
}
