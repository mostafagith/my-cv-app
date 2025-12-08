"use client";
import { useState, useEffect } from "react";
import { IoArrowBack,IoTrophyOutline, IoPeople, IoHeart, IoMedal, IoTrash, IoPencil, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe } from "lucide-react";

export default function AwardsActivities() {
  const { t, lang, changeLang } = useLanguage();
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
            <div className="p-4 md:p-8">
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
    </div>
  );
}
