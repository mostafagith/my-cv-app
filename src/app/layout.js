import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ metadata للـ SEO
export const metadata = {
  title: "Create CV Master",
  description: "Create your professional CV for free",
  keywords: ["CV", "Resume Builder", "سيرة ذاتية", "Create CV Online"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}