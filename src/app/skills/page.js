"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { useLanguage } from '@/hooks/useLanguage';

export default function Skills() {
  const router = useRouter();
  const { t } = useLanguage();
  const [skills, setSkills] = useState([]);

  // Load skills from localStorage (currentCV)
  useEffect(() => {
    const cv = JSON.parse(localStorage.getItem("currentCV")) || {};
    if (cv.skills?.length > 0) setSkills(cv.skills);
    else setSkills([{ id: Date.now().toString(), name: "", level: 0 }]);
  }, []);

  const handleAddSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: "", level: 0 }]);
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleRemoveSkill = (index) => {
    if (skills.length === 1) {
      alert(t['mustHaveAtLeastOneSkill']);
      return;
    }
    if (confirm(t['confirmRemoveSkill'])) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (skills.some(s => !s.name.trim())) {
      alert(t['fillAllSkillNames']);
      return;
    }
    const cv = JSON.parse(localStorage.getItem("currentCV")) || {};
    cv.skills = skills;
    localStorage.setItem("currentCV", JSON.stringify(cv));
    alert(t['skillsSavedSuccessfully']);
    router.back();
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
        <button onClick={() => router.back()}><IoArrowBack size={24} /></button>
        <h1 className="text-xl font-bold">{t.skills}</h1>
        <div className="w-6" />
      </div>

      <div className="space-y-6">
        {skills.map((skill, idx) => (
          <div key={skill.id} className="bg-gray-100 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-teal-600">{t.skill} {idx + 1}</h2>
              {skills.length > 1 && (
                <button onClick={() => handleRemoveSkill(idx)} className="text-red-500">
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
                  className={`w-10 h-10 flex items-center justify-center border rounded-md ${skill.level === lvl ? 'bg-teal-600 text-white' : 'bg-white'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            {skill.level > 0 && <p className="text-teal-600 text-sm">{getLevelDescription(skill.level)}</p>}
          </div>
        ))}

        <button onClick={handleAddSkill} className="flex items-center space-x-2 border border-teal-600 text-teal-600 p-2 rounded-md">
          <IoAddCircleOutline size={20} />
          <span>{t.addAnotherSkill}</span>
        </button>

        <button onClick={handleSave} className="w-full bg-teal-600 text-white p-3 rounded-md font-bold">
          {t['saveSkills']}
        </button>
      </div>
    </div>
  );
}
