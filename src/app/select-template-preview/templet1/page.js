"use client";

import { useEffect, useState } from "react";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export default function PdfPreview() {
  const [cvData, setCvData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      setIsGenerating(true);
      const content = document.getElementById("cv-preview");
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
const existingDownloads = safeGetItem("downloads");
  // تحويل PDF إلى Base64
  const pdfBase64 = pdf.output("datauristring"); // 'data:application/pdf;base64,...'

  existingDownloads.push({
    fileName,
    date: new Date().toISOString(),
    data: pdfBase64, // حفظ PDF كامل
  });


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

  safeSetItem("downloads", JSON.stringify(existingDownloads));
  toast.success(t["PDF saved successfully!"] || "PDF saved successfully!");
} catch (err) {
  console.error("Failed to save PDF to downloads", err);
  toast.error(t["Failed to save PDF"] || "Failed to save PDF");
}

      setTimeout(() => {
        alert(
          "✅ Success! The PDF has been downloaded.\nYou can find it in your Downloads folder."
        );
      }, 500);
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

      {/* Header */}
      <header className="bg-teal-600 text-white py-3 px-5 md:py-6 md:px-20 flex items-center justify-between shadow">
        <button onClick={handleBack} className="p-1 hover:bg-teal-700 rounded cursor-pointer">
          <IoArrowBack size={18} />
        </button>
        <h1 className="font-bold text-sm md:text-base">CV Preview</h1>

        <div className="flex gap-2">
          <button
            onClick={handleGenerateAndDownload}
            disabled={isGenerating}
            className={`flex cursor-pointer items-center gap-1 bg-white text-teal-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold transition ${
              isGenerating ? "opacity-60" : "hover:bg-teal-50"
            }`}
            title="Download PDF to Share"
          >
            <IoDownloadOutline size={16} />
            {isGenerating ? "Generating..." : "Download & Share File"}
          </button>
        </div>
      </header>

      {/* CV Content */}
      <main className="flex-1 flex justify-center py-2 px-1 md:py-4 md:px-8 overflow-y-auto" dir="ltr">
        <div
          id="cv-preview"
          className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-3 md:p-8 border border-gray-200"
        >
          {/* Personal Details */}
          <div className="border-b border-b-2 border-[#009689] text-left mb-2">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#009689] capitalize">
              {cvData.personalDetails?.fullName || "Unnamed"}
            </h1>
          </div>
          <p className="contact-info text-gray-500 text-[10px] md:text-sm lg:text-base text-left mb-3">
            {cvData.personalDetails?.address || ""} |
            {" " + cvData.personalDetails?.phone || ""} |
            {" " + cvData.personalDetails?.email || "No Email"}
          </p>

          {/* Summary */}
          {cvData.personalDetails.summary && (
            <section className="mb-3 md:mb-4">
              <h2 className="font-semibold text-sm md:text-lg lg:text-xl text-teal-600 mb-1 md:mb-2">
                Profile
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
                Experience
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
                            className="text-gray-700 text-[10px] md:text-sm lg:text-base text-left"
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
                Education
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
                Skills
              </h2>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                {cvData.skills.map((s, i) => (
                  <li
                    key={i}
                    className="py-0.5 rounded-md text-[10px] md:text-sm lg:text-base text-left text-gray-700"
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
                Courses & Certifications
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
                Languages
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
    </div>
  );
}