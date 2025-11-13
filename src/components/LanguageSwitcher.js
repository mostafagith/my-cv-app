"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function YourComponent() {
  const { t, lang, changeLang  } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [openLang, setOpenLang] = useState(false);

  const handleLanguageChange = (newLang) => {
    const supportedLanguages = ["en", "ar", "fr", "es", "de", "it", "pt"];
    
    // حفظ اللغة
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
      sessionStorage.setItem("lang", newLang);
      document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
    
    // تحديث state
    changeLang (newLang);
    
    // تغيير URL
    const pathSegments = pathname.split("/").filter(Boolean);
    
    if (supportedLanguages.includes(pathSegments[0])) {
      pathSegments[0] = newLang;
    } else {
      pathSegments.unshift(newLang);
    }

    const newPath = "/" + pathSegments.join("/");
    router.push(newPath);
    setOpenLang(false);
  };

  return (
    <>
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
                onClick={() => handleLanguageChange(langItem.code)}
                className={`block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  langItem.code === "ar" ? "text-right" : "text-left"
                } ${lang === langItem.code ? "bg-blue-50 text-blue-600 font-semibold" : ""}`}
              >
                {langItem.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}