export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface Education {
  institutionName: string;
  degreeOrProgram: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  skills: string[];
  education: Education[];
  certifications: string[];
}

const STORAGE_KEY = 'resumeData';
const RESUME_READY_KEY = 'resumeReady';

export const resumeDataService = {
  saveResumeData(data: ResumeData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(RESUME_READY_KEY, 'true');
    } catch (error) {
      console.error('Error saving resume data:', error);
      throw new Error('Failed to save resume data');
    }
  },

  getResumeData(): ResumeData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as ResumeData;
    } catch (error) {
      console.error('Error reading resume data:', error);
      return null;
    }
  },

  isResumeReady(): boolean {
    return localStorage.getItem(RESUME_READY_KEY) === 'true';
  },

  clearResumeData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(RESUME_READY_KEY);
    } catch (error) {
      console.error('Error clearing resume data:', error);
    }
  },

  async saveResumeToDatabase(userId: string, title: string): Promise<{ success: boolean; resumeId?: string; error?: string }> {
    const resumeData = this.getResumeData();

    if (!resumeData) {
      return { success: false, error: 'No resume data found' };
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/botpress-webhook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          personalInfo: resumeData.personalInfo,
          workExperience: resumeData.workExperience,
          skills: resumeData.skills,
          education: resumeData.education,
          status: 'complete'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.clearResumeData();
        return { success: true, resumeId: result.resumeId };
      } else {
        return { success: false, error: result.error || 'Failed to save resume' };
      }
    } catch (error) {
      console.error('Error saving resume to database:', error);
      return { success: false, error: 'Network error while saving resume' };
    }
  },

  parseBotpressData(rawData: any): ResumeData {
    const parseSkills = (skillsData: any): string[] => {
      if (Array.isArray(skillsData)) {
        return skillsData.filter(s => typeof s === 'string' && s.trim());
      }
      if (typeof skillsData === 'string') {
        return skillsData.split(',').map(s => s.trim()).filter(s => s);
      }
      return [];
    };

    const parseCertifications = (certsData: any): string[] => {
      if (Array.isArray(certsData)) {
        return certsData.filter(c => typeof c === 'string' && c.trim());
      }
      if (typeof certsData === 'string') {
        return certsData.split(',').map(c => c.trim()).filter(c => c);
      }
      return [];
    };

    return {
      personalInfo: {
        name: rawData.personalInfo?.name || rawData.name || '',
        email: rawData.personalInfo?.email || rawData.email || '',
        phone: rawData.personalInfo?.phone || rawData.phone || '',
        location: rawData.personalInfo?.location || rawData.location || '',
      },
      workExperience: Array.isArray(rawData.workExperience)
        ? rawData.workExperience
        : [],
      skills: parseSkills(rawData.skills),
      education: Array.isArray(rawData.education)
        ? rawData.education
        : [],
      certifications: parseCertifications(rawData.certifications),
    };
  },

  validateResumeData(data: ResumeData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.personalInfo.name || data.personalInfo.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!data.personalInfo.email || data.personalInfo.email.trim() === '') {
      errors.push('Email is required');
    }

    if (data.workExperience.length === 0) {
      errors.push('At least one work experience is required');
    }

    if (data.skills.length === 0) {
      errors.push('At least one skill is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};
