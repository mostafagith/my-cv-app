// app/[lang]/layout.js
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

const metadata = {
  en: {
    title: "Create CV Master | Professional CV Builder",
    description: "Create your CV for free in minutes with professional templates. Download as PDF or share online easily.",
  },
  ar: {
    title: "Create CV Master | صانع السيرة الذاتية الاحترافي",
    description: "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة.",
  },
  fr: {
    title: "Create CV Master | Créateur de CV Professionnel",
    description: "Créez votre CV gratuitement en quelques minutes avec des modèles professionnels. Téléchargez en PDF ou partagez en ligne facilement.",
  },
  es: {
    title: "Create CV Master | Creador de CV Profesional",
    description: "Crea tu CV gratis en minutos con plantillas profesionales. Descarga en PDF o comparte en línea fácilmente.",
  },
  de: {
    title: "Create CV Master | Professioneller Lebenslauf-Builder",
    description: "Erstellen Sie Ihren Lebenslauf in Minuten kostenlos mit professionellen Vorlagen. Laden Sie als PDF herunter oder teilen Sie online.",
  },
  it: {
    title: "Create CV Master | Creatore di CV Professionale",
    description: "Crea il tuo CV gratis in pochi minuti con modelli professionali. Scarica in PDF o condividi online facilmente.",
  },
  pt: {
    title: "Create CV Master | Criador de CV Profissional",
    description: "Crie seu CV gratuitamente em minutos com modelos profissionais. Baixe em PDF ou compartilhe online facilmente.",
  },
};

// ⭐⭐⭐ generateMetadata - MUST be async
export async function generateMetadata({ params }) {
  // استخرج اللغة من الـ params
  const { lang } = await params;
  const currentLang = supportedLanguages.includes(lang) ? lang : "en";
  const meta = metadata[currentLang];

  return {
    title: meta.title,
    description: meta.description,
    keywords: "CV, Resume Builder, سيرة ذاتية, إنشاء CV, Create CV Online, قوالب سيرة ذاتية, Create CV Master, سيرة ذاتية مجانية, Free CV, تحميل PDF, PDF سيره ذاتيه, Free Resume PDF, انشاء سيرة ذاتية PDF, CV مجاني, CV PDF, Resume PDF",
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    verification: {
      google: "nflu1RK_Kt_Qi6OnVXQwmqBrr0Y1MmfG5hfJnoWTLbI",
    },
    other: [
      { name: "google-adsense-account", content: "ca-pub-4523960515520353" }
    ],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://createcvmaster.com/${currentLang}`,
      siteName: "Create CV Master",
      images: [
        {
          url: "https://createcvmaster.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Create CV Master",
        },
      ],
      locale: currentLang === "ar" ? "ar_EG" : currentLang,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["https://createcvmaster.com/og-image.jpg"],
    },

    alternates: {
      canonical: `https://createcvmaster.com/${currentLang}`,
      languages: {
        en: "https://createcvmaster.com/en",
        ar: "https://createcvmaster.com/ar",
        fr: "https://createcvmaster.com/fr",
        es: "https://createcvmaster.com/es",
        de: "https://createcvmaster.com/de",
        it: "https://createcvmaster.com/it",
        pt: "https://createcvmaster.com/pt",
        "x-default": "https://createcvmaster.com/en",
      },
    },

    robots: {
      index: true,
      follow: true,
    },

    // إضافة verification tags لو عندك
    // verification: {
    //   google: 'your-google-verification-code',
    // },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const currentLang = supportedLanguages.includes(lang) ? lang : "en";
  const direction = currentLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={currentLang} dir={direction}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Head>
          <meta name="google-adsense-account" content="ca-pub-4523960515520353" />
        </Head>
        <Providers lang={currentLang}>
          {children}
        </Providers>
      </body>
    </html>
  );
}