"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import toast from "react-hot-toast";
import { Globe} from "lucide-react";

export default function SectionDetailsPage() {
  const { t, lang, changeLang } = useLanguage();
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

  // ✅ تحميل البيانات من localStorage
  useEffect(() => {
    const cv = JSON.parse(localStorage.getItem("currentCV") || "{}");
    if (cv.personalDetails) {
      setFormData(cv.personalDetails);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ تحويل الصورة إلى Base64 وتخزينها
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
    reader.readAsDataURL(file); // ← هنا التحويل إلى Base64
  };

  const deleteImage = () => {
    setFormData((prev) => ({ ...prev, photo: null, photoPreview: null }));
  };

  const handleSave = () => {
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
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
      toast.error(t.invalid_email_format); // خلي عندك ترجمة للرسالة دي
      return;
    }
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!formData.phone) {
      toast.error(t.please_enter_phone);
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error(t.invalid_phone_format); // خلي عندك ترجمة للرسالة دي
      return;
    }
    

    const cv = JSON.parse(localStorage.getItem("currentCV") || "{}");
    cv.personalDetails = formData;
    localStorage.setItem("currentCV", JSON.stringify(cv));

    toast.success(t.saved_successfully || "Saved successfully!"); 
    setTimeout(()=>{
      router.push("/create-new");
    },1000)   
  };

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-500 text-white py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
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
      <main className="container mx-auto p-6">
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
                  className="rounded-[50%] border-4 border-teal-500 object-cover"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 resize-none"
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
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
      />
    </div>
  );
}
