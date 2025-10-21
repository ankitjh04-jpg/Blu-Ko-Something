import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          location: string | null;
          profile_picture_url: string | null;
          professional_summary: string | null;
          profile_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          location?: string | null;
          profile_picture_url?: string | null;
          professional_summary?: string | null;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          location?: string | null;
          profile_picture_url?: string | null;
          professional_summary?: string | null;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_experiences: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          company_name: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          created_at: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          proficiency_level: string;
          created_at: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          user_id: string;
          certification_name: string;
          issuing_organization: string;
          issue_date: string | null;
          expiry_date: string | null;
          credential_id: string | null;
          created_at: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution_name: string;
          degree_or_program: string;
          field_of_study: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          created_at: string;
        };
      };
      languages: {
        Row: {
          id: string;
          user_id: string;
          language_name: string;
          proficiency_level: string;
          created_at: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          resume_name: string;
          template_name: string;
          resume_data: any;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      chatbot_conversations: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          is_user_message: boolean;
          conversation_context: any;
          created_at: string;
        };
      };
    };
  };
};
