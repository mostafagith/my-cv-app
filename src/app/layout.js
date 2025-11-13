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

export const metadata = {
  title: "Create CV Master | صانع السيرة الذاتية الاحترافي",
  description:
    "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة. موقع Create CV Master هو أفضل أداة لإنشاء سيرة ذاتية مميزة أونلاين.",
  keywords: [
  "CV",
  "Resume Builder",
  "سيرة ذاتية",
  "إنشاء CV",
  "Create CV Online",
  "قوالب سيرة ذاتية",
  "Create CV Master",
  "سيرة ذاتية مجانية",
  "Free CV",
  "تحميل PDF",
  "PDF سيره ذاتيه",
  "Free Resume PDF",
  "انشاء سيرة ذاتية PDF",
  "CV مجاني",
  "CV PDF",
  "Resume PDF",
],
  authors: [{ name: "Create CV Master Team" }],
  openGraph: {
    title: "Create CV Master | أنشئ سيرتك الذاتية مجانًا",
    description:
      "أنشئ سيرة ذاتية احترافية بخطوات بسيطة وشاركها PDF أو عبر الرابط. أفضل موقع لإنشاء CV مجاني.",
    // url: "https://createcvmaster.com",
    siteName: "Create CV Master",
    images: [
      {
        // url: "https://createcvmaster.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Create CV Master - صانع السيرة الذاتية",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </LanguageProvider>
      </body>
    </html>
  );
}
