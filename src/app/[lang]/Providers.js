// app/[lang]/Providers.js
"use client";

import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Providers({ children, lang }) {
  return (
    <LanguageProvider initialLang={lang}>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </LanguageProvider>
  );
}