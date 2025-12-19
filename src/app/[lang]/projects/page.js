"use client";

import { useEffect, useState } from "react";
import { IoArrowBack, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { Globe} from "lucide-react";
import Footer from "@/components/Footer";

export default function ProjectsDetails() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [openLang, setOpenLang] = useState(false);
  const toggleLangMenu = () => setOpenLang(!openLang);
  const [projects, setProjects] = useState([]);

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

// ---------------- Load Projects ----------------
useEffect(() => {
  const storedCV = safeGetItem("currentCV");
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

// ---------------- Update Local Storage ----------------
const updateLocalStorage = (updatedProjects) => {
  setProjects(updatedProjects);
  const storedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  storedCV.projects = updatedProjects;
  safeSetItem("currentCV", JSON.stringify(storedCV));
};

// ---------------- Handlers ----------------
const handleBack = () => router.back();

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
    toast.error(t["You must have at least one project entry"]);
    return;
  }
  if (confirm(t["Are you sure you want to remove this project?"])) {
    const updated = projects.filter((_, i) => i !== index);
    updateLocalStorage(updated);
  }
};

const handleSave = () => {
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];

    if (!project.title?.trim()) {
      toast.error(`${t["please_enter_project_title"]} (Project ${i + 1})`);
      return;
    }

    if (!project.description?.trim()) {
      toast.error(`${t["please_enter_project_description"]} (Project ${i + 1})`);
      return;
    }
  }

  const storedCV = JSON.parse(safeGetItem("currentCV") || "{}");
  storedCV.projects = projects;
  safeSetItem("currentCV", JSON.stringify(storedCV));

  toast.success(t.saved_successfully);
  setTimeout(() => {
    router.back();
  }, 1000);
};


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 text-white flex items-center justify-between px-5 py-5">
        <button onClick={handleBack}>
          <IoArrowBack size={24} className="cursor-pointer" />
        </button>
        <h1 className="text-xl font-bold">{t["Projects Details"]}</h1>
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

      <div className="p-5 max-w-4xl mx-auto">
        <button
          onClick={() => router.push(`/${lang}/projects-example`)}
          className="mb-4 cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {t.viewProjectsExample || "View projects Example"}
        </button>
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
                  className="text-red-500 cursor-pointer"
                >
                  <IoTrashOutline size={20} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700">
                  {t["Project Title"]} <span className="text-red-500">*</span>
                </label>
                
                <input
                  className="w-full border rounded-lg p-2 text-gray-700"
                  value={project.title}
                  onChange={(e) =>
                    handleChange(index, "title", e.target.value)
                  }
                  placeholder={t["Enter project title"]}
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  {t["Project Description"]} <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border rounded-lg p-2 h-28 resize-none text-gray-700"
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
                <label className="block text-sm font-semibold mb-1 text-black">
                  {t["Technologies Used"]}
                </label>
                <input
                  className="w-full border rounded-lg p-2 text-gray-700"
                  value={project.technologies}
                  onChange={(e) =>
                    handleChange(index, "technologies", e.target.value)
                  }
                  placeholder={t["e.g. React, Node.js, MongoDB, Firebase"]}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1 text-black">
                    {t["Start Date"]}
                  </label>
                  <input
                    className="w-full border rounded-lg p-2 text-gray-700"
                    value={project.startDate}
                    onChange={(e) =>
                      handleChange(index, "startDate", e.target.value)
                    }
                    placeholder={t["e.g. Jan 2023"]}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1 text-black">
                    {t["End Date"]}
                  </label>
                  <input
                    className="w-full border rounded-lg p-2 text-gray-700 text-black"
                    value={project.endDate}
                    onChange={(e) =>
                      handleChange(index, "endDate", e.target.value)
                    }
                    placeholder={t["e.g. Mar 2023 or Ongoing"]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-black">
                  {t["Project URL (Optional)"]}
                </label>
                <input
                  className="w-full border rounded-lg p-2 text-gray-700"
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
          className="flex items-center cursor-pointer justify-center gap-2 border-2 border-dashed border-teal-500 text-teal-500 w-full py-2 rounded-lg mb-5"
        >
          <IoAddCircleOutline size={20} />
          {t["Add Another Project"]}
        </button>

        <button
          onClick={handleSave}
          className="bg-teal-500 text-white w-full py-3 rounded-lg font-semibold cursor-pointer"
        >
          {t["Save Projects"]}
        </button>
      </div>
      {/* Projects Tips */}
      <section className="max-w-4xl mx-auto mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-teal-700 mb-4">
          {t.projects_tips_title}
        </h3>

        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>{t.projects_tip_one}</li>
          <li>{t.projects_tip_two}</li>
          <li>{t.projects_tip_three}</li>
        </ul>
      </section>
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-10 px-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
          {t.proj_faq_title}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <details key={num} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                <span className="font-semibold text-gray-700">{t[`proj_faq_${num}_q`]}</span>
                <span className="text-teal-500 transition-transform group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                {t[`proj_faq_${num}_a`]}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="max-w-4xl mx-auto mt-10 mb-12 px-5">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {t.proj_mistakes_title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="bg-white p-4 rounded-xl border border-red-50">
                <h3 className="font-bold text-gray-800 text-sm mb-2">
                  {t[`proj_mistake_${num}_t`]}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t[`proj_mistake_${num}_d`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
