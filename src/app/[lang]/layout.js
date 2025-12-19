// app/[lang]/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "./Providers";
import Script from "next/script";

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
    title: "Make CV Master | Free Professional CV Builder",
    description: "Create your CV for free in minutes with professional templates. Download as PDF or share online easily.",
    keywords: [
      "Resume Builder",
      "Free CV maker",
      "Professional Resume templates",
      "Create CV online",
      "Download Resume PDF",
      "Free Resume PDF no watermark",
      "Best online CV builder",
      "Create CV Master", // اسم علامتك التجارية مهم
      "Create CV",
      "Free CV",
      "Free resume"
    ],
  },
  ar: {
    title: "Create CV Master | صانع السيرة الذاتية الاحترافي",
    description: "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة.",
    keywords: [
      "سيرة ذاتية",
      "إنشاء سيرة ذاتية",
      "قوالب سيرة ذاتية مجانية",
      "صانع سيرة ذاتية احترافي",
      "تحميل سيرة ذاتية PDF",
      "أفضل موقع لعمل CV",
      "سيرة ذاتية مجانية بدون علامة مائية",
      "Create CV Master",
    ],
  },
  fr: {
    title: "Créateur de CV Professionnel",
    description: "Créez votre CV gratuitement en quelques minutes avec des modèles professionnels. Téléchargez en PDF ou partagez en ligne facilement.",
    keywords: [
      "Créateur de CV",
      "CV gratuit en ligne",
      "Modèles de CV professionnels",
      "Télécharger CV PDF gratuit",
      "Faire un CV en ligne facile",
      "Create CV Master",
    ],
  },
  es: {
    title: "Creador de CV Profesional",
    description: "Crea tu CV gratis en minutos con plantillas profesionales. Descarga en PDF o comparte en línea fácilmente.",
    keywords: [
      "Creador de CV",
      "CV gratis",
      "Plantillas de CV profesionales",
      "Hacer CV online",
      "Descargar CV en PDF",
      "Create CV Master",
    ],
  },
  de: {
    title: "Professioneller Lebenslauf-Builder",
    description: "Erstellen Sie Ihren Lebenslauf in Minuten kostenlos mit professionellen Vorlagen. Laden Sie als PDF herunter oder teilen Sie online.",
    keywords: [
      "Lebenslauf erstellen kostenlos",
      "Professioneller Lebenslauf-Generator",
      "Lebenslauf-Vorlagen",
      "CV-Vorlagen kostenlos herunterladen",
      "Online CV erstellen ohne Anmeldung",
      "Create CV Master",
    ],
  },
  it: {
    title: "Creatore di CV Professionale",
    description: "Crea il tuo CV gratis in pochi minuti con modelli professionali. Scarica in PDF o condividi online facilmente.",
    keywords: [
      "Crea CV gratis online",
      "Modelli di Curriculum Vitae professionali",
      "Creatore di CV facile",
      "Scarica CV in PDF",
      "Curriculum Vitae Europass",
      "Create CV Master",
    ],
  },
  pt: {
    title: "Criador de CV Profissional",
    description: "Crie seu CV gratuitamente em minutos com modelos profissionais. Baixe em PDF ou compartilhe online facilmente.",
    keywords: [
      "Criar CV online grátis",
      "Modelos de Curriculum Vitae profissionais",
      "Editor de CV fácil",
      "Gerador de CV em PDF",
      "Fazer Curriculo sem pagar",
      "Create CV Master",
    ],
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
    keywords: meta.keywords.join(", "),
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png',
    },
    verification: {
      google: "nflu1RK_Kt_Qi6OnVXQwmqBrr0Y1MmfG5hfJnoWTLbI",
    },
    other: {
      'google-adsense-account': 'ca-pub-4523960515520353',
    },
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
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const currentLang = supportedLanguages.includes(lang) ? lang : "en";
  const direction = currentLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={currentLang} dir={direction}>
      <head>
        <Script
          async="async"
          data-cfasync="false"
          src="https://pl28293521.effectivegatecpm.com/8e7eb342208347d0285973fbe19d2f68/invoke.js"
        ></Script>
        {/* <Script strategy="beforeInteractive" data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js"></Script>
        <Script strategy="beforeInteractive" data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js"></Script>
        <Script
          strategy="beforeInteractive"
          src="//www.ezojs.com/ezoic/sa.min.js"
        />

        <Script strategy="beforeInteractive">
          {`
            window.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
          `}
        </Script> */}

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SZPN97RL4W"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SZPN97RL4W');
          `}
        </Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-355178450"
        />
        <Script id="google-ads-tag">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-355178450');
          `}
        </Script>

        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4523960515520353"
            crossorigin="anonymous">
        </Script>
        <meta name="google-site-verification" content="nflu1RK_Kt_Qi6OnVXQwmqBrr0Y1MmfG5hfJnoWTLbI" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div id="container-8e7eb342208347d0285973fbe19d2f68"></div>
        <Providers lang={currentLang}>
          {children}
        </Providers>
      </body>
    </html>
  );
}