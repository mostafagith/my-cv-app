// app/[lang]/layout.js (Server Component - بدون "use client")
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const supportedLanguages = ["en", "ar", "fr", "es", "de", "it", "pt"];

const siteMetadata = {
  title: {
    en: "Create CV Master | Professional CV Builder",
    ar: "Create CV Master | صانع السيرة الذاتية الاحترافي",
    fr: "Create CV Master | Créateur de CV Professionnel",
    es: "Create CV Master | Creador de CV Profesional",
    de: "Create CV Master | Professioneller Lebenslauf-Builder",
    it: "Create CV Master | Creatore di CV Professionale",
    pt: "Create CV Master | Criador de CV Profissional",
  },
  description: {
    en: "Create your CV for free in minutes with professional templates. Download as PDF or share online easily.",
    ar: "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة.",
    fr: "Créez votre CV gratuitement en quelques minutes avec des modèles professionnels. Téléchargez en PDF ou partagez en ligne facilement.",
    es: "Crea tu CV gratis en minutos con plantillas profesionales. Descarga en PDF o comparte en línea fácilmente.",
    de: "Erstellen Sie Ihren Lebenslauf in Minuten kostenlos mit professionellen Vorlagen. Laden Sie als PDF herunter oder teilen Sie online.",
    it: "Crea il tuo CV gratis in pochi minuti con modelli professionali. Scarica in PDF o condividi online facilmente.",
    pt: "Crie seu CV gratuitamente em minutos com modelos profissionais. Baixe em PDF ou compartilhe online facilmente.",
  },
};

// ⭐ دي أهم حاجة - generateMetadata للـ SEO
export async function generateMetadata({ params }) {
  const lang = params?.lang || "en";
  const currentLang = supportedLanguages.includes(lang) ? lang : "en";
  
  return {
    title: siteMetadata.title[currentLang],
    description: siteMetadata.description[currentLang],
    keywords: [
      "CV","Resume Builder","سيرة ذاتية","إنشاء CV","Create CV Online",
      "قوالب سيرة ذاتية","Create CV Master","سيرة ذاتية مجانية","Free CV",
      "تحميل PDF","PDF سيره ذاتيه","Free Resume PDF","انشاء سيرة ذاتية PDF",
      "CV مجاني","CV PDF","Resume PDF",
    ],
    openGraph: {
      title: siteMetadata.title[currentLang],
      description: siteMetadata.description[currentLang],
      url: `https://createcvmaster.com/${currentLang}`,
      siteName: 'Create CV Master',
      images: [
        {
          url: 'https://createcvmaster.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Create CV Master',
        },
      ],
      locale: currentLang === 'ar' ? 'ar_EG' : currentLang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata.title[currentLang],
      description: siteMetadata.description[currentLang],
      images: ['https://createcvmaster.com/og-image.jpg'],
    },
    alternates: {
      canonical: `https://createcvmaster.com/${currentLang}`,
      languages: {
        'en': 'https://createcvmaster.com/en',
        'ar': 'https://createcvmaster.com/ar',
        'fr': 'https://createcvmaster.com/fr',
        'es': 'https://createcvmaster.com/es',
        'de': 'https://createcvmaster.com/de',
        'it': 'https://createcvmaster.com/it',
        'pt': 'https://createcvmaster.com/pt',
        'x-default': 'https://createcvmaster.com/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function RootLayout({ children, params }) {
  const lang = params?.lang || "en";
  const currentLang = supportedLanguages.includes(lang) ? lang : "en";
  const direction = currentLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={currentLang} dir={direction}>
      <head>
        {/* hreflang links */}
        <link rel="alternate" hrefLang="en" href="https://createcvmaster.com/en" />
        <link rel="alternate" hrefLang="ar" href="https://createcvmaster.com/ar" />
        <link rel="alternate" hrefLang="fr" href="https://createcvmaster.com/fr" />
        <link rel="alternate" hrefLang="es" href="https://createcvmaster.com/es" />
        <link rel="alternate" hrefLang="de" href="https://createcvmaster.com/de" />
        <link rel="alternate" hrefLang="it" href="https://createcvmaster.com/it" />
        <link rel="alternate" hrefLang="pt" href="https://createcvmaster.com/pt" />
        <link rel="alternate" hrefLang="x-default" href="https://createcvmaster.com/en" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers lang={currentLang}>
          {children}
        </Providers>
      </body>
    </html>
  );
}