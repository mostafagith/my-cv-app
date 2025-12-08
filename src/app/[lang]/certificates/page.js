"use client";

import { useState, useEffect } from "react";
import { IoArrowBack, IoTrash, IoPencil, IoAdd, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";

export default function CertificatesPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const [certificates, setCertificates] = useState([]);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

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

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

// ------------------------ main logic ------------------------

// تحميل الشهادات عند mount
useEffect(() => {
  const storedCV = safeParse(safeGetItem("currentCV"));
  setCertificates(storedCV.certificates || []);
}, []);

// حفظ الشهادات بدون حذف القديم
const saveToLocalStorage = (newCertificates) => {
  const storedCV = safeParse(safeGetItem("currentCV"));
  const updatedCV = { ...storedCV, certificates: newCertificates };
  safeSetItem("currentCV", JSON.stringify(updatedCV));
  setCertificates(newCertificates);
};

// إعادة تهيئة الفورم
const resetForm = () => {
  setName("");
  setIssuer("");
  setDate("");
  setDescription("");
  setEditingId(null);
};

// إضافة أو تعديل شهادة
const handleAddCertificate = () => {
  // التحقق من كل شهادة موجودة مسبقاً
  for (let i = 0; i < certificates.length; i++) {
    const certificate = certificates[i];
    if (!certificate.name?.trim()) {
      toast.error(`${t["please_enter_certificate_name"]} (${t["certificate"]} ${i + 1})`);
      return;
    }
    if (!certificate.issuer?.trim()) {
      toast.error(`${t["please_enter_certificate_issuer"]} (${t["certificate"]} ${i + 1})`);
      return;
    }
  }

  const newCertificate = {
    id: editingId || Date.now().toString(),
    name: name.trim(),
    issuer: issuer.trim(),
    date: date.trim(),
    description: description.trim(),
  };

  let updatedCertificates;
  if (editingId) {
    updatedCertificates = certificates.map((c) =>
      c.id === editingId ? newCertificate : c
    );
    toast.success(t["Certificate updated successfully!"]);
  } else {
    updatedCertificates = [...certificates, newCertificate];
    toast.success(t["Certificate added successfully!"]);
  }

  saveToLocalStorage(updatedCertificates);
  resetForm();
};

// تعديل شهادة
const handleEdit = (certificate) => {
  setName(certificate.name);
  setIssuer(certificate.issuer);
  setDate(certificate.date || "");
  setDescription(certificate.description || "");
  setEditingId(certificate.id);
};

// حذف شهادة
const handleDelete = (id) => {
  if (confirm(t["Are you sure you want to delete this certificate?"])) {
    const updatedCertificates = certificates.filter((c) => c.id !== id);
    saveToLocalStorage(updatedCertificates);
    toast.success(t["Certificate deleted successfully!"]);
    resetForm();
  }
};


  const handleSave = () => {
    toast.success(t["Certificates saved successfully!"]); 
    setTimeout(()=>{
      router.back();
    },1000) 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-teal-500 text-white py-4 px-6 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 hover:bg-teal-600 cursor-pointer rounded-full">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-xl font-bold">{t["Certificates"]}</h1>
        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
          >
            <Globe size={22} className="text-white" />
          </button>

          {openLang && (
            <div
              className={`w-[160px] absolute mt-2 ${
                lang === "ar" ? "left-0" : "right-0"
              } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
            >
              {["en", "ar", "fr", "es", "de", "it", "pt"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    changeLang(lng);
                    setOpenLang(false);
                  }}
                  className={`block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer ${
                    lng === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {lng === "en" && "🇺🇸 English"}
                  {lng === "ar" && "🇸🇦 عربي"}
                  {lng === "fr" && "🇫🇷 Français"}
                  {lng === "es" && "🇪🇸 Español"}
                  {lng === "de" && "🇩🇪 Deutsch"}
                  {lng === "it" && "🇮🇹 Italiano"}
                  {lng === "pt" && "🇵🇹 Português"}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Instructions */}
        <button
          onClick={() => router.push(`/${lang}/certificates-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewCertificatesExample || "View certificates Example"}
        </button>
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-3">
          <IoCheckmarkCircle size={28} className="text-green-600" />
          <div>
            <h2 className="text-green-800 font-semibold">{t["Add Your Certificates"]}</h2>
            <p className="text-green-700 text-sm">
              {t["Include relevant certifications and training programs that enhance your qualifications."]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-50 border p-5 rounded-xl space-y-4">
          <h3 className="font-bold text-lg text-black">
            {editingId ? t["Edit Certificate"] : t["Add New Certificate"]}
          </h3>

          <div>
            <label className="font-semibold text-gray-700">
                {t["Certificate Name"]} <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-gray-700"
              placeholder={t["e.g., Google Analytics Certification"]}
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
                {t["Issuing Organization"]} <span className="text-red-500">*</span>
            </label>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-gray-700"
              placeholder={t["e.g., Google, Microsoft, Coursera"]}
            />
          </div>

          <div>
            <label className="font-medium text-sm text-gray-700">{t["Issue Date (Optional)"]}</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-gray-700"
              placeholder={t["e.g., June 2023"]}
            />
          </div>

          <div>
            <label className="font-medium text-sm text-gray-700">{t["Description (Optional)"]}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-gray-700"
              placeholder={t["Brief description of the certificate or skills gained..."]}
            />
          </div>

          <div className="flex gap-3">
            {editingId && (
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-500 cursor-pointer text-white p-2 rounded-lg font-semibold hover:bg-gray-600"
              >
                {t["Cancel"]}
              </button>
            )}
            <button
              onClick={handleAddCertificate}
              disabled={!name.trim() || !issuer.trim()}
              className={`flex-1 flex cursor-pointer items-center justify-center gap-2 text-white p-2 rounded-lg font-semibold ${
                !name.trim() || !issuer.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              <IoAdd />
              {editingId ? t["Update Certificate"] : t["Add Certificate"]}
            </button>
          </div>
        </div>

        {/* Certificates List */}
        {certificates.length > 0 ? (
          <div>
            <h3 className="text-lg font-bold mb-3">
              {t["Your Certificates"]} ({certificates.length})
            </h3>
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white border p-4 rounded-xl flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-gray-900">{cert.name}</p>
                    <p className="text-gray-700">{cert.issuer}</p>
                    {cert.date && <p className="text-sm text-gray-500">{t["Issued"]}: {cert.date}</p>}
                    {cert.description && (
                      <p className="text-gray-600 text-sm mt-2">{cert.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-2 cursor-pointer bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                    >
                      <IoPencil size={18} className="text-teal-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 bg-red-50 border cursor-pointer border-red-200 rounded-lg hover:bg-red-100"
                    >
                      <IoTrash size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-xl bg-gray-50">
            <IoCheckmarkCircle size={50} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-500">{t["No Certificates Added"]}</p>
            <p className="text-gray-400 text-sm">
              {t["Add your first certificate to showcase your qualifications."]}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl"
        >
          <IoCheckmarkCircle size={22} />
          {t["Save & Finish"]}
        </button>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl mt-5">
          <h4 className="font-bold text-yellow-800 mb-2">
            💡 {t["Tips for Certificates:"]}
          </h4>
          <ul className="text-yellow-700 text-sm space-y-1 list-disc pl-5">
            <li>{t["Include relevant professional certifications"]}</li>
            <li>{t["Mention online courses and training programs"]}</li>
            <li>{t["Add industry-specific certifications"]}</li>
            <li>{t["Include completion dates when available"]}</li>
            <li>{t["Focus on certificates relevant to the job"]}</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
