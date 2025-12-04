"use client";

import { useEffect, useState } from "react";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useCVLanguage } from "@/hooks/useCVLanguage";

export default function PdfPreview() {
  const [cvData, setCvData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();
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
      const fileName = `${cvData?.personalDetails?.fullName || "MyCV"}.pdf`;

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
    summary ,
    references = [],
    experience = [],
    projects = [],
    education = [],
    skills = [],
    languages = [],
    awardsActivities =[],
    certificates =[]
  } = cvData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        @media (max-width: 640px) {
          #cv-template {
            padding: 12px !important;
            font-size: 12px;
          }
          #cv-template h1 {
            font-size: 20px !important;
          }
          #cv-template h2 {
            font-size: 14px !important;
          }
          #cv-template p,
          #cv-template li,
          #cv-template span,
          #cv-template div {
            font-size: 10px !important;
            line-height: 1.4;
            // margin-bottom: 2px !important;
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
            width: 650 !important;
            max-width: 650 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 15mm 20mm !important;
            margin: 0 auto !important;
          }
            .contact-value{
                font-size:10px
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
        <button onClick={handleBack} className="cursor-pointer p-1 hover:bg-teal-700 rounded cursor-pointer">
          ← Back
        </button>
        <h1 className="font-bold text-sm md:text-base ">{t["cv_preview"]}</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center cursor-pointer gap-1 bg-white text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          📥 {isGenerating ? t["generating"] : t["download_share_file"]}
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir={cvLang == "ar" ? "rtl": cvLang}>
        <div
          id="cv-template"
          className="container"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "35px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.5,
            color: "#333",
            background: "white",
          }}
        >
          {/* Header */}
          <div className="header-container" style={{ marginBottom: "20px", textAlign: "center" }}>
            <h1
              className="name"
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {personalDetails?.fullName || "BENJAMIN SHAH"}
            </h1>
            <div
              className="job-title-header"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#000",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {personalDetails?.jobTitle || ""}
            </div>
            <div
              className="header-divider bg-teal-500"
              style={{
                height: "2px",
                // backgroundColor: "#699d91",
                marginBottom: "10px",
                width: "100%",
              }}
            ></div>
          </div>

          {/* PROFESSIONAL SUMMARY */}
          {summary && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#000",
                  textTransform: "uppercase",
                  marginTop: "15px",
                  marginBottom: "4px",
                  textAlign: "center",
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
                  marginBottom: "12px",
                  color: "#222222e1",
                  fontWeight: 500,
                }}
              >
                {summary}
              </div>
            </div>
          )}

          {/* Contact Info */}
          {(personalDetails?.phone || personalDetails?.email || personalDetails?.address) && (
            <div className="contact-container" style={{ width: "100%", marginBottom: "4px" }}>
              <div
                className="contact-row"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {personalDetails?.phone && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      minWidth: "30%",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      className="contact-label text-teal-500"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        // color: "#206955",
                        marginBottom: 0,
                      }}
                    >
                      {cvT.phone}:
                    </span>
                    <span
                      className="contact-value"
                      style={{
                        fontSize: "12px",
                        color: "#000",
                        textAlign: "left",
                        lineHeight: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {personalDetails.phone}
                    </span>
                  </div>
                )}

                {personalDetails?.email && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      minWidth: "30%",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      className="contact-label text-teal-500"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        // color: "#206955",
                        marginBottom: 0,
                      }}
                    >
                      {cvT.email}:
                    </span>
                    <span
                      className="contact-value"
                      style={{
                        fontSize: "12px",
                        color: "#000",
                        textAlign: "left",
                        lineHeight: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {personalDetails.email}
                    </span>
                  </div>
                )}

                {personalDetails?.address && (
                  <div
                    className="contact-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      minWidth: "30%",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      className="contact-label text-teal-500"
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        // color: "#206955",
                        marginBottom: 0,
                      }}
                    >
                      {cvT.address}:
                    </span>
                    <span
                      className="contact-value"
                      style={{
                        fontSize: "12px",
                        color: "#000",
                        textAlign: "left",
                        lineHeight: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {personalDetails.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.education}
              </div>

              {education.map((edu, i) => (
                <div key={i} className="education-item" style={{ marginBottom: "14px" }}>
                  <div
                    className="education-header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      className="education-title"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#000",
                        marginBottom: 0,
                      }}
                    >
                      {edu.degree || "Degree"} |{" "}
                    </div>
                    <div
                      className="education-date"
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {edu.startDate || ""} {edu.endDate ? "- " + edu.endDate : ""}
                    </div>
                  </div>
                  <div
                    className="education-school text-teal-400"
                    style={{
                      fontSize: "15px",
                      // color: "#01745dff",
                      marginBottom: "6px",
                    }}
                  >
                    {edu.institution || "Institution"}
                  </div>

                  {(edu.course || edu.grade) && (
                    <div className="bullet-points" style={{ marginLeft: "16px" }}>
                      {edu.course && (
                        <div
                          className="bullet-point-container"
                          style={{ display: "flex", alignItems: "flex-start", marginBottom: "6px" }}
                        >
                          <span
                            className="bullet-dot"
                            style={{
                              fontSize: "18px",
                              color: "#333",
                              marginRight: "8px",
                              lineHeight: "16px",
                              marginTop: "2px",
                            }}
                          >
                            •
                          </span>
                          <span
                            className="bullet-text"
                            style={{
                              fontSize: "14px",
                              color: "#333",
                              lineHeight: 1.5,
                              flex: 1,
                            }}
                          >
                            {edu.course}
                          </span>
                        </div>
                      )}
                      {edu.grade && (
                        <div
                          className="bullet-point-container"
                          style={{ display: "flex", alignItems: "flex-start", marginBottom: "6px" }}
                        >
                          <span
                            className="bullet-dot"
                            style={{
                              fontSize: "18px",
                              color: "#333",
                              marginRight: "8px",
                              lineHeight: "16px",
                              marginTop: "2px",
                            }}
                          >
                            •
                          </span>
                          <span
                            className="bullet-text"
                            style={{
                              fontSize: "14px",
                              color: "#333",
                              lineHeight: 1.5,
                              flex: 1,
                            }}
                          >
                            {edu.grade}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {edu.details && (
                    <div
                      className="bullet-text"
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {edu.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* RESEARCH EXPERIENCE */}
          {experience?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-400"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.research_experience}
              </div>

              {experience.map((exp, i) => (
                <div key={i} className="experience-item" style={{ marginBottom: "16px" }}>
                  <div
                    className="job-header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      className="job-title"
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#000",
                      }}
                    >
                      {exp.jobTitle || "Position"} |{" "}
                    </div>
                    <div
                      className="job-date"
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {exp.startDate || ""} {exp.endDate ? "- " + exp.endDate : ""}
                    </div>
                  </div>
                  <div
                    className="company text-teal-500"
                    style={{
                      fontSize: "15px",
                      // color: "#206955",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.company || "Company"}
                  </div>

                  {exp.details && (
                    <div className="bullet-points" style={{ marginLeft: "16px" }}>
                      {exp.details
                        .split("\n")
                        .filter((point) => point.trim())
                        .map((point, j) => (
                          <div
                            key={j}
                            className="bullet-point-container"
                            style={{ display: "flex", alignItems: "flex-start", marginBottom: "6px" }}
                          >
                            <span
                              className="bullet-dot"
                              style={{
                                fontSize: "18px",
                                color: "#333",
                                marginRight: "8px",
                                lineHeight: "16px",
                                marginTop: "2px",
                              }}
                            >
                              •
                            </span>
                            <span
                              className="bullet-text"
                              style={{
                                fontSize: "14px",
                                color: "#333",
                                lineHeight: 1.5,
                                flex: 1,
                              }}
                            >
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
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.projects}
              </div>

              {projects.map((project, i) => (
                <div key={i} className="project-item" style={{ marginBottom: "16px" }}>
                  <div
                    className="project-header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      className="project-title"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#000",
                        marginBottom: "4px",
                      }}
                    >
                      {project.title || "Project Title"}
                    </div>
                    <div
                      className="project-date"
                      style={{
                        fontSize: "14px",
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {project.startDate || ""} {project.endDate ? "- " + project.endDate : ""}
                    </div>
                  </div>
                  {project.organization && (
                    <div
                      className="project-organization"
                      style={{
                        fontSize: "15px",
                        color: "#666",
                        fontStyle: "italic",
                        marginBottom: "6px",
                      }}
                    >
                      {project.organization}
                    </div>
                  )}
                  {project.description && (
                    <div className="bullet-points" style={{ marginLeft: "16px" }}>
                      {project.description
                        .split("\n")
                        .filter((p) => p.trim())
                        .map((p, j) => (
                          <div
                            key={j}
                            className="bullet-point-container"
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              marginBottom: "6px",
                            }}
                          >
                            <span
                              className="bullet-dot"
                              style={{
                                fontSize: "18px",
                                color: "#333",
                                marginRight: "8px",
                                lineHeight: "16px",
                                marginTop: "2px",
                              }}
                            >
                              •
                            </span>
                            <span
                              className="bullet-text"
                              style={{
                                fontSize: "14px",
                                color: "#333",
                                lineHeight: 1.5,
                                flex: 1,
                              }}
                            >
                              {p.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AWARDS & ACTIVITIES */}
          {awardsActivities?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.notable_awards}
              </div>
              <div className="awards-container" style={{ marginLeft: "16px" }}>
                {awardsActivities.map((award, i) => (
                  <div
                    key={i}
                    className="award-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      className="bullet-dot"
                      style={{
                        fontSize: "18px",
                        color: "#333",
                        marginRight: "8px",
                        lineHeight: "16px",
                        marginTop: "2px",
                      }}
                    >
                      •
                    </span>
                    <span
                      className="award-text"
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        flex: 1,
                      }}
                    >
                      {[award.name, award.organization, award.description, award.date]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skills?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.skills}
              </div>
              <div
                className="skills-container"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginLeft: "16px",
                }}
              >
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    className="skill-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      className="bullet-dot"
                      style={{
                        fontSize: "18px",
                        color: "#333",
                        marginRight: "8px",
                        lineHeight: "16px",
                        marginTop: "2px",
                      }}
                    >
                      •
                    </span>
                    <span
                      className="skill-text"
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS & COURSES */}
          {certificates?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.courses_certifications}
              </div>
              <div className="certificates-container" style={{ marginLeft: "16px" }}>
                {certificates.map((cert, i) => (
                  <div
                    key={i}
                    className="certificate-row"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      className="bullet-dot"
                      style={{
                        fontSize: "18px",
                        color: "#333",
                        marginRight: "8px",
                        lineHeight: "16px",
                        marginTop: "2px",
                      }}
                    >
                      •
                    </span>
                    <div
                      className="certificate-info"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="certificate-name"
                        style={{
                          fontSize: "14px",
                          color: "#2c2c2c",
                          fontWeight: 600,
                        }}
                      >
                        {cert.name} -{" "}
                      </span>
                      {cert.date && (
                        <span
                          className="certificate-date"
                          style={{
                            fontSize: "14px",
                            color: "#5b5b5b",
                          }}
                        >
                          {cert.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {languages?.length > 0 && (
            <div className="section" style={{ marginBottom: "18px" }}>
              <div
                className="section-title text-teal-500"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  // color: "#206955",
                  textTransform: "uppercase",
                  marginTop: "15px",
                }}
              >
                {cvT.languages}
              </div>
              <div className="languages-container" style={{ marginLeft: "16px" }}>
                {languages.map((lang, i) => (
                  <div
                    key={i}
                    className="language-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      className="bullet-dot"
                      style={{
                        fontSize: "18px",
                        color: "#333",
                        marginRight: "8px",
                        lineHeight: "16px",
                        marginTop: "2px",
                      }}
                    >
                      •
                    </span>
                    <div
                      className="language-info"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="language-name"
                        style={{
                          fontSize: "14px",
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {lang.name}
                      </span>
                      {lang.proficiency && (
                        <span
                          className="language-level"
                          style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#333",
                          }}
                        >
                          : {lang.proficiency}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}