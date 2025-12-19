"use client"; 
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe,Calendar, Share2, Gift, Bell, Settings, ArrowRight,Facebook, Linkedin } from "lucide-react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
// import { Facebook, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPostsData } from "@/data/blogData";

function AdMobBannerPlaceholder() {
  return (
    <div className="bg-gray-100 h-48 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 mx-5 my-5 shadow-inner">
      <span className="text-gray-500 font-semibold text-center p-4">
        Banner Ad Placeholder (Medium Rectangle)
        <br />
        [إعلان هنا]
      </span>
    </div>
  );
}

export default function HomePage() {
  const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const { t, lang } = useLanguage(); 
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");

  // Load CVs from localStorage
  const [cvs, setCvs] = useState([]);
  const trendingPosts = blogPostsData.slice(0, 6);
useEffect(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("cvs") || sessionStorage.getItem("cvs");
      console.log("📦 Raw saved CVs:", saved); // شوف إذا فيه بيانات
      
      if (saved) {
        const parsedCVs = JSON.parse(saved);
        console.log("✅ Parsed CVs:", parsedCVs); // شوف البيانات بعد التحليل
        setCvs(parsedCVs);
      } else {
        console.log("❌ No CVs found in storage");
      }
    } catch (err) {
      console.error("🚨 Error loading CVs:", err);
    }
  }
}, []);

  const toggleLangMenu = () => setOpenLang(!openLang);

  const handleShare = async () => {
  // جيب الـ URL والعنوان مباشرة
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof document !== "undefined" ? document.title : "CV Builder";


  const shareData = {
    title: title,
    text: title,
    url: currentUrl,
  };

  // جرب الـ Native Share الأول (للموبايل)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      console.debug("Share cancelled or failed:", err);
    }
  }

  // لو مفيش Native Share، افتح الـ Modal
  setShareUrl(currentUrl);
  setPageTitle(title);
  setShowShareModal(true);
};

const copyLink = async () => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  
  try {
    // جرب الطريقة الحديثة
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentUrl);
    } 
    // Fallback للمتصفحات القديمة
    else {
      const ta = document.createElement("textarea");
      ta.value = currentUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (e) {
    console.error("Copy failed:", e);
    alert(lang === "ar" ? "فشل النسخ — حاول يدوياً" : "Copy failed — try manually");
  }
};

  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(pageTitle);
const templates = [
  { id: "templet10", name: "Template 10", image: "/templates/templet10.jpg", page: "/templet10" },
  { id: "templet9", name: "Template 9", image: "/templates/templet9.jpg", page: "/templet9" },
  { id: "creative", name: "Creative", image: "/templates/creative.jpg", page: "/templet4" },
  { id: "templet2", name: "Template 2", image: "/templates/templet2.jpg", page: "/templet2" },
  { id: "templet3", name: "Template 3", image: "/templates/templet3.jpg", page: "/templet3" },
  { id: "executive", name: "Executive", image: "/templates/executive.jpg", page: "/templet5" },
  { id: "academic", name: "Academic", image: "/templates/academic.jpg", page: "/templet6" },
  { id: "templet1", name: "Template 1", image: "/templates/templet1.jpg", page: "/templet1" },
    { id: "templet7", name: "Template 7", image: "/templates/templet7.jpg", page: "/templet7" },
    { id: "templet8", name: "Template 8", image: "/templates/templet8.jpg", page: "/templet8" },
  ];
  return (
    <div
      className={`min-h-screen bg-gray-50 font-sans transition-all duration-300 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Poppins, sans-serif",
      }}
    >
      {/* Header */}
      <Navbar />

      {/* Icons Row */}
      <div className="flex justify-around bg-orange-50 py-4 px-2 shadow-md">
        <IconButton icon={<Share2 />} label={t.share} onClick={handleShare} />
        {/*<IconButton icon={<Gift />} label={t.reward} onClick={() => console.log("Rewarded Ad")} />*/}
        <IconButton
          icon={<FaWhatsapp className="w-6  h-6" />}
          label={t.contact_whatsapp}
          onClick={() => window.open("https://wa.me/201016495415", "_blank")}
        />
        <IconButton icon={<Settings />} label={t.settings} onClick={()=> router.push(`/${lang}/setting`)} />
      </div>

      {/* Banner Ad Placeholder */}
      {/* <AdMobBannerPlaceholder /> */}

      {/* Main Content */}
      <main className="flex-1 py-3 px-5 md:py-6 md:px-20">
        <div className="mt-5">
          <h2
            className={`text-xl font-bold text-gray-800 mb-4 ${
              lang === "ar" ? "border-r-4 pr-2" : "border-l-4 pl-2"
            } border-teal-600`}
          >
            {t.resume_section}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {console.log(cvs.length,"DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDdd")}
            {cvs.length > 0 ? (
              <Link
                href={`${lang}/create`}
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
                <span>{t.create}</span> 
                <ArrowRight size={24} />
              </Link>
            ) : (
              <Link
                href={`${lang}/create-new`}
                className="flex-1 bg-teal-600 hover:bg-teal-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
              >
                <span>{t.create}</span> 
                <ArrowRight size={24} />
              </Link>
            )}

            <Link
              href={`${lang}/downloads`}
              className="flex-1 bg-gray-600 hover:bg-gray-700 transition p-4 rounded-xl flex items-center justify-between shadow-xl text-white font-bold text-lg"
            >
              <span>{t.downloads}</span>
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/40 z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">مشاركة الرابط</h3>
            <div className="grid grid-cols-3 gap-4">
              <a
                href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                واتساب
              </a>
              <a
                href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                تيليجرام
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                فيسبوك
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                تويتر
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                لينكدإن
              </a>
              <a
                href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encoded}`}
                target="_blank"
                rel="noreferrer"
                className="text-center hover:underline"
              >
                إيميل
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                {copied ? "تم النسخ ✓" : "نسخ الرابط"}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
            <div className="text-center py-10 bg-gradient-to-b from-gray-50 to-white px-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {t.choose_your_template}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                {t.view_professional_examples}
              </p>
            </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 py-3 px-5 md:py-6 md:px-20">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative border-2 border-gray-200 hover:border-teal-500 overflow-hidden cursor-pointer transition transform hover:scale-[1.02]`}
                  >
                    <div className="relative w-full ">
                      <img
                        onClick={()=> router.push(`/${lang}/create-new`)}
                        src={template.image}
                        alt={template.name}
                        fill
                        className="object-contain"
                      />
                      
                    </div>
                    {/* <div className="p-3 text-center">
                      <p className="font-semibold text-gray-800">{template.name}</p>
                    </div> */}
                  </div>
                ))}
              </div>
              <section className="py-12 bg-gray-50 text-center ">
                <div className="max-w-4xl mx-auto px-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t.why_our_cv_builder}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {t.cv_importance}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {t.easy_to_use}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {t.ready_to_start}
                  </p>
                  <div className="mt-6">
                    {cvs.length>0?
                      <Link
                        href={`${lang}/create`}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 transition text-center p-4 rounded-xl shadow-xl text-white font-bold text-lg"
                      >
                          <span>{t.create}</span>
                        {/* <ArrowRight size={24} /> */}
                      </Link>      
                    :
                      <Link
                        href={`${lang}/create-new`}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 transition text-center p-4 rounded-xl shadow-xl text-white font-bold text-lg"
                      >
                          <span>{t.create}</span>
                        {/* <ArrowRight size={24} /> */}
                      </Link>
                    }
                    
                  </div>
                </div>
              </section>
              <AdBanner adKey={AD_KEY} />
              <section className="bg-white py-20 px-4 md:px-20">
                <div className="max-w-4xl mx-auto space-y-16">

                  {/* Main Title */}
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                      {t.main_title}
                    </h2>
                    <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      {t.main_intro}
                    </p>
                  </div>

                  {/* What is CV */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {t.what_is_cv_title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t.what_is_cv_desc}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {t.cv_definition_title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t.cv_definition_desc}
                      </p>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-10">
                    <h3 className="text-3xl font-bold text-center text-gray-900">
                      {t.cv_sections_title}
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {t.sections?.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                        >
                          <h4 className="font-bold text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Choose Us */}
                  <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-10 text-white text-center space-y-4">
                    <h3 className="text-3xl font-bold">
                      {t.why_choose_us_title}
                    </h3>
                    <p className="max-w-3xl mx-auto leading-relaxed">
                      {t.why_choose_us_desc}
                    </p>
                  </div>

                </div>
              </section>

              <AdBanner adKey={AD_KEY} />
              {/* --- قسم الأسئلة الشائعة (FAQ) --- */}
              <section className="py-16 bg-gray-50 px-4 md:px-20">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    {t.faq_main_title}
                  </h2>
                  <div className="space-y-4">
                    {/* هنا بنعمل Loop على الـ 20 سؤال */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <details 
                        key={i} 
                        className="group bg-white border border-gray-200 rounded-xl shadow-sm transition-all overflow-hidden"
                      >
                        <summary className={`flex items-center justify-between p-4 cursor-pointer list-none font-bold text-gray-800 hover:text-teal-600 transition-colors ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <span className="text-base md:text-lg">{t[`faq_q_${i + 1}`]}</span>
                          <span className="text-teal-500 group-open:rotate-180 transition-transform duration-300">
                            <ArrowRight size={18} className="rotate-90" />
                          </span>
                        </summary>
                        <div className={`px-4 pb-5 text-gray-600 border-t border-gray-50 pt-4 leading-relaxed text-sm md:text-base ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t[`faq_a_${i + 1}`]}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
              <AdBanner adKey={AD_KEY} />
              {/* --- قسم نصائح ذهبية للـ CV --- */}
              <section className="py-16 bg-white px-4 md:px-20">
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
                <AdBanner adKey={AD_KEY} />
                <div className="max-w-6xl mx-auto text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t.cv_tips_title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t.cv_tips_subtitle}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`p-6 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-black mb-4 ${lang === 'ar' ? 'mr-0' : 'ml-0'} mx-auto sm:mx-0`}>
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">
                        {t[`tip_title_${i + 1}`]}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t[`tip_desc_${i + 1}`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <AdBanner adKey={AD_KEY} />
      {/* Footer */}
      <Footer/>

    </div>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer min-w-[70px] space-y-1 p-2 rounded-lg transition duration-200 hover:bg-orange-100 active:bg-orange-200"
    >
      <div className="text-teal-600">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}
