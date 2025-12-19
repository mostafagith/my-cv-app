// app/sitemap.js
import { blogPostsData } from "@/data/blogData";

const languages = ['en', 'ar', 'fr', 'de', 'es', 'it', 'pt'];
const staticPages = [
  { path: '', priority: 1.0 },
  { path: '/downloads', priority: 0.9 },
  { path: '/create', priority: 0.9 },
  { path: '/cv-tips', priority: 0.7 },
  { path: '/about', priority: 0.5 },
  { path: '/privacy', priority: 0.5 },
];

export default async function sitemap() {
  const baseUrl = "https://www.createcvmaster.com";
  const sitemapUrls = [];

  // 1. إضافة الصفحات الثابتة لكل اللغات
  for (const page of staticPages) {
    for (const lang of languages) {
      sitemapUrls.push({
        url: `${baseUrl}/${lang}${page.path}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: page.priority,
      });
    }
  }

  // 2. إضافة جميع المقالات (20 مقال × 7 لغات = 140 رابط)
  for (const post of blogPostsData) {
    for (const lang of languages) {
      sitemapUrls.push({
        url: `${baseUrl}/${lang}/blogs/${post.slug}`,
        lastModified: new Date(post.date), // استخدام تاريخ المقال الحقيقي
        changeFrequency: 'daily',
        priority: 0.8, // أولوية عالية للمقالات
      });
    }
  }

  return sitemapUrls;
}