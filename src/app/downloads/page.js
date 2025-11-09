"use client";

import { useEffect, useState } from "react";
import { IoDownloadOutline, IoTrashOutline } from "react-icons/io5";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);

  // Helpers للـ storage
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

// ------------------ استخدام الكود ------------------

// تحميل الملفات المحفوظة عند mount
useEffect(() => {
  const stored = safeGetItem("downloads");
  if (stored) setDownloads(JSON.parse(stored));
}, []);

// تحميل ملف
const handleDownload = (item) => {
  const link = document.createElement("a");
  link.href = item.data;
  link.download = item.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// حذف ملف
const handleDelete = (index) => {
  const updated = [...downloads];
  updated.splice(index, 1);
  setDownloads(updated);
  safeSetItem("downloads", JSON.stringify(updated));
};


  if (downloads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No downloads yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {downloads.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* PDF Preview with iframe */}
            <div className="w-full h-64">
              <iframe
                src={item.data + "#toolbar=0"}
                title={item.fileName}
                className="w-full h-full"
                frameBorder="0"
              />
            </div>

            {/* File Info & Actions */}
            <div className="p-4 flex flex-col gap-2">
              <p className="text-gray-800 font-semibold truncate">{item.fileName}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(item)}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-sm"
                >
                  <IoDownloadOutline size={16} /> Download
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="flex-1 flex items-center  cursor-pointerjustify-center gap-1 px-2 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  <IoTrashOutline size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
