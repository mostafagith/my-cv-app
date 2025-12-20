"use client"; import AdBanner from "@/components/AdBanner";
;

import { useState } from "react";
import { IoArrowBack, IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import { blogPostsData } from "@/data/blogData";

export default function BlogsPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLangMenu = () => setOpenLang(!openLang);

  // منطق البحث: التصفية بناءً على العنوان المترجم
  const filteredPosts = blogPostsData.filter((post) => {
    const translatedTitle = t[post.titleKey] || "";
    return translatedTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`min-h-screen bg-gray-50 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <button onClick={() => router.back()} className="p-2 hover:bg-teal-700 cursor-pointer rounded-full transition">
          <IoArrowBack size={22} className={lang === 'ar' ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen size={20} /> {t.blogs}
        </h1>
        <div className="relative">
          <button onClick={toggleLangMenu} className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition">
            <Globe size={22} className="text-white" />
          </button>
          {openLang && (
            <div className={`w-[160px] absolute mt-2 ${lang === "ar" ? "left-0" : "right-0"} bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}>
              {["en", "ar", "fr", "es", "de", "it", "pt"].map((lng) => (
                <button 
                  key={lng} 
                  onClick={() => { changeLang(lng); setOpenLang(false); }} 
                  className={`block px-4 py-2 hover:bg-teal-50 w-full transition cursor-pointer ${lng === "ar" ? "text-right" : "text-left"} ${lang === lng ? 'text-teal-600 font-bold bg-teal-50' : ''}`}
                >
                  {lng === "en" && "🇺🇸 English"} {lng === "ar" && "🇸🇦 عربي"} {lng === "fr" && "🇫🇷 Français"} {lng === "es" && "🇪🇸 Español"} {lng === "de" && "🇩🇪 Deutsch"} {lng === "it" && "🇮🇹 Italiano"} {lng === "pt" && "🇵🇹 Português"}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-teal-600 text-white py-12 px-6 text-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-black mb-4">{t.blog_hero_title}</h2>
        <p className="max-w-2xl mx-auto opacity-90 text-sm md:text-base">{t.blog_hero_subtitle}</p>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* العمود الأساسي للمقالات */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* شريط البحث يظهر هنا فقط في وضع الجوال (أعلى المقالات) */}
          <div className="lg:hidden bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder} 
                className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition text-black`} 
              />
              <IoSearchOutline className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3.5 text-gray-400`} size={20} />
            </div>
            <div className="my-16 p-8 bg-teal-600 rounded-3xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">{t.cv_cta_title}</h3>
                <p className="mb-6 opacity-90">{t.cv_cta_subtitle}</p>
                <Link href={`/${lang}/create`} className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors">
                    {t.cv_cta_button}
                </Link>
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            filteredPosts.map((post,i) => (
              <>
              <Link href={`/${lang}/blogs/${post.slug}`} key={post.id} className="block">
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                  <div className="relative h-52 md:h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={t[post.titleKey]} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {t[post.categoryKey]}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                      <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {t[post.titleKey]}
                    </h3>

                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
                      {t[post.excerptKey]}
                    </p>

                    <span className="flex items-center gap-2 text-teal-600 font-bold">
                      {t.read_more} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </article>
              </Link>
              {i % 3==0 && i!= 0&&(
                {/* <AdBanner adKey={AD_KEY} /> */}
              )}
              </>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">{t.no_results || "No articles found matching your search."}</p>
            </div>
          )}
        </div>

        {/* Aside: يظهر في الشاشات الكبيرة فقط (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h4 className="font-bold text-gray-900 mb-4">{t.search_blog}</h4>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder} 
                className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition text-black`} 
              />
              <IoSearchOutline className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3.5 text-gray-400`} size={20} />
            </div>
          <div className="my-16 p-8 bg-teal-600 rounded-3xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">{t.cv_cta_title}</h3>
            <p className="mb-6 opacity-90">{t.cv_cta_subtitle}</p>
            <Link href={`/${lang}/create`} className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-colors">
                {t.cv_cta_button}
            </Link>
        </div>
          {/* <AdBanner adKey={AD_KEY} /> */}
          </div>
        </aside>
      </main>
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer />
    </div>
  );
}