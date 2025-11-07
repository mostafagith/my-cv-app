"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { IoArrowBack, IoBulbOutline, IoCheckmarkCircle } from "react-icons/io5";

export default function Hopes() {
  const router = useRouter();
  const { t } = useLanguage();

  const [hopes, setHopes] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
    setHopes(storedCV?.hopes || "");
    setIsSaved(!!storedCV?.hopes);
  }, []);

  const handleSave = () => {
    if (!hopes.trim()) {
      alert(t["Please enter your hopes and aspirations"]);
      return;
    }

    // Get currentCV or empty object
    const currentCV = JSON.parse(localStorage.getItem("currentCV") || "{}");

    // Update hopes section
    const updatedCV = {
      ...currentCV,
      hopes,
    };

    // Save back to localStorage
    localStorage.setItem("currentCV", JSON.stringify(updatedCV));

    alert(t["Hopes saved successfully!"]);
    router.back();
  };

  const handleBack = () => {
    const currentCV = JSON.parse(localStorage.getItem("currentCV") || "{}");
    if (isSaved || hopes === currentCV?.hopes) {
      router.back();
    } else {
      if (confirm(t["You have unsaved changes. Do you want to go back?"])) {
        router.back();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white py-5 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack size={22} />
        </button>
        <h1 className="text-lg font-bold">{t["Hopes & Aspirations"]}</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Instructions */}
        <div className="flex items-start bg-green-50 border border-green-200 p-4 rounded-xl">
          <IoBulbOutline size={24} className="text-green-600 mt-1" />
          <div className="ml-3">
            <h2 className="font-bold text-green-800 text-base">
              {t["Share Your Aspirations"]}
            </h2>
            <p className="text-green-700 text-sm mt-1 leading-6">
              {t[
                "Describe your career goals, future aspirations, and what you hope to achieve. This helps employers understand your motivation and direction."
              ]}
            </p>
          </div>
        </div>

        {/* Hopes Input */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <label className="block text-gray-800 font-semibold mb-2">
            {t["Your Hopes & Aspirations"]}
          </label>
          <textarea
            className={`w-full border ${
              hopes.length > 0 ? "border-teal-500" : "border-gray-300"
            } rounded-lg p-3 text-sm min-h-[120px] focus:outline-none`}
            placeholder={t[
              "Describe your career goals, future plans, and aspirations..."
            ]}
            value={hopes}
            onChange={(e) => setHopes(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right mt-1">
            {hopes.length}/500 {t["characters"]}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <h3 className="font-bold text-yellow-800 mb-2">
            💡 {t["Tips for Writing Hopes:"]}
          </h3>
          <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
            <li>{t["Be specific about your career goals"]}</li>
            <li>{t["Mention skills you want to develop"]}</li>
            <li>{t["Connect your aspirations to the role"]}</li>
            <li>{t["Keep it professional and realistic"]}</li>
            <li>{t["Show enthusiasm and motivation"]}</li>
          </ul>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!hopes.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
            !hopes.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          <IoCheckmarkCircle size={20} />
          <span>{t["Save Hopes"]}</span>
        </button>
      </div>
    </div>
  );
}
