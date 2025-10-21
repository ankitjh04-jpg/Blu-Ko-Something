import { X, MapPin, Phone, Mail, Briefcase, GraduationCap, Award } from 'lucide-react';

interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  institutionName: string;
  degreeOrProgram: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface Resume {
  id: string;
  title: string;
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  skills: string[];
  education: Education[];
  status: string;
}

interface ResumePreviewProps {
  resume: Resume;
  onClose?: () => void;
  isModal?: boolean;
}

export default function ResumePreview({ resume, onClose, isModal = true }: ResumePreviewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const content = (
    <div id="resume-preview" className="bg-white p-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {resume.personal_info.name}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {resume.personal_info.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{resume.personal_info.email}</span>
            </div>
          )}
          {resume.personal_info.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{resume.personal_info.phone}</span>
            </div>
          )}
          {resume.personal_info.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{resume.personal_info.location}</span>
            </div>
          )}
        </div>
      </div>

      {resume.work_experience && resume.work_experience.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          </div>
          <div className="space-y-6">
            {resume.work_experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                <p className="text-gray-700 font-medium">{exp.companyName}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  {exp.location && <span>{exp.location}</span>}
                  <span>
                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Education</h2>
          </div>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-blue-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">{edu.degreeOrProgram}</h3>
                <p className="text-gray-700 font-medium">{edu.institutionName}</p>
                {edu.fieldOfStudy && (
                  <p className="text-gray-600">{edu.fieldOfStudy}</p>
                )}
                {(edu.startDate || edu.endDate) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="sticky top-4 right-4 float-right p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
}
