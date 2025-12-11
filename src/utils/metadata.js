// utils/metadata.js
export function getSiteMetadata(lang = 'en') {
  const siteMetadata = {
  title: {
    en: "Make CV Master | Professional Free CV Builder",
    ar: "صانع السيرة الذاتية الاحترافي مجانًا",
    fr: "Créateur de CV Professionnel Gratuit",
    es: "Creador de CV Profesional Gratis",
    de: "Professioneller Lebenslauf-Builder Kostenlos",
    it: "Creatore di CV Professionale Gratuito",
    pt: "Criador de CV Profissional Grátis",
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
    en: [
      "CV", "Resume Builder", "Create CV Online", "Professional CV", "Free CV Maker",
      "Free Resume Builder", "Online CV Generator", "ATS Resume", "CV Templates",
      "Download CV PDF", "Best CV Builder","Online CV Creator", "Download CV as PDF",
      "Modern CV Builder", "Simple CV Builder", "Fast CV Creator"
    ],
    ar: [
      "سيرة ذاتية","إنشاء CV","صانع السيرة الذاتية","CV مجاني","قوالب سيرة ذاتية",
      "عمل سيرة ذاتية مجانا","تحميل سيرة ذاتية PDF","سيرة ذاتية احترافية","إنشاء سيرة ذاتية أونلاين",
      "أفضل نماذج السيرة الذاتية","سيرة ذاتية مجانية","إنشاء سيرة ذاتية احترافية","عمل CV اونلاين",
      "قوالب CV جاهزة","تحميل السيرة الذاتية PDF","برنامج سيرة ذاتية","انشاء CV مجانًا",
    ],
    fr: [
      "CV","Créateur de CV","CV Professionnel","CV Gratuit",
      "Modèles de CV",
      "Générateur de CV",
      "Créer CV en ligne",
      "Télécharger CV PDF",
      "Modèles de CV Professionnels",
      "Créateur de CV Gratuit",
      "Créateur de CV en ligne",
      "Faire un CV",
      "CV Moderne",
      "CV Simple",
      "CV Rapide"
    ],
    es: [
      "CV",
      "Creador de CV",
      "CV Profesional",
      "CV Gratis",
      "Plantillas de CV",
      "Generador de CV",
      "Crear CV online",
      "Descargar CV PDF",
      "Modelo de CV Profesional",
      "Creador de CV en línea",
      "Hacer CV Online",
      "Plantillas Profesionales",
      "CV Rápido",
      "CV Moderno"
    ],
    de: [
      "Lebenslauf",
      "CV Builder",
      "Professioneller Lebenslauf",
      "Kostenloser CV",
      "Lebenslauf Vorlagen",
      "Online Lebenslauf erstellen",
      "CV PDF Download",
      "Lebenslauf Generator",
      "Professionelle CV Vorlagen",
      "Lebenslauf Erstellen",
      "Online Lebenslauf",
      "PDF Lebenslauf",
      "Modernes CV",
      "Einfacher Lebenslauf"
    ],
    it: [
      "CV",
      "Creatore di CV",
      "CV Professionale",
      "CV Gratuito",
      "Modelli di CV",
      "Generatore di CV",
      "Creare CV online",
      "Scaricare CV PDF",
      "Modelli Curriculum",
      "Curriculum Professionale",
      "CV Moderno",
      "CV Facile"
    ],
    pt: [
      "CV",
      "Criador de CV",
      "CV Profissional",
      "CV Grátis",
      "Modelos de CV",
      "Gerador de CV",
      "Criar CV online",
      "Baixar CV PDF",
      "Modelos de Currículo",
      "Currículo Profissional",
      "CV Moderno",
      "CV Rápido"
    ],
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