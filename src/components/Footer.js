"use client"; import AdBanner from "@/components/AdBanner";
;
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Facebook, Linkedin } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const router = useRouter();
  const { t, lang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";


  return (
    <footer className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-14 pb-6">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

    {/* Brand & Description */}
    {/* Brand & Description */}
<div>
  <h2 className="text-3xl font-bold mb-3 tracking-wide">CV Builder</h2>

  <p className="text-gray-200 text-sm leading-relaxed">
    {t.footer_description}
  </p>

  <p className="text-gray-200 text-xs mt-4 leading-relaxed">
    {t.footer_trust_note}
  </p>

  {/* Social Links */}
  <div className="mt-5">
    <p className="text-sm font-semibold mb-3">
      {t.footer_follow_us}
    </p>

    <div className="flex gap-4 items-center">
      {/* Facebook */}
      <a
        href="https://www.facebook.com/share/16rc2ahrzj/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="hover:text-yellow-300 transition"
      >
        <Facebook size={26} />
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/company/create-cv-master/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="hover:text-yellow-300 transition"
      >
        <Linkedin size={26} />
      </a>

      {/* WhatsApp Channel */}
      <a
        href="https://whatsapp.com/channel/0029Vb75JiVJZg46zClB1H0p"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Channel"
        className="hover:text-yellow-300 transition"
      >
        <FaWhatsapp size={26} />
      </a>

      <a
        href="https://t.me/createcv"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="hover:text-yellow-300 transition"
      >
        <FaTelegram size={26} />
      </a>
    </div>

    {/* WhatsApp Contact */}
    <a
      href="https://wa.me/201016495415"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-4 text-sm text-gray-200 hover:text-yellow-300 transition"
    >
      <FaWhatsapp size={24} />
      {t.footer_contact_whatsapp}
    </a>
  </div>
</div>


    {/* Why Us */}
    <div>
      <h3 className="text-lg font-semibold mb-4">{t.footer_why_title}</h3>
      <ul className="space-y-2 text-sm text-gray-100">
        <li>✔ {t.footer_feature_1}</li>
        <li>✔ {t.footer_feature_2}</li>
        <li>✔ {t.footer_feature_3}</li>
        <li>✔ {t.footer_feature_4}</li>
      </ul>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">{t.quick_links}</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href={`${lang}/about`} className="hover:text-yellow-300 transition-colors">
            {t.about_us}
          </Link>
        </li>
        <li>
          <Link href={`${lang}/privacy`} className="hover:text-yellow-300 transition-colors">
            {t.privacy_policy}
          </Link>
        </li>
        <li>
          <a
            href="https://wa.me/201016495415"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors"
          >
            {t.contact_us}
          </a>
        </li>
      </ul>
    </div>

    {/* Usage Note */}
    <div>
      <h3 className="text-lg font-semibold mb-4">{t.footer_usage_title}</h3>
      <p className="text-gray-200 text-sm leading-relaxed">
        {t.footer_usage_desc}
      </p>
    </div>
  </div>

  <div className="border-t border-teal-500 mt-8 pt-4 text-center text-xs text-gray-200">
    © {new Date().getFullYear()} <span className="font-semibold">CV Builder</span>. {t.all_rights_reserved}
  </div>
</footer>
  );
}
