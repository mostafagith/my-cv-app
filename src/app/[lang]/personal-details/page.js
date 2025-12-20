"use client"; import AdBanner from "@/components/AdBanner";
;

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe} from "lucide-react";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import Footer from "@/components/Footer";

export default function SectionDetailsPage() {
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const router = useRouter();
  const [openLang, setOpenLang] = useState(false);

  const toggleLangMenu = () => setOpenLang(!openLang);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    jobTitle: "",
    summary: "",
    photo: null,
    photoPreview: null,
  });

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

// ---------------- Load Personal Details ----------------
useEffect(() => {
  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  if (cv.personalDetails) {
    setFormData(cv.personalDetails);
  }
}, []);

// ---------------- Handle Input Change ----------------
const handleInputChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

// ---------------- Handle Image ----------------
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result;
    setFormData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: base64String,
    }));
  };
  reader.readAsDataURL(file);
};

const deleteImage = () => {
  setFormData((prev) => ({ ...prev, photo: null, photoPreview: null }));
};

// ---------------- Save Personal Details ----------------
const handleSave = () => {
  if (!formData.fullName?.trim()) {
    toast.error(t.please_enter_full_name);
    return;
  }

  if (!formData.email?.trim()) {
    toast.error(t.please_enter_email);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast.error(t.invalid_email_format);
    return;
  }

  const phoneRegex = /^\+?\d{10,15}$/;
  if (!formData.phone) {
    toast.error(t.please_enter_phone);
    return;
  }

  if (!phoneRegex.test(formData.phone)) {
    toast.error(t.invalid_phone_format);
    return;
  }

  // حفظ البيانات داخل currentCV
  const cv = JSON.parse(safeGetItem("currentCV") || "{}");
  cv.personalDetails = formData;
  safeSetItem("currentCV", JSON.stringify(cv));

  toast.success(t.saved_successfully || "Saved successfully!");
  setTimeout(() => {
    router.push(`/${lang}/create-new`);
  }, 1000);
};

// ---------------- Handle Back ----------------
const handleBack = () => router.back();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className="bg-teal-500 text-white py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
        <button onClick={handleBack} className="p-2 hover:text-gray-200 cursor-pointer">
          <IoArrowBack size={22} />
        </button>
          <h1 className="text-xl font-bold">{t.personal_details}</h1>
          {/* زر اختيار اللغة */}
          <div className="relative">
            <button
              onClick={toggleLangMenu}
              className="p-2 bg-white/20 cursor-pointer rounded-full hover:bg-white/30 transition"
            >
              <Globe size={22} className="text-white" />
            </button>

            {/* قائمة اللغات */}
            {openLang && (
              <div
                className={`w-[160px] absolute mt-2 ${
                  lang === "ar" ? "left-0" : "right-0"
                } bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 z-50 text-black`}
              >
                <button
                  onClick={() => {
                    changeLang("en");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇺🇸 en - English
                </button>

                <button
                  onClick={() => {
                    changeLang("ar");
                    setOpenLang(false);
                  }}
                  className="block cursor-pointer px-4 py-2 hover:bg-gray-100 w-full text-right"
                >
                  🇸🇦 ar - عربي
                </button>

                <button
                  onClick={() => {
                    changeLang("fr");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇫🇷 fr - Français
                </button>

                <button
                  onClick={() => {
                    changeLang("es");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇪🇸 es - Español
                </button>

                <button
                  onClick={() => {
                    changeLang("de");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇩🇪 de - Deutsch
                </button>

                <button
                  onClick={() => {
                    changeLang("it");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇮🇹 it - Italiano
                </button>

                <button
                  onClick={() => {
                    changeLang("pt");
                    setOpenLang(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 w-full cursor-pointer text-left "
                >
                  🇵🇹 pt - Português
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto container mx-auto p-6">
        <button
          onClick={() => router.push(`/${lang}/sample-personal-details`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewPersonalDetailsExample || "View Personal Details Example"}
        </button>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              {t.profile_photo}
            </label>
            {formData.photoPreview ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={formData.photoPreview}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-[50%] border-4 border-teal-500 object-cover !h-[120px]"
                />
                <div className="flex gap-3">
                  <label className="bg-teal-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-teal-600 transition">
                    {t.change}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <button
                    onClick={deleteImage}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-teal-400 rounded-xl py-10 cursor-pointer hover:bg-gray-50 transition">
                <span className="text-teal-500 font-semibold">
                  {t.choose_photo}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Inputs */}
          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              label={<>{t.full_name} <span className="text-red-500">*</span></>}
              value={formData.fullName||""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
            <InputField
              label={<>{t.email} <span className="text-red-500">*</span></>}
              value={formData.email||""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              type="email"
            />
            <InputField
              label={<>{t.phone} <span className="text-red-500">*</span></>}
              value={formData.phone||""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <InputField
              label={t.address}
              value={formData.address||""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <InputField
              label={t.website}
              value={formData.website||""}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
            <InputField
              className="text-black"
              label={t.job_title}
              value={formData.jobTitle||""}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            />
          </div>

          {/* Summary */}
          <div className="mt-5">
            <label className="block text-gray-700 font-semibold mb-2">
              {t.summary}
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              rows="4"
              className="w-full border-1 p-3 text-black border-black-300 rounded-lg focus:outline-none focus:border-black-500 resize-none"
              placeholder={t.summary_placeholder}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
            <button
              onClick={handleBack}
              className="w-full cursor-pointer sm:w-auto bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition cursor-pointer"
            >
              {t.back}
            </button>
            <button
              onClick={handleSave}
              className="w-full cursor-pointer sm:w-auto bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </div>
      </main>
      {/* <AdBanner adKey={AD_KEY} /> */}
      {/* ---------------- Personal Info Guidance Section ---------------- */}
      <div className="max-w-4xl mx-auto mt-10 bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-600">{t.personal_info_title}</h2>
        <p className="text-gray-700 mb-6">{t.personal_info_text}</p>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.photo_title}</h3>
            <p className="text-gray-700">{t.photo_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.full_name_title}</h3>
            <p className="text-gray-700">{t.full_name_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.phone_title}</h3>
            <p className="text-gray-700">{t.phone_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.email_title}</h3>
            <p className="text-gray-700">{t.email_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.address_title}</h3>
            <p className="text-gray-700">{t.address_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.website_title}</h3>
            <p className="text-gray-700">{t.website_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.job_title_title}</h3>
            <p className="text-gray-700">{t.job_title_text}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">{t.summary_title}</h3>
            <p className="text-gray-700">{t.summary_text}</p>
          </div>
        </div>
      </div>
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.personal_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.personal_tip_one}</li>
          <li>{t.personal_tip_two}</li>
          <li>{t.personal_tip_three}</li>
        </ul>
      </section>
      {/* <AdBanner adKey={AD_KEY} /> */}
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-10 mb-10 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          {t.faq_title}
        </h2>
        
        <div className="space-y-4">
          {[
            { q: t.faq_1_q, a: t.faq_1_a },
            { q: t.faq_2_q, a: t.faq_2_a },
            { q: t.faq_3_q, a: t.faq_3_a },
          ].map((item, index) => (
            <details key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                <span className="font-semibold text-gray-700">{item.q}</span>
                <span className="text-teal-500 transition-transform duration-300 group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
      {/* Common Mistakes Section */}
      <section className="max-w-4xl mx-auto mt-8 mb-12 px-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t.mistakes_title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: t.mistake_1_t, d: t.mistake_1_d },
              { t: t.mistake_2_t, d: t.mistake_2_d },
              { t: t.mistake_3_t, d: t.mistake_3_d },
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {item.t}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {item.d}
                </p>
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

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-700"
      />
    </div>
  );
}
