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
  const { cvT } = useCVLanguage();
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

  #cv-template .profile-image {
    width: 65px !important;
    height: 65px !important;
    border-radius: 32.5px !important;
    margin-bottom: 12px !important;
  }

  #cv-template .name {
    font-size: 12px !important;
  }

  #cv-template .title {
    font-size: 10px !important;
  }

  #cv-template .section-title {
    font-size: 10px !important;
  }

  #cv-template .contact-item {
    font-size: 5px !important;
  }

  #cv-template .education-item {
    margin-bottom: 6px !important;
  }

  #cv-template .project-title {
    font-size: 9px !important;
  }

  #cv-template .project-description {
    font-size: 7px !important;
    line-height: 9px !important;
  }

  #cv-template .language-name {
    font-size: 6px !important;
  }

  #cv-template .language-proficiency {
    font-size: 5px !important;
  }

  #cv-template .skill-name {
    font-size: 6px !important;
  }

  #cv-template .item-title {
    font-size: 7px !important;
  }

  #cv-template .item-description {
    font-size: 7px !important;
    line-height: 10px !important;
  }

  #cv-template .section {
    margin-bottom: 15px !important;
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
          borderRadius: '4px',
          
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

      {/* MAIN */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '1rem',
        overflowY: 'auto'
      }} dir="ltr">
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
            background: '#2c3e50',
            color: 'white',
            padding: '40px 25px'
          }}>
            {personalDetails?.photoPreview && (
              <div className="profile-image" style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                overflow: 'hidden',
                margin: '0 auto 25px',
                border: '3px solid #dddcdc'
              }}>
                <img src={personalDetails.photoPreview} alt="Profile" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
            )}
            
            <div className="name" style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '5px',
              color: 'white',
              textAlign: 'center',
              textTransform: "capitalize"
            }}>{personalDetails?.fullName }</div>
            <div className="title" style={{
              fontSize: '16px',
              color: '#3498db',
              marginBottom: '20px',
              fontWeight: 'normal',
              textAlign: 'center',
              textTransform: "capitalize"

            }}>{personalDetails?.jobTitle }</div>
            
            {/* CONTACT */}
            <div id="contact-section" className="contact-section section" style={{ marginBottom: "25px" }}>
              <div id="contact-title" className="previewSectionTitle section-title" style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "0px",
                color: "white",
                textAlign: "left",
                paddingBottom: "5px",
                textTransform: "uppercase",
              }}>
                {cvT.contact}
              </div>
              {personalDetails?.phone && (
                <div className="previewContact contact-item" style={{ 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  color: "#dddcdc",
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  {personalDetails.phone}
                </div>
              )}
              {personalDetails?.email && (
                <div className="previewContact contact-item" style={{ 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  color: "#dddcdc",
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  {personalDetails.email}
                </div>
              )}
              {personalDetails?.address && (
                <div className="previewContact contact-item" style={{ 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  color: "#dddcdc",
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  {personalDetails.address}
                </div>
              )}
              {personalDetails?.website && (
                <div className="previewContact contact-item" style={{ 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  color: "#dddcdc",
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left'
                }}>
                  {personalDetails.website}
                </div>
              )}
            </div>
            
            
            
            {/* SKILLS */}
            {skills?.length > 0 && (
              <div id="skills-section" className="skills-section contact-section section" style={{ marginBottom: "25px" }}>
                <div className="previewSectionTitle section-title" id="skills-title" style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "0px",
                  color: "white",
                  paddingBottom: "5px",
                  textAlign: "left",
                  textTransform: "uppercase",
                }}>
                  {cvT.skills}
                </div>
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skillText skill-item" id={`skill-${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                      <div className="skill-circle" style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        border: "1.5px solid #dddcdc",
                        background: "transparent",
                        marginRight: "8px",
                      }}></div>
                      <div className="skill-name" style={{ color: "#dddcdc", fontSize: "14px" }}>{skill.name || "Skill"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* LANGUAGES */}
            {languages?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: 'white',
                  paddingBottom: '5px',
                  textAlign: 'left',
                  textTransform: "uppercase",
                }}>{cvT.languages}</div>
                <div className="languages-list">
                  {languages.map((lang, index) => (
                    <div key={index} className="language-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <div className="language-circle" style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: '1.5px solid #dddcdc',
                        background: 'transparent',
                        marginRight: '8px'
                      }}></div>
                      <div className="language-name" style={{ fontSize: '14px', fontWeight: 'bold', color: '#dddcdc', marginRight: '8px' }}>
                        {lang.name}
                      </div>
                      <div className="language-proficiency" style={{ fontSize: '12px', color: '#bdc3c7' }}>({lang.proficiency || ''})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* العمود الأيمن */}
          <div id="right-column" className="right-column" style={{ width: '65%', padding: '60px 35px 35px 35px' }}>
            
            {/* PROFILE */}
            {summary && (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '0px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  textTransform: "uppercase",
                }}>{cvT.summary}</div>
                <div className="item-description" style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>{summary}</div>
              </div>
            )}
            
            {/* WORK EXPERIENCE */}
            {experience?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '0px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  textTransform: "uppercase",
                }}>{cvT.work_experience}</div>
                {experience.map((exp, index) => (
                  <div key={index} className="item" style={{ marginBottom: '15px' }}>
                    <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div className="item-title" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {exp.jobTitle || 'Position'}
                      </div>
                      <div className="item-date" style={{ fontSize: '14px', color: '#666' }}>
                        {exp.startDate || ''} {exp.endDate ? ` - ${exp.endDate}` : ''}
                      </div>
                    </div>
                    <div className="item-subtitle" style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '5px' }}>
                      {exp.company || 'Company'}
                    </div>
                    {exp.details && (
                      <div className="item-description" style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>
                        {exp.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* PROJECTS */}
            {projects?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '0px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  textTransform: "uppercase",
                }}>{cvT.projects}</div>
                {projects.map((project, index) => (
                  <div key={index} className="project-item" style={{ marginBottom: '15px' }}>
                    <div className="project-title" style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50', marginBottom: '5px' }}>
                      {project.title || 'Project Title'}
                    </div>
                    {project.technologies && (
                      <div className="project-technologies" style={{ fontSize: '14px', color: '#333', fontStyle: 'italic', marginBottom: '5px' }}>
                        {project.technologies}
                      </div>
                    )}
                    {project.description && (
                      <div className="project-description" style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>
                        {project.description}
                      </div>
                    )}
                    {(project.startDate || project.endDate) && (
                      <div className="project-date" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        {project.startDate || ''} {project.endDate ? ` - ${project.endDate}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* EDUCATION */}
            {education?.length > 0 && (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '0px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  textTransform: "uppercase",
                }}>{cvT.education}</div>
                {education.map((edu, index) => (
                  <div key={index} className="education-item" style={{ marginBottom: '15px' }}>
                    <div className="education-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div className="education-title" style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>
                        {edu.course || 'Course'}
                      </div>
                      <div className="education-date" style={{ fontSize: '12px', color: '#666' }}>
                        {edu.startDate || ''} {edu.endDate ? ` - ${edu.endDate}` : ''}
                      </div>
                    </div>
                    {edu.degree && (
                      <div className="education-degree" style={{ fontSize: '14px', color: '#333', fontStyle: 'italic', marginBottom: '3px' }}>
                        {edu.degree}
                      </div>
                    )}
                    <div className="education-institution" style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginBottom: '3px' }}>
                      {edu.institution || 'Institution'}
                    </div>
                    {edu.grade && (
                      <div className="education-grade" style={{ fontSize: '13px', color: '#555', marginBottom: '3px' }}>
                        <span className="grade" style={{ fontSize: '16px', color: '#777', fontWeight: '700' }}>Grade: </span>{edu.grade}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE */}
            {objective&& (
              <div className="section" style={{ marginBottom: '25px' }}>
                <div className="section-title" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  paddingBottom: '5px',
                  textTransform: "uppercase",
                }}>{cvT.objective}</div>
                <div className="item-description" style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>{objective}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}