"use client"; import AdBanner from "@/components/AdBanner";
;

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/Footer";
import { Calendar, User, Clock, Tag, ArrowRight } from "lucide-react";
import React from "react";
import { blogPostsData } from "@/data/blogData";
import Link from "next/link";

export default function BlogPostDetail({ params }) {
  const router = useRouter();
  const { t, lang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const { slug } = React.use(params);
  
  const postIndex = blogPostsData.findIndex((p) => p.slug === slug);
  const postData = blogPostsData[postIndex];

  // مقال مقترح (المقال التالي في القائمة)
  const nextPost = blogPostsData[(postIndex + 1) % blogPostsData.length];
  
  // أهم 6 مقالات (باستثناء المقال الحالي)
  const trendingPosts = blogPostsData
    .filter(p => p.slug !== slug)
    .slice(0, 6);

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">{t.post_not_found}</p>
      </div>
    );
  }

  // --- إضافة الـ JSON-LD لتحسين أرشفة جوجل (Rich Snippets) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": t[postData.titleKey],
    "description": t[postData.excerptKey],
    "image": postData.image,
    "datePublished": postData.date,
    "author": {
      "@type": "Organization",
      "name": "Create CV Master"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Create CV Master",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.createcvmaster.com/logo.png" // تأكد من صحة مسار شعارك
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.createcvmaster.com/${lang}/blogs/${slug}`
    }
  };

  return (
    <div className={`min-h-screen bg-white ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* حقن بيانات جوجل المنظمة (Hidden Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition cursor-pointer"
        >
          <IoArrowBack size={24} className={lang === 'ar' ? 'rotate-180' : ''} /> 
          <span className="font-medium">{t.back_to_blog}</span>
        </button>
        <Link href={`/${lang}/create`} className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors">
                {t.cv_cta_button}
            </Link>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* محتوى المقال الحالي */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-teal-600 font-bold text-sm mb-4">
            <span className="bg-teal-50 px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 border border-teal-100">
              <Tag size={14} /> {t[postData.categoryKey]}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-[1.3]">{t[postData.titleKey]}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-y py-5 border-gray-100">
            <span className="flex items-center gap-2"><Calendar size={16} /> {postData.date}</span>
            <span className="flex items-center gap-2"><User size={16} /> {t.admin}</span>
            <span className="flex items-center gap-2"><Clock size={16} /> {t.min_read}</span>
          </div>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/5 mb-12 aspect-video relative">
          <img 
            src={postData.image} 
            className="w-full h-full object-cover" 
            alt={t[postData.titleKey]} 
            loading="lazy" 
          />
        </div>

        {/* إضافة وصف المقال (Excerpt) كـ مقدمة لزيادة كثافة الكلمات المفتاحية */}
        <div className="text-xl text-gray-600 mb-10 italic leading-relaxed border-l-4 border-teal-500 pl-4 pr-4">
            {t[postData.excerptKey]}
        </div>

        <article className="max-w-none text-gray-800 leading-relaxed prose prose-xl md:prose-2xl prose-headings:text-gray-900 prose-headings:font-black prose-strong:text-teal-700 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50/50">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: t[postData.contentKey] }} />
        </article>
        {/* <AdBanner adKey={AD_KEY} /> */}

        {/* زر إجراء سريع (CTA) - مهم جداً لـ "أدسنس" لربط المقال بخدمة الموقع */}
        <div className="my-16 p-8 bg-teal-600 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">{t.cv_cta_title}</h3>
            <p className="mb-6 opacity-90">{t.cv_cta_subtitle}</p>
            <Link href={`/${lang}/create`} className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors">
                {t.cv_cta_button}
            </Link>
        </div>

        <hr className="my-16 border-gray-100" />
        {/* <AdBanner adKey={AD_KEY} /> */}

        {/* 1. المقال المقترح */}
        <section className="mb-20">
          <h3 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-2">
            {t.read_next}
          </h3>
          <Link href={`/${lang}/blogs/${nextPost.slug}`} className="group block relative rounded-[2rem] overflow-hidden bg-gray-900 aspect-[21/9]">
            <img 
              src={nextPost.image} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              alt={t[nextPost.titleKey]} 
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-teal-400 font-bold mb-2 flex items-center gap-2">
                {t[nextPost.categoryKey]} 
              </span>
              <h4 className="text-white text-2xl md:text-4xl font-bold max-w-2xl group-hover:text-teal-200 transition-colors">
                {t[nextPost.titleKey]}
              </h4>
            </div>
          </Link>
        </section>

        {/* 2. أهم المقالات */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                {t.trending_posts}
            </h3>
            <Link href={`/${lang}/blogs`} className="text-teal-600 font-bold flex items-center gap-1 hover:underline">
              {t.view_all} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post) => (
              <Link 
                href={`/${lang}/blogs/${post.slug}`} 
                key={post.id}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={t[post.titleKey]} />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-teal-600 text-[10px] font-black uppercase tracking-tighter mb-2">{t[post.categoryKey]}</span>
                  <h5 className="font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors text-lg mb-4">
                    {t[post.titleKey]}
                  </h5>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <ArrowRight size={14} className={`group-hover:translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer />
    </div>
  );
}