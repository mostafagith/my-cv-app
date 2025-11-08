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

  // ✅ دالة التوليد المحترفة مع padding بين الصفحات
  const handleGenerateAndDownload = async () => {
    try {
      setIsGenerating(true);
      const content = document.getElementById("cv-template");
      const fileName = `${cvData?.personalDetails?.fullName || "MyCV"}.pdf`;

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
      content.style.maxWidth = "896px";
      content.style.width = "896px";

      // إنشاء Canvas بجودة عالية
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

      // ✅ Padding علوي وسفلي
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

      // إعادة الـ styles الأصلية
      Object.keys(originalStyles).forEach((key) => {
        content.style[key] = originalStyles[key];
      });

      pdf.save(fileName);
      try {
        const existingDownloads = JSON.parse(localStorage.getItem("downloads") || "[]");

        // تحويل PDF إلى Base64
        const pdfBase64 = pdf.output("datauristring"); // هيرجع 'data:application/pdf;base64,...'

        existingDownloads.push({
          fileName,
          date: new Date().toISOString(),
          data: pdfBase64, // هنا خزّنا الـ PDF كامل
        });

        localStorage.setItem("downloads", JSON.stringify(existingDownloads));
      } catch (err) {
        console.error("Failed to save download info in localStorage:", err);
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
      {/* ✅ CSS للطباعة والموبايل */}
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
            font-size: 11px !important;
            line-height: 1.4;
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
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded cursor-pointer">
          <IoArrowBack size={18} />
        </button>
        <h1 className="font-bold text-sm md:text-base">CV Preview</h1>

        <button
          onClick={handleGenerateAndDownload}
          disabled={isGenerating}
          className={`flex items-center gap-1 bg-white text-teal-600 px-3 py-1.5 cursor-pointer rounded-lg text-xs font-semibold transition ${
            isGenerating ? "opacity-60" : "hover:bg-teal-50"
          }`}
        >
          <IoDownloadOutline size={16} />
          {isGenerating ? "Generating..." : "Download PDF"}
        </button>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir="ltr">
        <div
          id="cv-template"
          className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-3 md:p-8 border border-gray-200"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {/* HEADER INFO */}
          <div className="flex justify-between items-start gap-6 mb-2">
            {personalDetails?.photoPreview && (
              <div style={{ width: "125px", height: "150px", overflow: "hidden" }}>
                <img
                  src={personalDetails.photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                  color: "#063a6c",
                  textTransform: "uppercase",
                }}
              >
                {personalDetails.fullName || "Full Name"}
              </h1>

              <div className="mt-2 space-y-1 text-sm">
                <div>
                  <b>Address:</b> {personalDetails.address || ""}
                </div>
                <div>
                  <b>Phone:</b> {personalDetails.phone || ""}
                </div>
                <div>
                  <b>Email:</b> {personalDetails.email || ""}
                </div>
                <div>
                  <b>Website:</b> {personalDetails.website || ""}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[2px] bg-[#063a6c] my-4" />

          {/* SUMMARY */}
          {personalDetails.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase" style={{ color: "#063a6c" }}>
                Summary
              </h2>
              <div
                className="h-[1.5px] w-full mb-2"
                style={{ backgroundColor: "#1e4468aa",height:"1.5px" }}
              />
              <p className="text-[13px] text-justify">{personalDetails.summary}</p>
            </div>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase" style={{ color: "#063a6c" }}>
                Work Experience
              </h2>
              <div
                className="h-[1.5px] w-full mb-2"
                style={{ backgroundColor: "#1e4468aa",height:"1.5px" }}
              />
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{exp.jobTitle}</div>
                    <div className="text-sm font-medium">
                      {exp.startDate} {exp.endDate && ` - ${exp.endDate}`}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{exp.company}</div>
                  {exp.details && (
                    <ul className="ml-4 list-disc text-[12px]">
                      {exp.details
                        .split("\n")
                        .filter(Boolean)
                        .map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase" style={{ color: "#063a6c" }}>
                Projects
              </h2>
              <div
                className="h-[1.5px] w-full mb-2"
                style={{ backgroundColor: "#1e4468aa",height:"1.5px" }}
              />
              {projects.map((p, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm font-medium">
                      {p.startDate} {p.endDate && ` - ${p.endDate}`}
                    </div>
                  </div>
                  {p.organization && (
                    <div className="text-sm italic text-gray-600">{p.organization}</div>
                  )}
                  {p.description && (
                    <ul className="ml-4 list-disc text-[12px]">
                      {p.description
                        .split("\n")
                        .filter(Boolean)
                        .map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold uppercase" style={{ color: "#063a6c" }}>
                Education
              </h2>
              <div
                className="h-[1.5px] w-full mb-2"
                style={{ backgroundColor: "#1e4468aa",height:"1.5px" }}
              />
              {education.map((e, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{e.course}</div>
                    <div className="text-sm font-medium">
                      {e.startDate} {e.endDate && ` - ${e.endDate}`}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{e.institution}</div>
                </div>
              ))}
            </div>
          )}

          {/* ADDITIONAL INFO */}
          <div>
            <h2 className="text-lg font-bold uppercase" style={{ color: "#063a6c" }}>
              Additional Information
            </h2>
            <div
              className="h-[1.5px] w-full mb-2"
              style={{ backgroundColor: "#1e4468aa",height:"1.5px" }}
            />
            {skills.length > 0 && (
              <div className="text-[12px] mb-1">
                <b>Technical Skills:</b> {skills.map((s) => s.name).join(", ")}
              </div>
            )}
            {languages.length > 0 && (
              <div className="text-[12px] mb-1">
                <b>Languages:</b> {languages.map((l) => l.name).join(", ")}
              </div>
            )}
            {certificates.length > 0 && (
              <div className="text-[12px] mb-1">
                <b>Certifications:</b> {certificates.map((c) => c.name).join(", ")}
              </div>
            )}
            {awardsActivities.length > 0 && (
              <div className="text-[12px] mb-1">
                <b>Awards/Activities:</b> {awardsActivities.map((a) => a.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
