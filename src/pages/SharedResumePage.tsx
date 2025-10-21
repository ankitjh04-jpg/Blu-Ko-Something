import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ResumePreview from '../components/resume/ResumePreview';
import { Download, FileText } from 'lucide-react';
import { downloadAsHTML, downloadAsPDF } from '../utils/resumeDownload';

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
  resume_name: string;
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  skills: string[];
  education: Education[];
  status: string;
}

export function SharedResumePage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    loadSharedResume();
  }, [shareToken]);

  const loadSharedResume = async () => {
    if (!shareToken) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .maybeSingle();

    if (error || !data) {
      setError('Resume not found or is not publicly shared');
      setLoading(false);
      return;
    }

    setResume(data);
    setLoading(false);
  };

  const downloadResume = async (format: 'html' | 'pdf') => {
    if (!resume) return;

    try {
      if (format === 'html') {
        downloadAsHTML(resume);
      } else {
        await downloadAsPDF(resume);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
    setShowDownloadModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] flex items-center justify-center">
        <div className="text-white text-xl">Loading resume...</div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] flex items-center justify-center px-4">
        <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8 max-w-md w-full text-center">
          <FileText className="mx-auto text-red-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-2">Resume Not Found</h2>
          <p className="text-[#A8B8CC]">
            {error || 'This resume is not available or has been removed.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white">
              {resume.title || resume.resume_name}
            </h1>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 bg-[#FBC888] hover:bg-[#FBC888]/90 text-[#002B5C] font-semibold px-6 py-2 rounded-lg transition-all duration-200"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ResumePreview resume={resume} isModal={false} />
      </div>

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Download Resume
            </h3>
            <p className="text-gray-600 mb-6">Choose your preferred format:</p>
            <div className="space-y-3">
              <button
                onClick={() => downloadResume('html')}
                className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <FileText size={24} />
                  <div className="text-left">
                    <div className="font-semibold">HTML Format</div>
                    <div className="text-xs opacity-80">
                      Web-friendly format
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => downloadResume('pdf')}
                className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-900 text-white px-6 py-4 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <FileText size={24} />
                  <div className="text-left">
                    <div className="font-semibold">PDF Format</div>
                    <div className="text-xs opacity-80">Print-ready format</div>
                  </div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
