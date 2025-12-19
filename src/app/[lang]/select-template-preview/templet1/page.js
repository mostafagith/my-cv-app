"use client"; 
import AdBanner from "@/components/AdBanner";
;

import { useEffect, useState } from "react";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import { useLanguage } from "@/context/LanguageContext";
import { useCVLanguage } from "@/hooks/useCVLanguage";
import { blogPostsData } from "@/data/blogData";
import { ArrowRight,Calendar } from "lucide-react";
import Link from "next/link";

import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import Footer from "@/components/Footer";

export default function PdfPreview() {
  const [cvData, setCvData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const { cvT,cvLang } = useCVLanguage();
  const trendingPosts = blogPostsData.slice(0, 6);

  // ---------------- Safe Storage ----------------
const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch (err) {
    console.warn(`localStorage failed for key "${key}", fallback to sessionStorage`, err);
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
      return null;
    }
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`localStorage failed for key "${key}", fallback to sessionStorage`, err);
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
    }
  }
};

// ---------------- Load CV Data ----------------
useEffect(() => {
  const stored = safeGetItem("currentCV");
  const parsedCV = stored ? JSON.parse(stored) : null;

  if (parsedCV && Object.keys(parsedCV).length > 0) {
    setCvData(parsedCV);
  } else {
    alert(t["No CV data found!"] || "No CV data found!");
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  }
}, []);


  // ✅ دالة توليد وتحميل PDF مع حل مشكلة padding بين الصفحات
  const handleGenerateAndDownload = async () => {
    //window.print();
    
    try {
      setIsGenerating(true);
      const content = document.getElementById("cv-preview");
      const fileName = `${cvData?.title || "MyCV"}.pdf`;

      // حفظ الـ styles الأصلية
      const originalStyles = {
        boxShadow: content.style.boxShadow,
        border: content.style.border,
        borderRadius: content.style.borderRadius,
        padding: content.style.padding,
        maxWidth: content.style.maxWidth,
      };

      // تطبيق styles محسّنة مؤقتاً
      content.style.boxShadow = "none";
      content.style.border = "none";
      content.style.borderRadius = "0";
      content.style.padding = "32px";
      content.style.maxWidth = "650px";
      content.style.width = "650px";

      // تكبير الخطوط
      const textElements = content.querySelectorAll("*");
      const originalFontSizes = new Map();
      textElements.forEach((el) => {
        originalFontSizes.set(el, el.style.fontSize);
      });

      // إنشاء Canvas بجودة عالية
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 650,
        windowWidth: 650,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.9);

      const pdf = new jsPDF("p", "mm", "a4", true);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // ✅ Padding علوي وسفلي
      const paddingTop = 15; // mm
      const paddingBottom = 15; // mm
      const contentHeight = pageHeight - paddingTop - paddingBottom;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let currentY = 0;
      let pageNumber = 0;

      // ✅ حل مشكلة الجزء المكرر بين الصفحات
      while (currentY < imgHeight) {
        if (pageNumber > 0) pdf.addPage();

        const sourceY = currentY * (canvas.height / imgHeight);
        const sectionCanvas = document.createElement("canvas");
        const sectionHeight =
          contentHeight * (canvas.height / imgHeight);
        sectionCanvas.width = canvas.width;
        sectionCanvas.height = sectionHeight;
        const ctx = sectionCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sectionCanvas.width, sectionCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sectionHeight,
          0,
          0,
          canvas.width,
          sectionHeight
        );

        const sectionImgData = sectionCanvas.toDataURL("image/jpeg", 0.9);
        const sectionImgHeight = (sectionCanvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          sectionImgData,
          "JPEG",
          0,
          paddingTop,
          imgWidth,
          sectionImgHeight,
          undefined,
          "FAST"
        );

        currentY += contentHeight;
        pageNumber++;
      }

      // إعادة الـ styles الأصلية
      Object.keys(originalStyles).forEach((key) => {
        content.style[key] = originalStyles[key];
      });
      originalFontSizes.forEach((fontSize, element) => {
        element.style.fontSize = fontSize;
      });
      content.style.width = "";

      pdf.save(fileName);

      try {
const existing = safeGetItem("downloads");
  const existingDownloads = existing ? JSON.parse(existing):[];
  // تحويل PDF إلى Base64
  const pdfBase64 = pdf.output("datauristring"); // 'data:application/pdf;base64,...'

  existingDownloads.push({
    fileName,
    date: new Date().toISOString(),
    data: pdfBase64, // حفظ PDF كامل
  });


  

  safeSetItem("downloads", JSON.stringify(existingDownloads));
  toast.success(t["PDF saved successfully!"] || "PDF saved successfully!");
} catch (err) {
  toast.error(t["Failed to save PDF"] || "Failed to save PDF");
}

      
    } catch (err) {
      console.error("PDF generation/download failed:", err);
      alert(
        `An error occurred while generating the file.\nDetails: ${err.message}`
      );
    } finally {
      setIsGenerating(false);
    }

  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  if (!cvData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* CSS للطباعة */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-preview,
          #cv-preview * {
            visibility: visible;
          }
          #cv-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 650px !important;
            max-width: 650px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 5mm 10mm !important;
            margin: 0 auto !important;
          }
          header {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          @page {
            margin: 5mm 0;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-teal-600 text-white py-3 px-5 md:py-6 md:px-20 flex items-center justify-between shadow">
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded cursor-pointer">
          <IoArrowBack size={18} />
        </button>
        <h1 className="font-bold text-sm md:text-base">{t["cv_preview"]}</h1>

        <div className="flex gap-2">
          <button
            onClick={handleGenerateAndDownload}
            disabled={isGenerating}
            className={`flex cursor-pointer items-center gap-1 bg-white text-teal-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold transition ${
              isGenerating ? "opacity-60" : "hover:bg-teal-50"
            }`}
            title={t["download_pdf_to_share"]}
          >
            <IoDownloadOutline size={16} />
            {isGenerating ? t["generating"] : t["download_share_file"]}
          </button>
        </div>
      </header>
      <AdBanner adKey={AD_KEY} />

      {/* CV Content */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir={cvLang == "ar" ? "rtl": "ltr"}>
        <div
          id="cv-preview"
          className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-3 md:p-8 border border-gray-200"
        >
          {/* Personal Details */}
          <div className="border-b border-b-2 border-[#009689]  mb-2">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#009689] capitalize">
              {cvData.personalDetails?.fullName || ""}
            </h1>
          </div>
          <p className="contact-info text-gray-500 text-[10px] md:text-sm lg:text-base  mb-3">
            {cvData.personalDetails?.address || ""} |
            {" " + cvData.personalDetails?.phone || ""} |
            {" " + cvData.personalDetails?.email || ""}
          </p>

          {/* Summary */}
          {cvData.personalDetails.summary && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                {cvT.profile}
              </h2>
              <p className="text-gray-700 text-[10px] md:text-sm lg:text-base leading-relaxed">
                {cvData.personalDetails.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {cvData.experience?.length > 0 && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                {cvT.experience}
              </h2>
              <div className="space-y-3 md:space-y-4">
                {cvData.experience.map((exp, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-xs md:text-base lg:text-lg text-gray-800 mb-1 md:mb-2">
                      <span className="italic">{exp.jobTitle} - {exp.company}</span> | {exp.startDate} - {exp.endDate}
                    </h3>
                    
                    <ul className="space-y-1 ml-4 md:ml-5">
                      {exp.details
                        ?.split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, i) => (
                          <li
                            key={i}
                            className="text-gray-700 text-[10px] md:text-sm lg:text-base "
                          >
                            <span className="text-gray-600 pr-1">•</span>
                            <span>{line.replace(/^-\s*/, "")}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {cvData.education?.length > 0 && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                 {cvT.education}
              </h2>
              <div className="space-y-2">
                {cvData.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-xs md:text-base lg:text-lg text-gray-800">
                      {edu.course} - {edu.institution}
                    </h3>
                    <p className="text-gray-600 text-[10px] md:text-sm lg:text-base italic">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {cvData.skills?.length > 0 && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                {cvT.skills}
              </h2>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                {cvData.skills.map((s, i) => (
                  <li
                    key={i}
                    className="py-0.5 rounded-md text-[10px] md:text-sm lg:text-base  text-gray-700"
                  >
                    <span className="text-gray-600 pr-0.5">•</span>
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certificates */}
          {cvData.certificates?.length > 0 && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                {cvT.courses_certifications}
              </h2>
              <ul className="space-y-1 ml-4 md:ml-5">
                {cvData.certificates.map((l, i) => (
                  <li
                    key={i}
                    className="text-gray-700 text-[10px] md:text-sm lg:text-base mb-1 flex items-center"
                  >
                    <span className="pr-1 text-black text-lg flex-shrink-0">•</span>
                    <span className="font-bold">{l.name}</span>
                    <span className="mx-1">-</span>
                    <span>{l.issuer}</span>
                    <span className="mx-1">-</span>
                    <span className="font-semibold">{l.date}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {cvData.languages?.length > 0 && (
            <section className="mb-2">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                {cvT.languages}
              </h2>
              <ul className="space-y-1 ml-4 md:ml-5">
                {cvData.languages.map((l, i) => (
                  <li
                    key={i}
                    className="text-gray-700 text-[10px] md:text-sm lg:text-base mb-1 flex items-center"
                  >
                    <span className="pr-1 text-black text-lg flex-shrink-0 leading-none">•</span>
                    <span className="font-bold capitalize">{l.name}:</span>
                    <span className="capitalize ml-1">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          
        </div>
      </main>
      <AdBanner adKey={AD_KEY} />
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
      <Footer/>
    </div>
  );
}