'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CheckCircle, ClipboardList } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function EducationDetails() {
  const router = useRouter();
  const { t } = useLanguage();
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const cv = JSON.parse(localStorage.getItem('currentCV') || '{}');
    if (cv.education && cv.education.length > 0) {
      setEducations(cv.education);
    } else {
      setEducations([{
        id: Date.now().toString(),
        course: '',
        degree: '',
        institution: '',
        grade: '',
        startDate: '',
        endDate: '',
        isCurrentlyStudying: false
      }]);
    }
  }, []);

  const handleBack = () => router.back();

  const handleAddEducation = () => {
    setEducations([...educations, {
      id: Date.now().toString(),
      course: '',
      degree: '',
      institution: '',
      grade: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false
    }]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleCurrentlyStudyingChange = (index, value) => {
    const updated = [...educations];
    updated[index].isCurrentlyStudying = value;
    updated[index].endDate = value ? t['present'] : '';
    setEducations(updated);
  };

  const handleRemoveEducation = (index) => {
    if (educations.length === 1) {
      alert(t['mustHaveAtLeastOne']);
      return;
    }
    if (confirm(t['confirmRemoveEducation'])) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const hasEmpty = educations.some(e =>
      !e.course?.trim() || !e.degree?.trim() || !e.institution?.trim() || !e.startDate?.trim()
    );
    if (hasEmpty) {
      alert(t['fillRequiredFields']);
      return;
    }

    const cv = JSON.parse(localStorage.getItem('currentCV') || '{}');
    cv.education = educations;
    localStorage.setItem('currentCV', JSON.stringify(cv));

    alert(t['educationSaved']);
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-teal-500 px-5 py-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-white text-xl">
          <ChevronRight />
        </button>
        <h1 className="text-white font-bold text-xl text-center flex-1">{t['educationDetails']}</h1>
        <div className="w-6" /> {/* placeholder */}
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        <h2 className="text-lg font-bold text-gray-800">{t['educationInformation']}</h2>
        <p className="text-gray-500 text-sm mb-4">{t['addYourEducationalBackground']}</p>

        {educations.map((edu, index) => (
          <div key={edu.id} className="bg-gray-100 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-teal-500">{t['education']} {index + 1}</h3>
              {educations.length > 1 && (
                <button onClick={() => handleRemoveEducation(index)} className="text-red-500">
                  <CheckCircle size={20} />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t['courseFieldOfStudy']} *</label>
              <input
                type="text"
                value={edu.course}
                onChange={e => handleEducationChange(index, 'course', e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t['degree']} *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={e => handleEducationChange(index, 'degree', e.target.value)}
                placeholder="e.g. Bachelor's"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t['schoolUniversity']} *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={e => handleEducationChange(index, 'institution', e.target.value)}
                placeholder="e.g. Cairo University"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="font-semibold text-gray-700">{t['startDate']} *</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={e => handleEducationChange(index, 'startDate', e.target.value)}
                  placeholder="e.g. Sep 2020"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="font-semibold text-gray-700">
                  {t['endDate']} {edu.isCurrentlyStudying ? '' : '*'}
                </label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={e => handleEducationChange(index, 'endDate', e.target.value)}
                  placeholder={edu.isCurrentlyStudying ? t['present'] : 'e.g. Jun 2024'}
                  disabled={edu.isCurrentlyStudying}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${edu.isCurrentlyStudying ? 'bg-gray-200 text-gray-500' : ''}`}
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={edu.isCurrentlyStudying}
                onChange={e => handleCurrentlyStudyingChange(index, e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700 text-sm">{t['currentlyStudyingHere']}</span>
            </label>

            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t['gradeScore']}</label>
              <input
                type="text"
                value={edu.grade}
                onChange={e => handleEducationChange(index, 'grade', e.target.value)}
                placeholder="e.g. 3.8 GPA"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleAddEducation}
          className="flex items-center justify-center gap-2 border border-teal-500 border-dashed rounded-md py-2 text-teal-500 font-semibold"
        >
          <ClipboardList size={20} /> {t['addAnotherEducation']}
        </button>

        <button
          onClick={handleSave}
          className="bg-teal-500 w-full py-3 rounded-md text-white font-bold"
        >
          {t['saveEducation']}
        </button>
      </div>
    </div>
  );
}
