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
        <h1 className="font-bold text-sm md:text-base ">{t["cv_preview"]}</h1>
        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center cursor-pointer gap-1 bg-white text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          <IoDownloadOutline size={16} />
          {isGenerating ? t["generating"] : t["download_share_file"]}
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir={cvLang == "ar" ? "rtl": cvLang}>
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
          {/* Header - CENTERED */}
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "2px",
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              {personalDetails?.fullName || "ESTELLE DARCY"}
            </h1>
            <div
              style={{
                fontSize: "18px",
                color: "#000",
                marginBottom: "6px",
                fontWeight: 800,
              }}
            >
              {personalDetails?.jobTitle || "PROCESS ENGINEER"}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#373737",
                marginBottom: "20px",
                lineHeight: 1.6,
              }}
            >
              {personalDetails?.address || "123 Anywhere St., Any City"} |{" "}
              {personalDetails?.phone || "00000000000"} |{" "}
              {personalDetails?.email || "hello@reallygreatsite.com"}
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
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.professional_summary}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  textAlign: "justify",
                }}
              >
                {summary}
              </div>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {experience?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.work_experience}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>

              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "16px", color: "#000" }}>
                      {exp.jobTitle || "Position"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#000", fontWeight: 600 }}>
                      {exp.startDate || ""} {exp.endDate ? " - " + exp.endDate : ""}
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#000", marginBottom: "6px" }}>
                    {exp.company || "Company"}
                  </div>

                  {exp.details && (
                    <div style={{ marginLeft: "10px" }}>
                      {exp.details
                        .split("\n")
                        .filter((point) => point.trim())
                        .map((point, j) => (
                          <div
                            key={j}
                            style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}
                          >
                            <span
                              style={{
                                fontSize: "20px",
                                color: "#333",
                                marginRight: "4px",
                                lineHeight: "12px",
                                marginTop: "1px",
                              }}
                            >
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

          {/* EDUCATION */}
          {education?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.education}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>

              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>
                      {edu.course || "Course"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#000", fontWeight: 600 }}>
                      {edu.startDate || ""} {edu.endDate ? " - " + edu.endDate : ""}
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                    {edu.institution || "Institution"}
                  </div>
                  {(edu.degree || edu.grade) && (
                    <div style={{ marginLeft: "10px" }}>
                      {edu.degree && (
                        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontSize: "20px",
                              color: "#333",
                              marginRight: "4px",
                              lineHeight: "12px",
                              marginTop: "1px",
                            }}
                          >
                            •
                          </span>
                          <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
                            {edu.degree}
                          </span>
                        </div>
                      )}
                      {edu.grade && (
                        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                          <span
                            style={{
                              fontSize: "20px",
                              color: "#333",
                              marginRight: "4px",
                              lineHeight: "12px",
                              marginTop: "1px",
                            }}
                          >
                            •
                          </span>
                          <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
                            Grade: {edu.grade}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {edu.details && (
                    <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}>
                      {edu.details}
                    </div>
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
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.skills}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>
              <div>
                {skills.map((skill, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#333",
                        marginRight: "4px",
                        lineHeight: "12px",
                        marginTop: "1px",
                      }}
                    >
                      •
                    </span>
                    <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
                      {skill.name || "Skill"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certificates?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.certifications}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>
              <div>
                {certificates.map((cert, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "#333",
                        marginRight: "4px",
                        lineHeight: "12px",
                        marginTop: "1px",
                      }}
                    >
                      •
                    </span>
                    <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
                      {cert.name || "Certificate"}
                    </span>
                  </div>
                ))}
              </div>
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
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.projects}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>

              {projects.map((project, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>
                      {project.title || "Project Title"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#000", fontWeight: 600 }}>
                      {project.startDate || ""} {project.endDate ? " - " + project.endDate : ""}
                    </div>
                  </div>
                  {project.organization && (
                    <div style={{ fontSize: "14px", color: "#666", fontStyle: "italic", marginBottom: "6px" }}>
                      {project.organization}
                    </div>
                  )}
                  {project.description && (
                    <div style={{ marginLeft: "10px" }}>
                      {project.description
                        .split("\n")
                        .filter((p) => p.trim())
                        .map((p, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", marginBottom: "4px" }}>
                            <span
                              style={{
                                fontSize: "20px",
                                color: "#333",
                                marginRight: "4px",
                                lineHeight: "12px",
                                marginTop: "1px",
                              }}
                            >
                              •
                            </span>
                            <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>
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

          {/* ADDITIONAL INFORMATION */}
          {(languages?.length > 0 || awardsActivities?.length > 0) && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0",
                  color: "#000",
                  textTransform: "uppercase",
                }}
              >
                {cvT.additional_information}
              </div>
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#000",
                  borderRadius: "2px",
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              ></div>
              <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {languages?.length > 0 && (
                  <div style={{ marginBottom: "5px" }}>
                    <span style={{ fontWeight: "bold" }}>{cvT.languages}:</span>{" "}
                    {languages.map((lang) => lang.name).join(", ")}
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
    </div>
  );
}