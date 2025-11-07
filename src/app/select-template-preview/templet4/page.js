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

  #cv-template .previewName {
    font-size: 14px !important;
  }

  #cv-template .previewJobTitle {
    width: 20px !important;
    height: 3px !important;
    margin-bottom: 10px !important;
  }

  #cv-template .previewSectionTitle {
    font-size: 10px !important;
  }

  #cv-template .previewSectionTitleDark {
    font-size: 10px !important;
  }

  #cv-template .previewContact {
    font-size: 5px !important;
  }

  #cv-template .educationItem {
    margin-bottom: 6px !important;
  }

  #cv-template .projectTitle {
    font-size: 9px !important;
  }

  #cv-template .projectDescription {
    font-size: 7px !important;
    line-height: 9px !important;
  }

  #cv-template .languageName {
    font-size: 6px !important;
  }

  #cv-template .languageProficiency {
    font-size: 5px !important;
  }

  #cv-template .skillText {
    font-size: 6px !important;
  }

  #cv-template .referenceName {
    font-size: 7px !important;
  }

  #cv-template .referenceContact {
    font-size: 5px !important;
  }

  #cv-template .previewObjective {
    font-size: 7px !important;
    line-height: 10px !important;
  }
    .cc{
        width: 20px;
    height: 3px;
    background: rgb(23, 55, 78);
    margin-bottom: 10px;
    }
    .contact-section{
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
          borderRadius: '4px'
        }}>
          <IoArrowBack size={18} />
        </button>
        <h1 style={{ fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>CV Preview</h1>
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
          {isGenerating ? "Generating..." : "Download PDF"}
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
        <div id="cv-template"
    className="cv-template" style={{
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
          <div  className="left-column"
      id="left-column" style={{
            width: '35%',
            background: '#163853',
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
                border: '3px solid white'
              }}>
                <img src={personalDetails.photoPreview} alt="Profile" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
            )}
            
            {/* CONTACT */}
            <div id="contact-section" className="contact-section" style={{ marginBottom: "30px" }}>
        <div
          id="contact-title"
          className="previewSectionTitle"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "12px",
            marginTop: "15px",
            color: "#f9ffff",
            textAlign: "left",
            borderBottom: "2px solid #f9ffff",
            paddingBottom: "5px",
          }}
        >
          CONTACT
          {console.log(personalDetails)}
        </div>
        {personalDetails?.phone && (
          <div className="previewContact" style={{ marginBottom: "8px", fontSize: "14px", color: "#f3f9f9" }}>
            {personalDetails.phone}
          </div>
        )}
        {personalDetails?.email && (
          <div className="previewContact" style={{ marginBottom: "8px", fontSize: "14px", color: "#f3f9f9" }}>
            {personalDetails.email}
          </div>
        )}{personalDetails?.address && (
          <div className="previewContact" style={{ marginBottom: "8px", fontSize: "14px", color: "#f3f9f9" }}>
            {personalDetails.address}
          </div>
        )}{personalDetails?.website && (
          <div className="previewContact" style={{ marginBottom: "8px", fontSize: "14px", color: "#f3f9f9" }}>
            {personalDetails.website}
          </div>
        )}
      </div>
            
            {/* EDUCATION */}
            {education?.length > 0 && (
              <div className="contact-section" style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#f9ffff',
                  borderBottom: '2px solid #f9ffff',
                  paddingBottom: '5px'
                }}>EDUCATION</div>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', color: '#ecfdff', marginBottom: '8px', textAlign: 'left' }}>
                      {edu.startDate || ''} {edu.endDate ? ` - ${edu.endDate}` : ''}
                    </div>
                    <div style={{ fontSize: '15px', color: '#ecfdff', fontWeight: 'bold', marginBottom: '5px' }}>
                      {edu.institution || 'Institution'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '4px',
                        background: 'white',
                        marginRight: '10px'
                      }}></div>
                      <div style={{ fontSize: '14px', fontWeight: '300', color: 'white' }}>
                        {edu.degree || 'Degree'}
                      </div>
                    </div>
                    {edu.grade && (
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '4px',
                          background: 'white',
                          marginRight: '10px'
                        }}></div>
                        <div style={{ fontSize: '13px', color: '#dddcdc' }}>{edu.grade}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* SKILLS */}
            {skills?.length > 0 && (
        <div id="skills-section" className="skills-section contact-section" style={{ marginBottom: "30px" }}>
          <div
            className="previewSectionTitle"
            id="skills-title"
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#f9ffff",
              borderBottom: "2px solid #f9ffff",
              paddingBottom: "5px",
            }}
          >
            SKILLS
          </div>
          {skills.map((skill, index) => (
            <div key={index} className="skillText" id={`skill-${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <div
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "4px",
                  background: "#f2fbff",
                  marginRight: "10px",
                }}
              ></div>
              <div style={{ color: "#f2fbff", fontSize: "14px" }}>{skill.name || "Skill"}</div>
            </div>
          ))}
        </div>
      )}
            
            {/* LANGUAGES */}
            {languages?.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#f9ffff',
                  borderBottom: '2px solid #f9ffff',
                  paddingBottom: '5px'
                }}>LANGUAGES</div>
                {languages.map((lang, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{
                      width: '4px',
                          height: '4px',
                      borderRadius: '4px',
                      background: '#dddcdc',
                      marginRight: '10px'
                    }}></div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#dddcdc', marginRight: '8px' }}>
                      {lang.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#bdc3c7' }}>({lang.proficiency || ''})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* العمود الأيمن */}
          <div  id="right-column" className="right-column" style={{ width: '65%', padding: '60px 35px 35px 35px' }}>
            <div id="header-info" className="header-info" style={{ paddingLeft: '15px', marginBottom: '30px' }}>
              <div id="previewName" className="previewName" style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '5px',
                color: '#565656'
              }}>{personalDetails?.fullName || 'RICHARD SANCHEZ'}</div>
              <div  style={{
                fontSize: '16px',
                color: '#474747',
                marginBottom: '10px'
              }}>{personalDetails?.jobTitle || 'MARKETING MANAGER'}</div>
              <div id="previewJobTitle" className="previewJobTitle" style={{
                width: '70px',
                height: '6px',
                background: '#17374e',
                marginBottom: '30px'
              }}></div>
            </div>
            
            {/* PROFILE */}
            {objective && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#143852',
                  borderBottom: '2px solid #143852',
                  paddingBottom: '5px'
                }}>PROFILE</div>
                <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.6 }}>{objective}</div>
              </div>
            )}
            
            {/* WORK EXPERIENCE */}
            {experience?.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#143852',
                  borderBottom: '2px solid #143852',
                  paddingBottom: '5px'
                }}>WORK EXPERIENCE</div>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  <div style={{
                    margin: '5px 0',
                    width: '2px',
                    background: '#08243ab0',
                    marginRight: '-5px',
                    borderRadius: '2px'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    {experience.map((exp, index) => (
                      <div key={index} style={{ marginBottom: '25px' }}>
                        <div style={{ display: 'flex', marginBottom: 0 }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '6px',
                            background: '#163853',
                            marginRight: '10px',
                            marginTop: '5px',
                            border: '2px solid #163853'
                          }}></div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#565656', flex: 1 }}>
                                {exp.company || 'Company'}
                              </div>
                              <div style={{ fontSize: '14px', color: '#464646', textAlign: 'right' }}>
                                {exp.startDate || ''} {exp.endDate ? ` - ${exp.endDate}` : ''}
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#484848', fontWeight: '500', marginBottom: '5px' }}>
                              {exp.jobTitle || 'Position'}
                            </div>
                            {exp.details && (
                              <div style={{ marginTop: '8px' }}>
                                {exp.details.split('\n').map((detail, i) => 
                                  detail.trim() ? (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '4px' }}>
                                      <div style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '2px',
                                        background: '#163853',
                                        marginRight: '8px',
                                        marginTop: '6px'
                                      }}></div>
                                      <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>
                                        {detail.trim()}
                                      </div>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* REFERENCES */}
            {references?.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#143852',
                  borderBottom: '2px solid #143852',
                  paddingBottom: '5px'
                }}>REFERENCE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {references.map((ref, index) => (
                    <div key={index} style={{ width: '48%', marginBottom: '20px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#515151', marginBottom: '5px' }}>
                        {ref.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#515151', marginBottom: '3px' }}>
                        {ref.jobTitle}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '3px' }}>
                        {ref.company}
                      </div>
                      {ref.phone && (
                        <div style={{ fontSize: '13px', color: '#555' }}>
                          <span style={{ fontWeight: 'bold' }}>Phone: </span>{ref.phone}
                        </div>
                      )}
                      {ref.email && (
                        <div style={{ fontSize: '13px', color: '#555' }}>
                          <span style={{ fontWeight: 'bold' }}>Email: </span>{ref.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {projects?.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#143852',
                  borderBottom: '2px solid #143852',
                  paddingBottom: '5px'
                }}>PROJECTS</div>
                {projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50', marginBottom: '5px' }}>
                      {project.title || 'Project Title'}
                    </div>
                    {project.technologies && (
                      <div style={{ fontSize: '14px', color: '#3498db', fontStyle: 'italic', marginBottom: '5px' }}>
                        {project.technologies}
                      </div>
                    )}
                    {project.description && (
                      <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>
                        {project.description}
                      </div>
                    )}
                    {(project.startDate || project.endDate) && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        {project.startDate || ''} {project.endDate ? ` - ${project.endDate}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}