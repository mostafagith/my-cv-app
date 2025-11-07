"use client";

import { useEffect, useState } from "react";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

export default function ProjectsDetails() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [projects, setProjects] = useState([]);

  // 🧠 تحميل المشاريع من localStorage
  useEffect(() => {
    const storedCV = localStorage.getItem("currentCV");
    if (storedCV) {
      const parsedCV = JSON.parse(storedCV);
      setProjects(parsedCV.projects || []);
    } else {
      setProjects([
        {
          id: Date.now().toString(),
          title: "",
          description: "",
          technologies: "",
          projectUrl: "",
          startDate: "",
          endDate: "",
        },
      ]);
    }
  }, []);

  // 🔁 تحديث البيانات في localStorage
  const updateLocalStorage = (updatedProjects) => {
    setProjects(updatedProjects);
    const storedCV = JSON.parse(localStorage.getItem("currentCV")) || {};
    storedCV.projects = updatedProjects;
    localStorage.setItem("currentCV", JSON.stringify(storedCV));
  };

  const handleBack = () => {
    router.back();
  };

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    updateLocalStorage(updated);
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
    };
    updateLocalStorage([...projects, newProject]);
  };

  const handleRemoveProject = (index) => {
    if (projects.length === 1) {
      alert(t["You must have at least one project entry"]);
      return;
    }
    if (confirm(t["Are you sure you want to remove this project?"])) {
      const updated = projects.filter((_, i) => i !== index);
      updateLocalStorage(updated);
    }
  };

  const handleSave = () => {
    const hasEmptyFields = projects.some(
      (p) => !p.title.trim() || !p.description.trim()
    );
    if (hasEmptyFields) {
      alert(t["Please fill project title and description for all projects"]);
      return;
    }
    // ✅ نجيب الـ CV القديم بدل ما نمسحه
    const storedCV = JSON.parse(localStorage.getItem("currentCV")) || {};

    // ✅ نحدث المشاريع فقط
    storedCV.projects = projects;

    // ✅ نحفظ الـ CV كامل
    localStorage.setItem("currentCV", JSON.stringify(storedCV));
    alert(t["Projects saved successfully!"]);
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 text-white flex items-center justify-between px-5 py-5">
        <button onClick={handleBack}>
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-bold">{t["Projects Details"]}</h1>
        <div className="w-6" />
      </div>

      <div className="p-5 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t["Personal Projects"]}
        </h2>
        <p className="text-gray-500 mb-6">
          {t["Showcase your projects and technical skills"]}
        </p>

        {projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-teal-600">
                {t["Project"]} {index + 1}
              </h3>
              {projects.length > 1 && (
                <button
                  onClick={() => handleRemoveProject(index)}
                  className="text-red-500"
                >
                  <IoTrashOutline size={20} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t["Project Title"]} *
                </label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={project.title}
                  onChange={(e) =>
                    handleChange(index, "title", e.target.value)
                  }
                  placeholder={t["Enter project title"]}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t["Project Description"]} *
                </label>
                <textarea
                  className="w-full border rounded-lg p-2 h-28 resize-none"
                  value={project.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  placeholder={t[
                    "Describe your project, what it does, and its main features..."
                  ]}
                />
                <p className="text-right text-xs text-gray-400 mt-1">
                  {(project.description?.length || 0)}/500 {t["characters"]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t["Technologies Used"]}
                </label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={project.technologies}
                  onChange={(e) =>
                    handleChange(index, "technologies", e.target.value)
                  }
                  placeholder={t["e.g. React, Node.js, MongoDB, Firebase"]}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">
                    {t["Start Date"]}
                  </label>
                  <input
                    className="w-full border rounded-lg p-2"
                    value={project.startDate}
                    onChange={(e) =>
                      handleChange(index, "startDate", e.target.value)
                    }
                    placeholder={t["e.g. Jan 2023"]}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">
                    {t["End Date"]}
                  </label>
                  <input
                    className="w-full border rounded-lg p-2"
                    value={project.endDate}
                    onChange={(e) =>
                      handleChange(index, "endDate", e.target.value)
                    }
                    placeholder={t["e.g. Mar 2023 or Ongoing"]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t["Project URL (Optional)"]}
                </label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={project.projectUrl}
                  onChange={(e) =>
                    handleChange(index, "projectUrl", e.target.value)
                  }
                  placeholder={t["e.g. https://github.com/username/project"]}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddProject}
          className="flex items-center justify-center gap-2 border-2 border-dashed border-teal-500 text-teal-500 w-full py-2 rounded-lg mb-5"
        >
          <IoAddCircleOutline size={20} />
          {t["Add Another Project"]}
        </button>

        <button
          onClick={handleSave}
          className="bg-teal-500 text-white w-full py-3 rounded-lg font-semibold"
        >
          {t["Save Projects"]}
        </button>
      </div>
    </div>
  );
}
