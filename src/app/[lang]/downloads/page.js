"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IoDownloadOutline, IoTrashOutline } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

// استيراد react-pdf بشكل ديناميكي (client-side only)
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import("react-pdf").then((mod) => mod.Page),
  { ssr: false }
);

// إعداد worker بعد ما الصفحة تحمل
if (typeof window !== "undefined") {
  import("react-pdf").then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

const safeSetItem = (key, value) => {
  try { localStorage.setItem(key, value); } 
  catch { try { sessionStorage.setItem(key, value); } catch (e) { console.error(`Failed to store ${key}`, e); } }
};

const safeGetItem = (key) => {
  try { return localStorage.getItem(key) || sessionStorage.getItem(key); } 
  catch { try { return sessionStorage.getItem(key); } catch (e) { console.error(`Failed to get ${key}`, e); return null; } }
};

function PdfPreview({ pdfData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // استيراد CSS بعد ما الكومبوننت يحمل
    import('react-pdf/dist/Page/TextLayer.css');
    import('react-pdf/dist/Page/AnnotationLayer.css');
  }, []);

  if (!mounted) {
    return <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-xl">Loading...</div>;
  }

  return (
    <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden relative">
      <Document
        file={pdfData}
        loading={<div className="text-gray-500">Loading preview...</div>}
        error={<div className="text-red-500">Failed to load PDF</div>}
      >
        <Page pageNumber={1} width={300} />
      </Document>
    </div>
  );
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const stored = safeGetItem("downloads");
    if (stored) setDownloads(JSON.parse(stored));
  }, []);

  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = item.data;
    link.download = item.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


const handleDelete = (index) => {
  const itemName = downloads[index].fileName;

  // عرض Toast للتأكيد
  toast(
    (tb) => (
      <div className="flex flex-col gap-2">
        <span>{t.confirm_delete}  "{itemName}"؟</span>
        <div className="flex gap-2 mt-2">
          <button
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm cursor-pointer"
            onClick={() => {
              const updated = [...downloads];
              updated.splice(index, 1);
              setDownloads(updated);
              safeSetItem("downloads", JSON.stringify(updated));
              toast.dismiss(tb.id); // إغلاق الـ toast
              toast.success(t.deleted_success);
            }}
          >
            {t.yes}
          </button>
          <button
            className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm cursor-pointer"
            onClick={() => toast.dismiss(tb.id)} // إلغاء الحذف
          >
            {t.no}
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};


  return (
    <>
      <style jsx global>{`
        .react-pdf__Page{
          position: absolute !important;
          left: 0;
          top: 0;
        }
      `}</style>
      <Navbar />
      {downloads.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          {t.no_downloads_yet}
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {downloads.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <PdfPreview pdfData={item.data} />
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-gray-800 font-semibold truncate">{item.fileName}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-sm cursor-pointer"
                    >
                      <IoDownloadOutline size={16} /> {t.download}
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm cursor-pointer"
                    >
                      <IoTrashOutline size={16} /> {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}