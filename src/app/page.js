"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Share2, Gift, Bell, Settings, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useState,useEffect } from "react";

function AdMobBannerPlaceholder() {
  return (
    <div className="bg-gray-100 h-48 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 mx-5 my-5 shadow-inner">
      <span className="text-gray-500 font-semibold text-center p-4">
        Banner Ad Placeholder (Medium Rectangle)
        <br />
        [إعلان هنا]
      </span>
    </div>
  );
}

export default function HomePage() {
  const { t, lang, changeLang } = useLanguage();
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
const [cvs, setCvs] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCvs = JSON.parse(localStorage.getItem("cvs") || "[]");
      setCvs(savedCvs);
    }
  }, []);
  return (
    <div
      className={`min-h-screen bg-gray-50 font-sans transition-all duration-300 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <header className="relative bg-teal-600 shadow-lg flex justify-between items-center py-3 px-5 md:py-6 md:px-20">
  <h1 className="text-2xl font-extrabold text-white tracking-wide">
    {t.app_title}
  </h1>

  {/* Language Icon */}
  <div className="relative flex-shrink-0">
    <button
      onClick={toggleLangMenu}
      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
    >
      <Globe size={22} className="text-white" />
    </button>

    {/* Dropdown Menu */}
    {openLang && (
      <div
        className={`w-[160px] absolute mt-2 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50
          ${lang === "ar" ? "left-0" : "right-0"}
        `}
      >
        <button
          onClick={() => {
            changeLang("en");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇺🇸 en - English
        </button>

        <button
          onClick={() => {
            changeLang("ar");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-right"
        >
          🇸🇦 ar - عربي
        </button>

        <button
          onClick={() => {
            changeLang("fr");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇫🇷 fr - Français
        </button>

        <button
          onClick={() => {
            changeLang("es");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇪🇸 es - Español
        </button>

        <button
          onClick={() => {
            changeLang("de");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇩🇪 de - Deutsch
        </button>

        <button
          onClick={() => {
            changeLang("it");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇮🇹 it - Italiano
        </button>

        <button
          onClick={() => {
            changeLang("pt");
            setOpenLang(false);
          }}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
        >
          🇵🇹 pt - Português
        </button>
      </div>
    )}
  </div>
</header>


      {/* Icons Row */}
      <div className="flex justify-around bg-orange-50 py-4 px-2 shadow-md">
        <IconButton icon={<Share2 />} label={t.ad_test} onClick={() => console.log("Interstitial Ad")} />
        <IconButton icon={<Gift />} label={t.reward} onClick={() => console.log("Rewarded Ad")} />
        <IconButton icon={<Bell />} label={t.notifications} />
        <IconButton icon={<Settings />} label={t.settings} />
      </div>

      {/* Banner Ad Placeholder */}
      <AdMobBannerPlaceholder />

      {/* Main Content */}
      <main className="flex-1 py-3 px-5 md:py-6 md:px-20">
        <div className="mt-5">
          <h2
            className={`text-xl font-bold text-gray-800 mb-4 ${
              lang === "ar" ? "border-r-4 pr-2" : "border-l-4 pl-2"
            } border-teal-600`}
          >
            {t.resume_section}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {cvs.length>0?
            
              <Link
                href="/create"
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
              <span>{t.create}</span>
              <ArrowRight size={24} />
            </Link>

              : 
              <Link
                href="/create-new"
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
              <span>{t.create}</span>
              <ArrowRight size={24} />
            </Link>
        
          }

            <Link
              href="/downloads"
              className="flex-1 bg-gray-600 hover:bg-gray-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
            >
              <span>{t.downloads}</span>
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </main>
      {/* Footer */}
<footer className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-10 mt-20">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center text-center md:text-left">
    
    {/* Logo + Description */}
    <div>
      <h2 className="text-3xl font-bold mb-3 tracking-wide">CV Builder</h2>
      <p className="text-gray-200 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
        {t.footer_description}
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">{t.quick_links}</h3>
      <ul className="space-y-2">
        <li>
          <Link href="/about" className="hover:text-yellow-300 transition-colors">
            {t.about_us}
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="hover:text-yellow-300 transition-colors">
            {t.privacy_policy}
          </Link>
        </li>
        <li>
          <a
            href="https://wa.me/YOUR_NUMBER"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors"
          >
            {t.contact_us}
          </a>
        </li>
      </ul>
    </div>

    {/* Contact / Social
    <div>
      <h3 className="text-lg font-semibold mb-4">{t.follow_us}</h3>
      <div className="flex justify-center md:justify-start gap-5">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
          <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
        </a>
      </div>
    </div> */}

  </div>

  {/* Bottom Section */}
  <div className="border-t border-teal-500 mt-10 pt-4 text-center text-xs text-gray-200">
    © {new Date().getFullYear()} <span className="font-semibold">CV Builder</span>. {t.all_rights_reserved}
  </div>
</footer>



    </div>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center min-w-[70px] space-y-1 p-2 rounded-lg transition duration-200 hover:bg-orange-100 active:bg-orange-200"
    >
      <div className="text-teal-600">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}
