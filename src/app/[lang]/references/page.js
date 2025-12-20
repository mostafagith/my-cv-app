"use client"; import AdBanner from "@/components/AdBanner";
;
import { useEffect, useState } from "react";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

export default function ReferencesPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);

  const [references, setReferences] = useState([]);

  // ✅ تحميل البيانات من currentCV
  // ---------------- Safe Storage ----------------
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

// ---------------- Load References ----------------
useEffect(() => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  if (savedCV.references) {
    setReferences(savedCV.references);
  } else {
    setReferences([
      {
        id: Date.now().toString(),
        name: "",
        jobTitle: "",
        company: "",
        email: "",
        phone: "",
      },
    ]);
  }
}, []);

// ---------------- Save to Storage ----------------
const saveToLocalStorage = (updatedRefs) => {
  const savedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  const updatedCV = { ...savedCV, references: updatedRefs };
  safeSetItem("currentCV", JSON.stringify(updatedCV));
};

// ---------------- Handlers ----------------
const handleAddReference = () => {
  const newRef = {
    id: Date.now().toString(),
    name: "",
    jobTitle: "",
    company: "",
    email: "",
    phone: "",
  };
  const updated = [...references, newRef];
  setReferences(updated);
};

const handleChange = (index, field, value) => {
  const updated = [...references];
  updated[index][field] = value;
  setReferences(updated);
};

const handleRemoveReference = (index) => {
  if (references.length === 1) {
    toast.error(t["You must have at least one reference"]);
    return;
  }

  if (confirm(t["Are you sure you want to remove this reference?"])) {
    const updated = references.filter((_, i) => i !== index);
    setReferences(updated);
    saveToLocalStorage(updated);
  }
};

const handleSave = () => {
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];

    if (!ref.name?.trim()) {
      toast.error(`${t["please_enter_reference_name"]} (Reference ${i + 1})`);
      return;
    }

    if (!ref.jobTitle?.trim()) {
      toast.error(`${t["please_enter_reference_job_title"]} (Reference ${i + 1})`);
      return;
    }

    if (!ref.company?.trim()) {
      toast.error(`${t["please_enter_reference_company"]} (Reference ${i + 1})`);
      return;
    }

    if (ref.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
      toast.error(`${t["please_enter_valid_reference_email"]} (Reference ${i + 1})`);
      return;
    }
  }

  saveToLocalStorage(references);
  toast.success(t["References Saved Successfully!"]);
  setTimeout(() => {
    router.back();
  }, 1000);
};


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-600 text-white flex items-center justify-between px-6 py-5">
        <button onClick={() => router.back()} className="p-2">
          <IoArrowBack size={24} className="cursor-pointer" />
        </button>
        <h1 className="text-xl font-bold">{t["References"]}</h1>
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
        {/* <div className="w-6" /> */}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push(`/${lang}/references-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewReferencesExample || "View references Example"}
        </button>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{t["Professional References"]}</h2>
        <p className="text-gray-500 mb-6">{t["Add people who can recommend you professionally"]}</p>

        {references.map((ref, index) => (
          <div key={ref.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-teal-600 font-semibold">
                {t["Reference"]} {index + 1}
              </h3>
              {references.length > 1 && (
                <button onClick={() => handleRemoveReference(index)}>
                  <IoTrashOutline size={20} className="text-red-500 cursor-pointer" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700">
                  {t["Reference's Name"]} <span className="text-red-500">*</span>
              </label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-700"
                  placeholder={t["Enter full name"]}
                  value={ref.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  {t["Job Title"]} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-700"
                  placeholder={t["Enter job title"]}
                  value={ref.jobTitle}
                  onChange={(e) => handleChange(index, "jobTitle", e.target.value)}
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  {t["Company Name"]} <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-700"
                  placeholder={t["Enter company name"]}
                  value={ref.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-sm text-gray-700">{t["Email Address"]}</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-700"
                  placeholder={t["Enter email address"]}
                  type="email"
                  value={ref.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium text-sm text-gray-700">{t["Phone Number"]}</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-gray-700"
                  placeholder={t["Enter phone number"]}
                  value={ref.phone}
                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddReference}
          className="flex cursor-pointer items-center justify-center w-full border-2 border-dashed border-teal-500 text-teal-600 py-3 rounded-lg mb-6"
        >
          <IoAddCircleOutline size={22} />
          <span className="ml-2 font-medium">{t["Add Another Reference"]}</span>
        </button>

        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white cursor-pointer py-3 rounded-lg font-bold"
        >
          {t["Save References"]}
        </button>
        {/* <AdBanner adKey={AD_KEY} /> */}
        {/* Tips Section */}
        {/* <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
          <h3 className="font-semibold text-gray-800 mb-3">{t["Reference Tips:"]}</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mr-2" />
              {t["Ask for permission before listing someone"]}
            </li>
            <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mr-2" />
              {t["Choose people who know your work well"]}
            </li>
            <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mr-2" />
              {t["Include 2-3 professional references"]}
            </li>
          </ul>
        </div> */}
      </div>
      {/* References Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t["Reference Tips:"]}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />
              {t["Ask for permission before listing someone"]}
            </li>
            <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />
              {t["Choose people who know your work well"]}
            </li>
            <li className="flex items-center">
              <IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />
              {t["Include 2-3 professional references"]}
            </li>
          <li className="flex items-center"><IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />{t.references_tip_one}</li>
          <li className="flex items-center"><IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />{t.references_tip_two}</li>
          <li className="flex items-center"><IoCheckmarkCircle size={16} className="text-teal-500 mx-2" />{t.references_tip_three}</li>
        </ul>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}
      {/* FAQ Section for References */}
      <section className="max-w-4xl mx-auto mt-12 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-600 rounded-full"></span>
          {t.ref_faq_title}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-teal-200">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-teal-50/30 list-none">
                <span className="font-semibold text-gray-700">{t[`ref_faq_${num}_q`]}</span>
                <span className="text-teal-600 transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {t[`ref_faq_${num}_a`]}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section for References */}
      <section className="max-w-4xl mx-auto mt-12 mb-16 px-6">
        <div className="bg-red-50 border border-orange-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {t.ref_mistakes_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="bg-white p-4 rounded-xl border border-orange-50 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                  {t[`ref_mistake_${num}_t`]}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t[`ref_mistake_${num}_d`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}
      <Footer/>
    </div>
  );
}
