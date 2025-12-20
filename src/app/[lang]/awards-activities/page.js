"use client"; import AdBanner from "@/components/AdBanner";
;
import { useState, useEffect } from "react";
import { IoArrowBack,IoTrophyOutline, IoPeople, IoHeart, IoMedal, IoTrash, IoPencil, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";
import Footer from "@/components/Footer";

export default function AwardsActivities() {
  const { t, lang, changeLang } = useLanguage(); const AD_KEY = "39dbba6476f4f6fc7e968a32afd3c1ba";
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);
  const router = useRouter();

  const [awardsActivities, setAwardsActivities] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Award");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Helpers for safe storage
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

// load awardsActivities on mount
useEffect(() => {
  const savedCV = safeParse(safeGetItem("currentCV"));
  if (savedCV.awardsActivities) {
    setAwardsActivities(savedCV.awardsActivities);
  }
}, []);

// save awardsActivities to storage
const saveToLocalStorage = (data) => {
  const savedCV = safeParse(safeGetItem("currentCV"));
  const updatedCV = { ...savedCV, awardsActivities: data };
  safeSetItem("currentCV", JSON.stringify(updatedCV));
};

// reset form fields
const resetForm = () => {
  setName("");
  setType("Award");
  setOrganization("");
  setDate("");
  setDescription("");
  setEditingId(null);
};

// add or update award/activity
const handleAddAwardActivity = () => {
  if (!name.trim()) {
    toast.error(t["please_enter_name"]);
    return;
  }

  if (!organization.trim()) {
    toast.error(t["please_enter_organization"]);
    return;
  }

  let updatedList;
  if (editingId) {
    updatedList = awardsActivities.map((item) =>
      item.id === editingId
        ? { ...item, name, type, organization, date, description }
        : item
    );
    toast.success(t["Updated successfully!"]);
  } else {
    updatedList = [
      ...awardsActivities,
      {
        id: Date.now().toString(),
        name,
        type,
        organization,
        date,
        description,
      },
    ];
    toast.success(t["Added successfully!"]);
  }

  setAwardsActivities(updatedList);
  saveToLocalStorage(updatedList);
  resetForm();
};

// edit an award/activity
const handleEdit = (item) => {
  setName(item.name);
  setType(item.type);
  setOrganization(item.organization);
  setDate(item.date);
  setDescription(item.description);
  setEditingId(item.id);
};

// delete an award/activity
const handleDelete = (id) => {
  if (confirm(t["Are you sure you want to delete this item?"])) {
    const updated = awardsActivities.filter((item) => item.id !== id);
    setAwardsActivities(updated);
    saveToLocalStorage(updated);
    toast.success(t["Deleted successfully!"]);
  }
};

// save all and go back
const handleSaveAll = () => {
  const savedCV = safeParse(safeGetItem("currentCV"));
  const updatedCV = { ...savedCV, awardsActivities };
  safeSetItem("currentCV", JSON.stringify(updatedCV));
  toast.success(t["Awards & Activities saved successfully!"]);
  
  setTimeout(() => {
    router.back();
  }, 1000);
};



  const getTypeIcon = (type) => {
    switch (type) {
      case "Award":
        return <IoTrophyOutline className="text-yellow-500" />;
      case "Activity":
        return <IoPeople className="text-green-500" />;
      case "Volunteer":
        return <IoHeart className="text-red-500" />;
      case "Competition":
        return <IoMedal className="text-purple-500" />;
      default:
        return <IoTrophyOutline />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
            <header className="bg-teal-500 text-white py-4 px-6 flex justify-between items-center">
              <button onClick={() => router.back()} className="p-2 hover:bg-teal-600 cursor-pointer rounded-full">
                <IoArrowBack size={22} />
              </button>
              <h1 className="text-xl font-bold">{t["awards"]}</h1>
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
            <div className="max-w-4xl mx-auto p-4 md:p-8">
              <button
                onClick={() => router.push(`/${lang}/awards-example`)}
                className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {t.viewAwardsExample}
              </button>

                <h1 className="text-2xl font-bold text-teal-600 mb-6">{t["Awards & Activities"]}</h1>

                {/* Form */}
                <div className="bg-gray-50 border p-4 rounded-xl mb-6">
                  <h2 className="font-semibold text-lg mb-3 text-black">
                    {editingId ? t["Edit Item"] : t["Add New Award/Activity"]}
                  </h2>

                  {/* <div className="flex flex-wrap gap-2 mb-4">
                    {["Award", "Activity", "Volunteer", "Competition"].map((typeOption) => (
                      <button
                        key={typeOption}
                        className={`px-3 py-2 rounded-lg border flex items-center cursor-pointer gap-2 ${
                          type === typeOption
                            ? "bg-teal-600 text-white"
                            : "border-gray-300 text-gray-700"
                        }`}
                        onClick={() => setType(typeOption)}
                      >
                        {getTypeIcon(typeOption)}
                        <span>{t[typeOption]}</span>
                      </button>
                    ))}
                  </div> */}

                  <input
                    className="w-full border p-2 rounded mb-3 text-gray-700"
                    placeholder={t["Name"]}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="w-full border p-2 rounded mb-3 text-gray-700"
                    placeholder={t["Organization"]}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                  <input
                    className="w-full border p-2 rounded mb-3 text-gray-700"
                    placeholder={t["Date (optional)"]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <textarea
                    className="w-full border p-2 rounded mb-3 text-gray-700"
                    rows={3}
                    placeholder={t["Description (optional)"]}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <div className="flex gap-2">
                    {editingId && (
                      <button
                        onClick={resetForm}
                        className="flex-1 bg-gray-500 text-white cursor-pointer py-2 rounded"
                      >
                        {t["Cancel"]}
                      </button>
                    )}
                    <button
                      onClick={handleAddAwardActivity}
                      className="flex-1 cursor-pointer bg-teal-600 text-white py-2 cursor-pointer rounded"
                    >
                      {editingId ? t["Update"] : t["Add"]}
                    </button>
                  </div>
                </div>

                {/* List */}
                {awardsActivities.length > 0 ? (
                  <div>
                    <h2 className="font-semibold text-lg mb-3 text-black">
                      {t["Your Awards & Activities"]} ({awardsActivities.length})
                    </h2>
                    <div className="space-y-3">
                      {awardsActivities.map((item) => (
                        <div
                          key={item.id}
                          className="border p-4 rounded-xl flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(item.type)}
                              <span className="font-semibold text-black">{item.name}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{item.organization}</p>
                            {item.date && <p className="text-gray-500 text-xs">{item.date}</p>}
                            {item.description && (
                              <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)}>
                              <IoPencil className="text-teal-600 cursor-pointer" />
                            </button>
                            <button onClick={() => handleDelete(item.id)}>
                              <IoTrash className="text-red-500 cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">{t["No items added yet."]}</p>
                )}

                <button
                  onClick={handleSaveAll}
                  className="mt-8 bg-teal-600 text-white cursor-pointer px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <IoCheckmarkCircle />
                  {t["Save & Finish"]}
                </button>
            </div>
            {/* Awards & Activities Tips */}
            <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-teal-700 mb-4">
                {t.awards_tips_title}
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li>{t.awards_tip_one}</li>
                <li>{t.awards_tip_two}</li>
                <li>{t.awards_tip_three}</li>
              </ul>
            </section>
            {/* <AdBanner adKey={AD_KEY} /> */}
            {/* FAQ Section for Awards & Activities */}
            <section className="max-w-4xl mx-auto mt-12 px-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
                {t.awards_faq_title}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-teal-200">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-teal-50/30 list-none">
                      <span className="font-semibold text-gray-700">{t[`awards_faq_${num}_q`]}</span>
                      <span className="text-teal-500 transition-transform group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                      {t[`awards_faq_${num}_a`]}
                    </div>
                  </details>
                ))}
              </div>
            </section>
            {/* <AdBanner adKey={AD_KEY} /> */}
            {/* Common Mistakes Section for Awards & Activities */}
            <section className="max-w-4xl mx-auto mt-12 mb-16 px-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t.awards_mistakes_title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="bg-white p-4 rounded-xl border border-red-50 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                        {t[`awards_mistake_${num}_t`]}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{t[`awards_mistake_${num}_d`]}</p>
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
