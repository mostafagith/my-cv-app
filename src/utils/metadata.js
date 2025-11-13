// utils/metadata.js
export function getSiteMetadata(lang = 'en') {
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
      en: "Create your professional CV for free in minutes with professional templates. Download as PDF or share online easily.",
      ar: "أنشئ سيرتك الذاتية مجانًا باحترافية عالية في دقائق. اختر من بين عشرات القوالب الجاهزة وشارك سيرتك بسهولة.",
      fr: "Créez votre CV professionnel gratuitement en quelques minutes avec des modèles professionnels. Téléchargez en PDF ou partagez en ligne facilement.",
      es: "Crea tu CV profesional gratis en minutos con plantillas profesionales. Descarga en PDF o comparte en línea fácilmente.",
      de: "Erstellen Sie Ihren professionellen Lebenslauf kostenlos in Minuten mit professionellen Vorlagen. Laden Sie als PDF herunter oder teilen Sie online.",
      it: "Crea il tuo CV professionale gratuitamente in pochi minuti con modelli professionali. Scarica in PDF o condividi online facilmente.",
      pt: "Crie seu CV profissional gratuitamente em minutos com modelos profissionais. Baixe em PDF ou compartilhe online facilmente.",
    },
    keywords: {
      en: ["CV", "Resume Builder", "Create CV Online", "Professional CV", "Free CV Maker"],
      ar: ["سيرة ذاتية", "إنشاء CV", "صانع السيرة الذاتية", "CV مجاني", "قوالب سيرة ذاتية"],
      fr: ["CV", "Créateur de CV", "CV Professionnel", "CV Gratuit", "Modèles de CV"],
      es: ["CV", "Creador de CV", "CV Profesional", "CV Gratis", "Plantillas de CV"],
      de: ["Lebenslauf", "CV Builder", "Professioneller Lebenslauf", "Kostenloser CV", "Lebenslauf Vorlagen"],
      it: ["CV", "Creatore di CV", "CV Professionale", "CV Gratuito", "Modelli di CV"],
      pt: ["CV", "Criador de CV", "CV Profissional", "CV Grátis", "Modelos de CV"],
    }
  };

  const supportedLangs = ["en", "ar", "fr", "es", "de", "it", "pt"];
  const currentLang = supportedLangs.includes(lang) ? lang : 'en';

  return {
    title: siteMetadata.title[currentLang],
    description: siteMetadata.description[currentLang],
    keywords: siteMetadata.keywords[currentLang].join(', '),
    openGraph: {
      title: siteMetadata.title[currentLang],
      description: siteMetadata.description[currentLang],
      images: ['https://createcvmaster.com/og-image.jpg'],
      type: 'website',
      locale: getLocale(currentLang),
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
  };
}

function getLocale(lang) {
  const locales = {
    en: 'en_US',
    ar: 'ar_EG', 
    fr: 'fr_FR',
    es: 'es_ES',
    de: 'de_DE',
    it: 'it_IT',
    pt: 'pt_BR'
  };
  return locales[lang] || 'en_US';
}