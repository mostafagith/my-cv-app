"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { useLanguage } from '@/context/LanguageContext';

import toast from "react-hot-toast";

export default function Skills() {
  const router = useRouter();
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);

  // دوال آمنة للقراءة والكتابة
const safeGetItem = (key, fallback = "[]") => {
  try {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);
  } catch (err) {
    console.warn(`localStorage getItem failed for key "${key}", fallback to sessionStorage`, err);
    try {
      const value = sessionStorage.getItem(key);
      if (value) return JSON.parse(value);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
    }
  }
  return JSON.parse(fallback);
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`localStorage setItem failed for key "${key}", fallback to sessionStorage`, err);
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error(`Both localStorage and sessionStorage failed for key "${key}"`, e);
    }
  }
};

// useEffect لتحميل المهارات
useEffect(() => {
  const cv = safeGetItem("currentCV", "{}");
  if (cv.skills?.length > 0) setSkills(cv.skills);
  else setSkills([{ id: Date.now().toString(), name: "", level: 0 }]);
}, []);

// إضافة مهارة جديدة
const handleAddSkill = () => {
  setSkills([...skills, { id: Date.now().toString(), name: "", level: 0 }]);
};

// تعديل مهارة
const handleSkillChange = (index, field, value) => {
  const newSkills = [...skills];
  newSkills[index][field] = value;
  setSkills(newSkills);
};

// حذف مهارة
const handleRemoveSkill = (index) => {
  if (skills.length === 1) {
    toast.error(t["mustHaveAtLeastOneSkill"]);
    return;
  }
  if (confirm(t["confirmRemoveSkill"])) {
    setSkills(skills.filter((_, i) => i !== index));
  }
};

// حفظ المهارات
const handleSave = () => {
  if (skills.some(s => !s.name?.trim())) {
    toast.error(t["fillAllSkillNames"]);
    return;
  }

  const cv = safeGetItem("currentCV", "{}");
  cv.skills = skills;
  safeSetItem("currentCV", JSON.stringify(cv));

  toast.success(t.saved_successfully);
  setTimeout(() => {
    router.back();
  }, 1000);
};


  const getLevelDescription = (level) => {
    switch (level) {
      case 1: return t['beginner'];
      case 2: return t['basic'];
      case 3: return t['intermediate'];
      case 4: return t['advanced'];
      case 5: return t['expert'];
      default: return t['notRated'];
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-teal-600 text-white p-4 rounded-md mb-6">
        <button className="cursor-pointer" onClick={() => router.back()}><IoArrowBack size={24} /></button>
        <h1 className="text-xl font-bold">{t.skills}</h1>
        <div className="w-6" />
      </div>

      <div className="space-y-6">
        {skills.map((skill, idx) => (
          <div key={skill.id} className="bg-gray-100 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-teal-600">{t.skill} {idx + 1}</h2>
              {skills.length > 1 && (
                <button onClick={() => handleRemoveSkill(idx)} className="cursor-pointer text-red-500">
                  <IoTrashOutline size={20} />
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder={t.skillNamePlaceholder}
              value={skill.name}
              onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
              className="w-full border rounded-md p-2 mb-3"
            />

            <div className="flex space-x-2 mb-2">
              {[1,2,3,4,5].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => handleSkillChange(idx, "level", lvl)}
                  className={` cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md ${skill.level === lvl ? 'bg-teal-600 text-white' : 'bg-white'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            {skill.level > 0 && <p className="text-teal-600 text-sm">{getLevelDescription(skill.level)}</p>}
          </div>
        ))}

        <button onClick={handleAddSkill} className="flex cursor-pointer items-center space-x-2 border border-teal-600 text-teal-600 p-2 rounded-md">
          <IoAddCircleOutline size={20} />
          <span>{t.addAnotherSkill}</span>
        </button>

        <button onClick={handleSave} className="w-full cursor-pointer bg-teal-600 text-white p-3 rounded-md font-bold">
          {t['saveSkills']}
        </button>
      </div>
    </div>
  );
}
