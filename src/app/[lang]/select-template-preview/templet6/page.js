"use client"; import AdBanner from "@/components/AdBanner";
;

import { useEffect, useState } from "react";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useCVLanguage } from "@/hooks/useCVLanguage";
import Footer from "@/components/Footer";
import { blogPostsData } from "@/data/blogData";
import { ArrowRight,Calendar } from "lucide-react";
import Link from "next/link";
export default function PdfPreview() {
  const [cvData, setCvData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const trendingPosts = blogPostsData.slice(0, 6);
  const { cvT,cvLang } = useCVLanguage();
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

  const handleGenerateAndDownload = async () => {
    //window.print();
    try {
      setIsGenerating(true);
      const content = document.getElementById("cv-template");
      const fileName = `${cvData?.title || "MyCV"}.pdf`;

      const originalStyles = {
        boxShadow: content.style.boxShadow,
        border: content.style.border,
        borderRadius: content.style.borderRadius,
        padding: content.style.padding,
        maxWidth: content.style.maxWidth,
      };

      content.style.boxShadow = "none";
      content.style.border = "none";
      content.style.borderRadius = "0";
      content.style.padding = "32px";
      content.style.maxWidth = "896px";
      content.style.width = "896px";

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 896,
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const paddingTop = 15;
      const paddingBottom = 15;
      const contentHeight = pageHeight - paddingTop - paddingBottom;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let currentY = 0;
      let pageNumber = 0;

      while (currentY < imgHeight) {
        if (pageNumber > 0) pdf.addPage();

        const sourceY = currentY * (canvas.height / imgHeight);
        const sectionCanvas = document.createElement("canvas");
        const sectionHeight = contentHeight * (canvas.height / imgHeight);
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

      Object.keys(originalStyles).forEach((key) => {
        content.style[key] = originalStyles[key];
      });

    pdf.save(fileName);
      
      try {
        const existing = safeGetItem("downloads");
  const existingDownloads = existing ? JSON.parse(existing):[];
        const pdfBase64 = pdf.output("datauristring");
        existingDownloads.push({
          fileName,
          date: new Date().toISOString(),
          data: pdfBase64,
        });
        safeSetItem("downloads", JSON.stringify(existingDownloads));
      } catch (err) {
        console.error("Failed to save download info:", err);
      }

      alert("✅ PDF generated successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(`Error generating PDF: ${err.message}`);
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

  const {
    personalDetails = {},
    objective,
    references = [],
    experience = [],
    projects = [],
    education = [],
    skills = [],
    languages = [],
  } = cvData;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      <style>{`
@media (max-width: 640px) {
  #cv-template {
    padding: 12px !important;
    font-size: 12px;
  }

  #cv-template h1 {
    font-size: 16px !important;
  }

  #cv-template h2 {
    font-size: 14px !important;
  }

  #cv-template h3 {
    font-size: 9px !important;
  }

  #cv-template p,
  #cv-template li,
  #cv-template span,
  #cv-template div {
    font-size: 7px !important;
    line-height: 1.4;
  }

  #cv-template .left-column {
    width: 35% !important;
    padding: 25px 8px !important;
  }

  #cv-template .right-column {
    width: 65% !important;
    padding: 35px 8px !important;
  }

  #cv-template .profile-image-container {
    height: 120px !important;
    margin-bottom: 30px !important
  }

  #cv-template .main-name {
    font-size: 14px !important;
  }

  #cv-template .name-underline {
    height: 4px !important;
    bottom: 4px !important;
  }

  #cv-template .section-title {
    font-size: 10px !important;
    letter-spacing: 2px !important;
    margin-bottom: 5px !important;
  }

  #cv-template .section {
    margin-bottom: 15px !important;
    padding: 0 15px !important;
  }

  #cv-template .skill-name {
    font-size: 6px !important;
  }

  #cv-template .skill-bar-container {
    height: 3px !important;
  }

  #cv-template .language-name {
    font-size: 6px !important;
  }

  #cv-template .language-proficiency {
    font-size: 5px !important;
  }

  #cv-template .item-title {
    font-size: 7px !important;
  }
        .cc{
            margin-bottom:30px !important;
        }

  #cv-template .item-description {
    font-size: 7px !important;
    line-height: 10px !important;
  }
    .project-item{
        margin-bottom:15px !important;
    }
}
      `}</style>

      {/* HEADER */}
      <header style={{ 
        background: '#0d9488', 
        color: 'white', 
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <button onClick={handleBack} style={{
          padding: '0.25rem',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          borderRadius: '4px'
        }}>
          <IoArrowBack size={18} />
        </button>
        <h1 style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{t["cv_preview"]}</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'white',
            color: '#0d9488',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: 'none',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.6 : 1
          }}
        >
          <IoDownloadOutline size={16} />
          {isGenerating ? t["generating"] : t["download_share_file"]}
        </button>
      </header>
          {/* <AdBanner adKey={AD_KEY} /> */}
      {/* MAIN */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '1rem',
        overflowY: 'auto'
      }} dir={cvLang == "ar" ? "rtl": "ltr"}>
        <div id="cv-template" className="cv-template" style={{
          display: 'flex',
          width: '100%',
          maxWidth: '896px',
          minHeight: '100vh',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.4,
          color: '#333'
        }}>
          {/* العمود الأيسر */}
          <div className="left-column" id="left-column" style={{
            width: '35%',
            background: '#222',
            color: 'white',
            padding: '30px 0'
          }}>
            {personalDetails?.photoPreview && (
              <div className="profile-image-container" style={{
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                margin: '0 auto 70px'
              }}>
                <img src={personalDetails.photoPreview} alt="Profile" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
            )}
            
            {/* ABOUT ME */}
            {objective && (
              <div className="section" style={{ marginBottom: "15px", padding: '0 30px' }}>
                <div className="section-title" style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "15px",
                  color: "#7b7b7b",
                  // textAlign: "left",
                  paddingBottom: "5px",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>
                  {cvT.about_me}
                </div>
                <div className="item-description" style={{ 
                  color: '#7b7b7b', 
                  fontSize: '14px', 
                  lineHeight: 1.5 
                }}>
                  {objective}
                </div>
              </div>
            )}
            
            {/* SKILLS */}
            {skills?.length > 0 && (
              <div id="skills-section" className="skills-section section" style={{ marginBottom: "25px", padding: '0 30px' }}>
                <div className="section-title" id="skills-title" style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "15px",
                  color: "#7b7b7b",
                  paddingBottom: "5px",
                  // textAlign: "left",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>
                  {cvT.skills}
                </div>
                <div className="skills-list">
                  {skills.map((skill, index) => {
  const skillLevel = skill.level || 3;
  const percentage = (skillLevel / 5) * 100;

  return (
    <div
      key={index}
      className="skill-item"
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        gap: "8px", // مسافة بين النص والبار
        flexWrap: "wrap", // النص ينزل لو طويل
      }}
    >
      <div
        className="skill-name"
        style={{
          color: "#7b7b7b",
          fontSize: "14px",
          flex: "1 1 50%", // يقدر ينكمش أو يكبر حسب النص
          wordBreak: "break-word", // لف النص الطويل
        }}
      >
        {skill.name || "Skill"}
      </div>
      <div
        className="skill-bar-container"
        style={{
          flex: "1 1 50%", // نفس flex للنص
          height: "6px",
          borderRadius: "3px",
          background: "#2c3e50",
          overflow: "hidden",
          marginTop: "2px",
          minWidth: "80px", // ضمان حجم بار صغير لا يختفي
        }}
      >
        <div
          className="skill-bar"
          style={{
            height: "100%",
            background: "#9e9f97",
            borderRadius: "3px",
            width: `${percentage}%`,
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
    </div>
  );
})}

                </div>
              </div>
            )}
            
            {/* LANGUAGES */}
            {languages?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px', padding: '0 30px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  marginBottom: '15px',
                  color: '#7b7b7b',
                  paddingBottom: '5px',
                  // textAlign: 'left',
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>{cvT.languages}</div>
                <div className="languages-list">
                  {languages.map((lang, index) => (
                    <div key={index} className="language-item" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '8px' 
                    }}>
                      <div className="language-name" style={{ 
                        flex: '0 0 50%',
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        color: '#7b7b7b',
                        marginBottom: '2px'
                      }}>
                        {lang.name}
                      </div>
                      {lang.proficiency && (
                        <div className="language-proficiency" style={{ 
                          flex: '0 0 50%',
                          fontSize: '12px', 
                          color: '#7b7b7b' 
                        }}>
                          {lang.proficiency}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* العمود الأيمن */}
          <div id="right-column" className="right-column" style={{ width: '65%', padding: '30px', paddingTop:"80px" }}>
            
            {/* الاسم والوظيفة */}
            <div className="cc" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div className="main-name-container" style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                <h1 className="main-name" style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  position: 'relative',
                  zIndex: 1,
                  margin: 0,
                  padding: 0
                }}>
                  {personalDetails?.fullName}
                </h1>
                <div className="name-underline" style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '-10px',
                  right: '-10px',
                  height: '12px',
                  background: '#ffe400',
                  zIndex: 0
                }}></div>
              </div>
              
              <div style={{ fontSize: '16px', color: '#c7c7c7', marginBottom: '0px' }}>
                {personalDetails?.jobTitle || 'Professional Title'}
              </div>
              
              {/* معلومات الاتصال */}
              <div style={{ fontSize: '14px', color: '#c7c7c7', lineHeight: 1.4}}>
                {personalDetails?.address && <div>{personalDetails.address}</div>}
                {personalDetails?.phone && <div>phone: {personalDetails.phone}</div>}
                {personalDetails?.email && <div>email: {personalDetails.email}</div>}
              </div>
            </div>
            
            {/* WORK EXPERIENCE */}
            {experience?.length > 0 && (
              <div className="section" style={{ marginBottom: '50px', padding: 0 }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>{cvT.experience}</div>
                {experience.map((exp, index) => (
                  <div key={index} className="item" style={{ marginBottom: '15px' }}>
                    <div className="item-header" style={{ display: 'flex', justifyContent: '', marginBottom: '5px' }}>
                      <div className="item-title" style={{ fontWeight: '400', fontSize: '16px',color:"#9d9d9d" }}>
                        {exp.jobTitle || 'Position'} {"["+exp.startDate || ''} {exp.endDate ? ` - ${exp.endDate}`+"]" : ''}
                      </div>
                    </div>
                    <div className="item-subtitle" style={{ fontSize: '14px', color: '#a5a4a4ff', fontStyle: 'italic', marginBottom: '5px' }}>
                      {exp.company || 'Company'}
                    </div>
                    {exp.details && (
                      <div className="item-description" style={{ fontSize: '14px', color: '#a5a4a4ff', lineHeight: 1.5 }}>
                        {exp.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* PROJECTS */}
            {projects?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px', padding: 0 }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>{cvT.projects}</div>
                {projects.map((project, index) => (
                  <div key={index} className="project-item" style={{ marginBottom: '35px' }}>
                    <div className="project-title" style={{ fontWeight: 'bold', fontSize: '16px', color: '#9d9d9d', marginBottom: '5px' }}>
                      {project.title || 'Project Title'}
                    </div>
                    {project.technologies && (
                      <div className="project-technologies" style={{ fontSize: '14px', color: '#9d9d9d', fontStyle: 'italic', marginBottom: '5px' }}>
                        {project.technologies}
                      </div>
                    )}
                    {project.description && (
                      <div className="project-description" style={{ fontSize: '14px', color: '#a5a4a4ff', lineHeight: 1.5 }}>
                        {project.description}
                      </div>
                    )}
                    {(project.startDate || project.endDate) && (
                      <div className="project-date" style={{ fontSize: '12px', color: '#a5a4a4ff', marginTop: '5px' }}>
                        {project.startDate || ''} {project.endDate ? ` - ${project.endDate}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* EDUCATION */}
            {education?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px', padding: 0 }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                }}>{cvT.education}</div>
                {education.map((edu, index) => (
                  <div key={index} className="education-item" style={{ marginBottom: '15px' }}>
                    <div className="education-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div className="education-title" style={{ fontWeight: 'bold', fontSize: '16px', color: '#9d9d9d' }}>
                        {edu.course || 'Course'}
                      </div>
                      <div className="education-date" style={{ fontSize: '12px', color: '#9d9d9d' }}>
                        {edu.startDate || ''} {edu.endDate ? ` - ${edu.endDate}` : ''}
                      </div>
                    </div>
                    {edu.degree && (
                      <div className="education-degree" style={{ fontSize: '14px', color: '#9d9d9d', fontStyle: 'italic', marginBottom: '3px' }}>
                        {edu.degree}
                      </div>
                    )}
                    <div className="education-institution" style={{ fontSize: '14px', color: '#a5a4a4ff', fontWeight: '600', marginBottom: '3px' }}>
                      {edu.institution || 'Institution'}
                    </div>
                    {edu.grade && (
                      <div className="education-grade" style={{ fontSize: '13px', color: '#a5a4a4ff', marginBottom: '3px' }}>
                        Grade: {edu.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* <AdBanner adKey={AD_KEY} /> */}
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
                  {/* <AdBanner adKey={AD_KEY} /> */}
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
              {/* <AdBanner adKey={AD_KEY} /> */}
              <Footer/>
    </div>
  );
}