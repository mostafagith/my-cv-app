"use client"; 
import AdBanner from "@/components/AdBanner";

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
      content.style.maxWidth = "650px";
      content.style.width = "650px";

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 650,
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
        existingDownloads.push({
          fileName,
          date: new Date().toISOString(),
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
    summary,
    experience = [],
    projects = [],
    education = [],
    skills = [],
    languages = [],
    certificates = [],
    awardsActivities = [],
  } = cvData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        @media (max-width: 640px) {
          #cv-template {
            padding: 12px !important;
            font-size: 12px;
          }
          #cv-template h1 { font-size: 20px !important; }
          #cv-template h2 { font-size: 14px !important; }
          #cv-template p, #cv-template li, #cv-template span, #cv-template div {
            font-size: 11px !important;
            line-height: 1.4;
          }
        }

        @media print {
          body * { visibility: hidden; }
          #cv-template, #cv-template * { visibility: visible; }
          #cv-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 650px !important;
            max-width: 650px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 15mm 20mm !important;
            margin: 0 auto !important;
          }
          header { display: none !important; }
          main { padding: 0 !important; }
          @page { margin: 15mm 0; }
        }
      `}</style>

      {/* HEADER */}
      <header className="bg-teal-600 text-white py-3 px-5 md:py-6 md:px-20 flex items-center justify-between shadow">
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded cursor-pointer">
          <IoArrowBack size={18} />
        </button>
        <h1 className="font-bold text-sm md:text-base">{t["cv_preview"]}</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center gap-1 bg-white cursor-pointer text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          <IoDownloadOutline size={16} />
          {isGenerating ? t["generating"] : t["download_share_file"]}
        </button>
      </header>
      {/* <AdBanner adKey={AD_KEY} /> */}

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir={cvLang == "ar" ? "rtl": "ltr"}>
        <div
          id="cv-template"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "30px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.4,
            color: "#333",
            background: "white",
          }}
        >
          {/* Header with Name Line */}
          <div style={{ marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "2px" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  marginRight: "10px",
                  color: "#214a66",
                  textTransform: "uppercase",
                }}
              >
                {personalDetails?.fullName || "ESTELLE DARCY"}
              </div>
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: "#b5c7cb",
                  marginTop: "4px",
                }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#2a7788",
                marginBottom: "6px",
                fontWeight: 700,
                textTransform: "capitalize"
              }}
            >
              {personalDetails?.jobTitle || "PROCESS ENGINEER"}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#373737",
                marginBottom: "20px",
                lineHeight: 1.4,
              }}
            >
              {personalDetails?.address ? personalDetails.address + " | " : "address"}
              {personalDetails?.email ? personalDetails.email + " | " : "email"}
              {personalDetails?.phone }
            </div>
          </div>

          {/* SUMMARY */}
          {summary && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.career_summary}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.4,
                  textAlign: "justify",
                  marginLeft: "20px",
                }}
              >
                {summary}
              </div>
            </div>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {experience?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.work_experience}
              </div>
              <div
                style={{
                  height: "1.5px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>

              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "12px", marginLeft: "20px" }}>
                  <div style={{ marginBottom: "4px" }}>
                    <div style={{ fontWeight: 600, fontSize: "16px", color: "#434343" }}>
                      {exp.jobTitle || "Position"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ fontSize: "14px", color: "#434343", marginBottom: "6px" }}>
                      {exp.company || "Company"} |{" "}
                    </div>
                    <div style={{ fontSize: "14px", color: "#434343" }}>
                      {exp.startDate || ""} {exp.endDate ? " - " + exp.endDate : ""}
                    </div>
                  </div>

                  {exp.details && (
                    <div style={{ marginLeft: "10px" }}>
                      {exp.details
                        .split("\n")
                        .filter((point) => point.trim())
                        .map((point, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span style={{ fontSize: "20px", color: "#333", marginRight: "4px", lineHeight: "16px", marginTop: "1px" }}>
                              •
                            </span>
                            <span style={{ fontSize: "14px", color: "#333", lineHeight: 1.4, flex: 1 }}>
                              {point.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {projects?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.relevant_projects}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>

              {projects.map((project, i) => (
                <div key={i} style={{ marginBottom: "12px", marginLeft: "20px" }}>
                  <div style={{ marginBottom: "4px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#434343" }}>
                      {project.title || "Project Title"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {project.technologies && (
                      <div style={{ fontSize: "14px", color: "#434343", fontWeight: 600 }}>
                        {project.technologies} |{" "}
                      </div>
                    )}
                    <div style={{ fontSize: "14px", color: "#434343", fontWeight: 600 }}>
                      {project.startDate || ""} {project.endDate ? " - " + project.endDate : ""}
                    </div>
                  </div>
                  {project.description && (
                    <div style={{ marginLeft: "10px" }}>
                      {project.description
                        .split("\n")
                        .filter((p) => p.trim())
                        .map((p, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span style={{ fontSize: "20px", color: "#333", marginRight: "4px" }}>•</span>
                            <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>{p.trim()}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {education?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.education}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>

              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "4px", marginLeft: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0" }}>
                    <div style={{ fontSize: "14px", color: "#434343", fontWeight: 600 }}>
                      {edu.startDate || ""} {edu.endDate ? `- ${edu.endDate} | ` : ""}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#434343" }}>
                      {edu.institution || "Institution"}
                    </div>
                  </div>
                  {(edu.degree || edu.grade) && (
                    <div>
                      {edu.degree && (
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div style={{ fontSize: "14px", color: "#333", marginRight: "4px" }}>
                            {edu.degree} -{" "}
                          </div>
                          <div style={{ fontSize: "14px", color: "#333" }}>{edu.course}</div>
                        </div>
                      )}
                      {edu.grade && (
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                          <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.4, flex: 1 }}>
                            Grade: {edu.grade}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {edu.details && (
                    <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>{edu.details}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {skills?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.skills}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>
              <div>
                {skills.map((skill, i) => (
  <div
    key={i}
    style={{
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "5px",
      marginLeft: "20px",
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 400,
        color: "#333",
        flex: 1,
      }}
    >
      • {skill.name || "Skill"}
    </div>
  </div>
))}

              </div>
            </div>
          )}

          {/* ADDITIONAL INFORMATION */}
          {(languages?.length > 0 || certificates?.length > 0 || awardsActivities?.length > 0) && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#2a7788",
                  textTransform: "uppercase",
                }}
              >
                {cvT.additional_information}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#7ba3ab87",
                  borderRadius: "2px",
                  marginBottom: "4px",
                }}
              ></div>
              <div style={{ fontSize: "14px", lineHeight: 1.6, marginLeft: "20px" }}>
                {languages?.length > 0 && (
                  <div style={{ marginBottom: "5px" }}>
                    <span style={{ fontWeight: "bold" }}>{cvT.languages}:</span>{" "}
                    {languages.map((lang) => lang.name).join(", ")}
                  </div>
                )}
                {certificates?.length > 0 && (
                  <div style={{ marginBottom: "5px" }}>
                    <span style={{ fontWeight: "bold" }}>{cvT.certifications}:</span>{" "}
                    {certificates.map((cert) => cert.name).join(", ")}
                  </div>
                )}
                {awardsActivities?.length > 0 && (
                  <div style={{ marginBottom: "5px" }}>
                    <span style={{ fontWeight: "bold" }}>{cvT.awards_activities}:</span>{" "}
                    {awardsActivities.map((award) => award.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
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