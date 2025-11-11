"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { t, lang, changeLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openLang, setOpenLang] = useState(false);

  const links = [
    { href: "/", label: t.home },
    { href: "/create", label: t.create },
    { href: "/downloads", label: t.downloads },
    { href: "/cv-tips", label: t.cv_tips },
    { href: "/ats-system", label: t.ats_system },
    { href: "/about", label: t.about_us },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLangMenu = () => setOpenLang(!openLang);

  return (
    <nav
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-teal-600 shadow-lg relative py-3 px-5 md:py-6 md:px-20"
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white tracking-wide">
          CV Builder
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Language Button */}
          <li className="relative">
            <button
              onClick={toggleLangMenu}
              className="p-2 bg-white/20 rounded-full cursor-pointer hover:bg-white/30 transition"
            >
              <Globe size={20} className="text-white" />
            </button>

            <AnimatePresence>
              {openLang && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`w-[160px] absolute mt-2 bg-white text-black shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 ${
                    lang === "ar" ? "left-0" : "right-0"
                  }`}
                >
                  {[
                    { code: "en", label: "🇺🇸 English" },
                    { code: "ar", label: "🇸🇦 عربي" },
                    { code: "fr", label: "🇫🇷 Français" },
                    { code: "es", label: "🇪🇸 Español" },
                    { code: "de", label: "🇩🇪 Deutsch" },
                    { code: "it", label: "🇮🇹 Italiano" },
                    { code: "pt", label: "🇵🇹 Português" },
                  ].map(langItem => (
                    <button
                      key={langItem.code}
                      onClick={() => {
                        changeLang(langItem.code);
                        setOpenLang(false);
                      }}
                      className={`block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        langItem.code === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {langItem.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-teal-700 text-white cursor-pointer"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-teal-700 flex flex-col space-y-2 p-4 text-center overflow-hidden"
          >
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-white hover:bg-teal-800 rounded-lg cursor-pointer"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Dropdown in Mobile */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex px-2 items-center cursor-pointer justify-center gap-2 bg-white/20 rounded-lg py-2 hover:bg-white/30 transition text-white"
              >
                <Globe size={18} />
                <span>{t.language || "Language"}</span>
              </button>

              <AnimatePresence>
                {openLang && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 bg-white text-black rounded-lg shadow-lg"
                  >
                    {[
                      { code: "en", label: "🇺🇸 English" },
                      { code: "ar", label: "🇸🇦 عربي" },
                      { code: "fr", label: "🇫🇷 Français" },
                      { code: "es", label: "🇪🇸 Español" },
                      { code: "de", label: "🇩🇪 Deutsch" },
                      { code: "it", label: "🇮🇹 Italiano" },
                      { code: "pt", label: "🇵🇹 Português" },
                    ].map(langItem => (
                      <button
                        key={langItem.code}
                        onClick={() => {
                          changeLang(langItem.code);
                          setOpenLang(false);
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-black cursor-pointer"
                      >
                        {langItem.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
