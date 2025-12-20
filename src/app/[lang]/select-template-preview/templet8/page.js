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
    summary,
    references = [],
    experience = [],
    projects = [],
    education = [],
    skills = [],
    awardsActivities =[],
    certificates =[],
    languages = [],
  } = cvData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        .container {
          display: flex !important;
          flex-direction: row !important;
        }
        
        @media (max-width: 640px) {
          #cv-template {
            padding: 0 !important;
            font-size: 7px !important;
          }
          .container {
            flex-direction: row !important;
            padding: 0 !important;
          }
          .left-column {
            width: 35% !important;
            min-width: 100px !important;
            padding: 10px 6px !important;
            min-height: auto !important;
          }
          .right-column {
            width: 65% !important;
            padding: 10px 8px !important;
          }
          .profile-image,
          .profile-image-container {
            width: 45px !important;
            height: 45px !important;
            margin-bottom: 8px !important;
            font-size: 16px !important;
            border-width: 2px !important;
          }
          .contact-item {
            margin-bottom: 5px !important;
            font-size: 7px !important;
          }
          .contact-icon {
            width: 12px !important;
            height: 12px !important;
            margin-right: 4px !important;
            font-size: 6px !important;
          }
          .contact-text {
            font-size: 7px !important;
            line-height: 1.2 !important;
          }
          .section-title-left {
            font-size: 9px !important;
            margin-bottom: 5px !important;
            padding-bottom: 2px !important;
            border-bottom-width: 1px !important;
          }
          .skill-item,
          .language-item {
            margin-bottom: 3px !important;
            font-size: 7px !important;
          }
          .bullet-dot {
            font-size: 10px !important;
            margin-right: 3px !important;
            line-height: 10px !important;
          }
          .skill-text,
          .language-text {
            font-size: 7px !important;
            line-height: 1.2 !important;
          }
          .name {
            font-size: 14px !important;
            margin-bottom: 3px !important;
          }
          .job-title {
            font-size: 9px !important;
            margin-bottom: 8px !important;
          }
          .section-title-right {
            font-size: 10px !important;
            margin-bottom: 5px !important;
            padding-bottom: 2px !important;
            border-bottom-width: 1px !important;
          }
          .summary-text {
            font-size: 7px !important;
            line-height: 1.3 !important;
          }
          .experience-item,
          .education-item,
          .project-item {
            margin-bottom: 8px !important;
          }
          .company-name,
          .job-title-right,
          .education-degree,
          .project-title {
            font-size: 8px !important;
          }
          .job-date,
          .education-date,
          .project-date {
            font-size: 7px !important;
            margin-bottom: 3px !important;
          }
          .education-school,
          .project-organization {
            font-size: 7px !important;
            margin-bottom: 3px !important;
          }
          .bullet-point,
          .award-item,
          .certificate-item {
            font-size: 7px !important;
            line-height: 1.2 !important;
            margin-bottom: 3px !important;
          }
          .bullet-points {
            margin-left: 6px !important;
          }
          .summary-section,
          .experience-section,
          .education-section,
          .projects-section,
          .awards-section,
          .certificates-section,
          .skills-section,
          .languages-section {
            margin-bottom: 10px !important;
          }
          .job-header,
          .education-header,
          .project-header {
            margin-bottom: 3px !important;
          }
          .contact-section {
            margin-bottom: 12px !important;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #cv-template,
          #cv-template * {
            visibility: visible;
          }
          #cv-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            max-width: 210mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 15mm 20mm !important;
            margin: 0 auto !important;
          }
          header {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          @page {
            margin: 15mm 0;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="bg-teal-600 text-white py-3 px-5 md:py-6 md:px-20 flex items-center justify-between shadow">
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded  cursor-pointer">
          ← Back
        </button>
        <h1 className="font-bold text-sm md:text-base">{t["cv_preview"]}</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center gap-1 cursor-pointer bg-white text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          📥 {isGenerating ? t["generating"] :t["download_share_file"]}
        </button>
      </header>
      {/* <AdBanner adKey={AD_KEY} /> */}

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir={cvLang == "ar" ? "rtl": "ltr"}>
                  <div
            id="cv-template"
            style={{
              fontFamily: "Arial, sans-serif",
              margin: "0 auto",
              padding: "0",
              lineHeight: 1.4,
              color: "#333",
              background: "white",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: "900px",
                width: "100%",
                margin: "0 auto",
                padding: "0",
              }}
            >
            {/* LEFT COLUMN */}
            <div
              className="left-column"
              style={{
                width: "35%",
                minWidth: "250px",
                background: "#f4ebe2",
                color: "#201f1dff",
                padding: "40px 20px",
                minHeight: "100vh",
              }}
            >
              {/* Profile Image */}
              {personalDetails?.photoPreview ? (
                <div
                  className="profile-image-container"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "60px",
                    overflow: "hidden",
                    margin: "0 auto 20px",
                    border: "3px solid #dddcdc",
                  }}
                >
                  <img
                    src={personalDetails.photoPreview}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  className="profile-image"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "#34495e",
                    margin: "0 auto 25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bdc3c7",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {personalDetails?.fullName?.charAt(0) || "?"}
                </div>
              )}

              {/* Contact Section */}
              <div className="contact-section" style={{ marginBottom: "25px" }}>
                {personalDetails?.phone && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                      fontSize: "12px",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        color: "#f4ebe2",
                        fontSize: "10px",
                      }}
                    >
                      📞
                    </div>
                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
                      }}
                    >
                      {personalDetails.phone}
                    </div>
                  </div>
                )}

                {personalDetails?.email && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start", // مهم جداً
                      marginBottom: "12px",
                      fontSize: "12px",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f4ebe2",
                        fontSize: "10px",
                        marginTop: "2px", // يخليها في النص
                      }}
                    >
                      ✉
                    </div>

                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
                        wordBreak: "break-all",        // 👈 أهم سطر
                        overflowWrap: "break-word",     // 👈 احتياطي
                      }}
                    >
                      {personalDetails.email}
                    </div>
                  </div>
                )}


                {personalDetails?.website && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                      fontSize: "12px",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f4ebe2",
                        fontSize: "10px",
                        marginTop: "2px",
                      }}
                    >
                      🌐
                    </div>

                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                    >
                      {personalDetails.website}
                    </div>
                  </div>
                )}


                {personalDetails?.address && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                      fontSize: "12px",
                      gap: "10px",
                    }}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f4ebe2",
                        fontSize: "10px",
                        marginTop: "2px",
                      }}
                    >
                      📍
                    </div>

                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                    >
                      {personalDetails.address}
                    </div>
                  </div>
                )}

              </div>

              {/* Skills Section */}
              {skills?.length > 0 && (
                <div className="skills-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-left"
                    style={{
                      fontSize: "16px",
                      fontWeight: 900,
                      marginBottom: "15px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #201f1dff",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.skills}
                  </div>
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="skill-item"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <div
                        className="bullet-dot"
                        style={{
                          fontSize: "16px",
                          color: "#201f1dff",
                          lineHeight: "1.4",
                          flexShrink: 0, // تمنع النقطة من الانكماش
                          marginRight: "8px",
                        }}
                      >
                        •
                      </div>
                      <div
                        className="skill-text"
                        style={{
                          color: "#201f1dff",
                          fontSize: "12px",
                          lineHeight: 1.4,
                          flex: 1,         // ياخد كل المساحة المتاحة
                          minWidth: 0,     // مهم جداً عشان flex element يقدر ينكسر
                          wordBreak: "break-word", // تكسر النص لو طويل
                        }}
                      >
                        {skill.name}
                      </div>
                    </div>
                  ))}


                </div>
              )}

              {/* Languages Section */}
              {languages?.length > 0 && (
                <div className="languages-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-left"
                    style={{
                      fontSize: "16px",
                      fontWeight: 900,
                      marginBottom: "15px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #201f1dff",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.languages}
                  </div>
                  {languages.map((lang, i) => (
                    <div
                      key={i}
                      className="language-item"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                        fontSize: "12px",
                      }}
                    >
                      <div
                        className="bullet-dot"
                        style={{
                          fontSize: "16px",
                          color: "#201f1dff",
                          marginRight: "8px",
                          lineHeight: "14px",
                        }}
                      >
                        •
                      </div>
                      <div
                        className="language-text"
                        style={{
                          color: "#201f1dff",
                          fontSize: "12px",
                          lineHeight: 1.4,
                        }}
                      >
                        {lang.name}
                        {lang.proficiency ? ` (${lang.proficiency})` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div
              className="right-column"
              style={{
                width: "65%",
                flex: 1,
                padding: "40px 30px",
                background: "white",
              }}
            >
              {/* Name and Job Title */}
              <div
                className="name"
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#2c3e50",
                  textTransform: "uppercase",
                }}
              >
                {personalDetails?.fullName }
              </div>
              <div
                className="job-title"
                style={{
                  fontSize: "16px",
                  color: "#000",
                  marginBottom: "25px",
                  fontWeight: 600,
                }}
              >
                {personalDetails?.jobTitle }
              </div>

              {/* Professional Summary */}
              {summary && (
                <div className="summary-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.professional_summary}
                  </div>
                  <div
                    className="summary-text"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                      textAlign: "justify",
                      color: "#555",
                    }}
                  >
                    {summary}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {experience?.length > 0 && (
                <div className="experience-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.work_experience}
                  </div>
                  {experience.map((exp, i) => (
                    <div key={i} className="experience-item" style={{ marginBottom: "20px" }}>
                      <div
                        className="job-header"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          className="company-name"
                          style={{
                            fontWeight: 600,
                            color: "#000",
                            fontSize: "14px",
                          }}
                        >
                          {exp.company || "Company"} |{" "}
                        </div>
                        <div
                          className="job-title-right"
                          style={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#000",
                          }}
                        >
                          {exp.jobTitle || "Position"}
                        </div>
                      </div>
                      <div
                        className="job-date"
                        style={{
                          fontSize: "12px",
                          color: "#000",
                          fontWeight: 500,
                          marginBottom: "8px",
                        }}
                      >
                        {exp.startDate || ""} {exp.endDate ? "- " + exp.endDate : ""}
                      </div>
                      {exp.details && (
                        <div className="bullet-points" style={{ marginLeft: "15px" }}>
                          {exp.details
                            .split("\n")
                            .filter((point) => point.trim())
                            .map((point, j) => (
                              <div
                                key={j}
                                className="bullet-point"
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.5,
                                  marginBottom: "6px",
                                  color: "#555",
                                }}
                              >
                                • {point.trim()}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {education?.length > 0 && (
                <div className="education-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.education}
                  </div>
                  {education.map((edu, i) => (
                    <div key={i} className="education-item" style={{ marginBottom: "18px" }}>
                      <div
                        className="education-header"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className="education-degree"
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#2c3e50",
                          }}
                        >
                          {edu.degree || "Degree"},{" "}
                        </div>
                        <div
                          className="education-date"
                          style={{
                            fontSize: "12px",
                            color: "#000",
                            fontWeight: "bold",
                          }}
                        >
                          {edu.startDate || ""} {edu.endDate ? "- " + edu.endDate : ""}
                        </div>
                      </div>
                      <div
                        className="education-school"
                        style={{
                          fontSize: "13px",
                          color: "#000",
                          fontWeight: 500,
                          marginBottom: "5px",
                        }}
                      >
                        {edu.institution || "Institution"}
                      </div>
                      {edu.course && (
                        <div
                          className="bullet-point"
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.5,
                            marginBottom: "6px",
                            color: "#555",
                          }}
                        >
                          {edu.course}
                        </div>
                      )}
                      {edu.grade && (
                        <div
                          className="bullet-point"
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.5,
                            marginBottom: "6px",
                            color: "#555",
                          }}
                        >
                          Grade: {edu.grade}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {projects?.length > 0 && (
                <div className="projects-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.projects}
                  </div>
                  {projects.map((project, i) => (
                    <div key={i} className="project-item" style={{ marginBottom: "18px" }}>
                      <div
                        className="project-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className="project-title"
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: "#2c3e50",
                          }}
                        >
                          {project.title || "Project Title"}
                        </div>
                        <div
                          className="project-date"
                          style={{
                            fontSize: "12px",
                            color: "#000",
                            fontWeight: 500,
                          }}
                        >
                          {project.startDate || ""} {project.endDate ? "- " + project.endDate : ""}
                        </div>
                      </div>
                      {project.organization && (
                        <div
                          className="project-organization"
                          style={{
                            fontSize: "13px",
                            color: "#3498db",
                            fontWeight: 500,
                            marginBottom: "8px",
                          }}
                        >
                          {project.organization}
                        </div>
                      )}
                      {project.description && (
                        <div className="bullet-points" style={{ marginLeft: "15px" }}>
                          {project.description
                            .split("\n")
                            .filter((point) => point.trim())
                            .map((point, j) => (
                              <div
                                key={j}
                                className="bullet-point"
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.5,
                                  marginBottom: "6px",
                                  color: "#555",
                                }}
                              >
                                • {point.trim()}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Awards & Activities */}
              {awardsActivities?.length > 0 && (
                <div className="awards-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.awards_activities}
                  </div>
                  {awardsActivities.map((award, i) => (
                    <div
                      key={i}
                      className="award-item"
                      style={{
                        marginBottom: "8px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      •{" "}
                      {[award.name, award.organization, award.description, award.date]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  ))}
                </div>
              )}

              {/* Certificates */}
              {certificates?.length > 0 && (
                <div className="certificates-section" style={{ marginBottom: "25px" }}>
                  <div
                    className="section-title-right"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                      color: "#000",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #000",
                      paddingBottom: "5px",
                    }}
                  >
                    {cvT.courses_certifications}
                  </div>
                  {certificates.map((cert, i) => (
                    <div
                      key={i}
                      className="certificate-item"
                      style={{
                        marginBottom: "8px",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      • {cert.name}
                      {cert.date ? ` - ${cert.date}` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
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