const languages = ['en', 'ar', 'fr', 'de', 'es', 'it', 'pt']; // رموز اللغات
const pages = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/downloads', changeFrequency: 'daily', priority: 0.9 },
  { path: '/create', changeFrequency: 'daily', priority: 0.9 },
  { path: '/cv-tips', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/create-new', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/personal-details', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/education', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/experience', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/skills', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/languages', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/objective', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/projects', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/certificates', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/awards-activities', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/references', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/hopes', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/finalize-cv', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/select-template', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/select-template-preview', changeFrequency: 'monthly', priority: 0.7 },
];


export default async function sitemap() {
  const sitemapUrls = [];

  for (const page of pages) {
    for (const lang of languages) {
      // استثناء الصفحة الرئيسية للغة العربية بدون /ar
      const url = `https://www.createcvmaster.com/${lang}${page.path}`
        // lang === 'ar' && page.path === '/' 
        //   ? `https://www.createcvmaster.com/`
        //   : `https://www.createcvmaster.com/${lang}${page.path}`;
      
      sitemapUrls.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return sitemapUrls;
}
