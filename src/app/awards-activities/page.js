"use client";
import { useState, useEffect } from "react";
import { IoTrophyOutline, IoPeople, IoHeart, IoMedal, IoTrash, IoPencil, IoCheckmarkCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

export default function AwardsActivities() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [awardsActivities, setAwardsActivities] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Award");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  const savedCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
  if (savedCV.awardsActivities) {
    setAwardsActivities(savedCV.awardsActivities);
  }
}, []);

const saveToLocalStorage = (data) => {
  const savedCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
  const updatedCV = { ...savedCV, awardsActivities: data };
  localStorage.setItem("currentCV", JSON.stringify(updatedCV));
};

const resetForm = () => {
  setName("");
  setType("Award");
  setOrganization("");
  setDate("");
  setDescription("");
  setEditingId(null);
};

const handleAddAwardActivity = () => {
  if (!name.trim() || !organization.trim()) {
    alert(t["Please enter name and organization"]);
    return;
  }

  let updatedList;
  if (editingId) {
    updatedList = awardsActivities.map((item) =>
      item.id === editingId
        ? { ...item, name, type, organization, date, description }
        : item
    );
    alert(t["Updated successfully!"]);
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
    alert(t["Added successfully!"]);
  }

  setAwardsActivities(updatedList);
  saveToLocalStorage(updatedList);
  resetForm();
};

const handleEdit = (item) => {
  setName(item.name);
  setType(item.type);
  setOrganization(item.organization);
  setDate(item.date);
  setDescription(item.description);
  setEditingId(item.id);
};

const handleDelete = (id) => {
  if (confirm(t["Are you sure you want to delete this item?"])) {
    const updated = awardsActivities.filter((item) => item.id !== id);
    setAwardsActivities(updated);
    saveToLocalStorage(updated);
    alert(t["Deleted successfully!"]);
  }
};

const handleSaveAll = () => {
  const savedCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
  const updatedCV = { ...savedCV, awardsActivities };
  localStorage.setItem("currentCV", JSON.stringify(updatedCV));
  alert(t["Awards & Activities saved successfully!"]);
  router.back();
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
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-2xl font-bold text-teal-600 mb-6">{t["Awards & Activities"]}</h1>

      {/* Form */}
      <div className="bg-gray-50 border p-4 rounded-xl mb-6">
        <h2 className="font-semibold text-lg mb-3">
          {editingId ? t["Edit Item"] : t["Add New Award/Activity"]}
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {["Award", "Activity", "Volunteer", "Competition"].map((typeOption) => (
            <button
              key={typeOption}
              className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
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
        </div>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder={t["Name"]}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder={t["Organization"]}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder={t["Date (optional)"]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded mb-3"
          rows={3}
          placeholder={t["Description (optional)"]}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-2">
          {editingId && (
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-500 text-white py-2 rounded"
            >
              {t["Cancel"]}
            </button>
          )}
          <button
            onClick={handleAddAwardActivity}
            className="flex-1 bg-teal-600 text-white py-2 rounded"
          >
            {editingId ? t["Update"] : t["Add"]}
          </button>
        </div>
      </div>

      {/* List */}
      {awardsActivities.length > 0 ? (
        <div>
          <h2 className="font-semibold text-lg mb-3">
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
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.organization}</p>
                  {item.date && <p className="text-gray-500 text-xs">{item.date}</p>}
                  {item.description && (
                    <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)}>
                    <IoPencil className="text-teal-600" />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <IoTrash className="text-red-500" />
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
        className="mt-8 bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
      >
        <IoCheckmarkCircle />
        {t["Save & Finish"]}
      </button>
    </div>
  );
}
