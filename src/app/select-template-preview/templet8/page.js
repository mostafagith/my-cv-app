"use client";

import { useEffect, useState } from "react";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export default function PdfPreview() {
  const [cvData, setCvData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const storedCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
    if (storedCV && Object.keys(storedCV).length > 0) {
      setCvData(storedCV);
    } else {
      alert("No CV data found!");
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      }
    }
  }, []);

  const handleGenerateAndDownload = async () => {
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
        const existingDownloads = JSON.parse(localStorage.getItem("downloads") || "[]");
        const pdfBase64 = pdf.output("datauristring");
        existingDownloads.push({
          fileName,
          date: new Date().toISOString(),
          data: pdfBase64,
        });
        localStorage.setItem("downloads", JSON.stringify(existingDownloads));
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
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded">
          ← Back
        </button>
        <h1 className="font-bold text-sm md:text-base">CV Preview</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center gap-1 bg-white text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          📥 {isGenerating ? "Generating..." : "Download PDF"}
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir="ltr">
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
                      ✉
                    </div>
                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
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
                      🌐
                    </div>
                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
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
                      📍
                    </div>
                    <div
                      className="contact-text"
                      style={{
                        flex: 1,
                        color: "#201f1dff",
                        fontSize: "12px",
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
                    SKILLS
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
                          marginRight: "8px",
                          lineHeight: "14px",
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
                    LANGUAGES
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
                {personalDetails?.fullName || "FULL NAME"}
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
                {personalDetails?.jobTitle || "JOB TITLE"}
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
                    PROFESSIONAL SUMMARY
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
                    WORK EXPERIENCE
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
                    EDUCATION
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
                    PROJECTS
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
                    AWARDS & ACTIVITIES
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
                    COURSE & CERTIFICATION
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
    </div>
  );
}