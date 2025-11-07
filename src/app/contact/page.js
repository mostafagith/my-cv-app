"use client";
import { useLanguage } from "@/hooks/useLanguage";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const { t, lang } = useLanguage();

  const phoneNumber = "201234567890"; // 👈 رقمك بدون +

  return (
    <div
      className={`min-h-screen bg-gray-50 py-10 px-5 md:px-20 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h1 className="text-3xl font-bold text-teal-600 mb-5">
        {t.contact_title}
      </h1>
      <p className="text-gray-700 text-lg mb-6">{t.contact_text}</p>

      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition"
      >
        <FaWhatsapp size={24} />
        {t.contact_whatsapp}
      </a>
    </div>
  );
}
