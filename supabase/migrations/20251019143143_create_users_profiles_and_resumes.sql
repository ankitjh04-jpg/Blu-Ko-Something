/*
  # Blue Collar Worker Platform Database Schema

  ## Overview
  This migration creates the complete database schema for a blue collar worker platform
  with authentication, user profiles, resume data, and chatbot conversations.

  ## New Tables

  ### 1. `user_profiles`
  Stores extended user profile information beyond authentication
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `email` (text) - User's email address
  - `phone` (text) - Contact phone number
  - `location` (text) - User's location/city
  - `profile_picture_url` (text) - URL to profile picture in storage
  - `professional_summary` (text) - Brief professional summary
  - `profile_completed` (boolean) - Whether profile setup is complete
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `work_experiences`
  Stores user work history
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `job_title` (text) - Position title
  - `company_name` (text) - Employer name
  - `location` (text) - Job location
  - `start_date` (date) - Employment start date
  - `end_date` (date) - Employment end date (null if current)
  - `is_current` (boolean) - Whether this is current job
  - `description` (text) - Job responsibilities and achievements
  - `created_at` (timestamptz)

  ### 3. `skills`
  Stores user skills and competencies
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `skill_name` (text) - Name of skill
  - `proficiency_level` (text) - Beginner, Intermediate, Advanced, Expert
  - `created_at` (timestamptz)

  ### 4. `certifications`
  Stores professional certifications and licenses
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `certification_name` (text) - Name of certification
  - `issuing_organization` (text) - Organization that issued it
  - `issue_date` (date) - When certification was obtained
  - `expiry_date` (date) - When certification expires (null if no expiry)
  - `credential_id` (text) - Certification ID/number
  - `created_at` (timestamptz)

  ### 5. `education`
  Stores educational background
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `institution_name` (text) - School/institution name
  - `degree_or_program` (text) - Degree or program completed
  - `field_of_study` (text) - Area of study
  - `start_date` (date) - When started
  - `end_date` (date) - When completed (null if ongoing)
  - `is_current` (boolean) - Whether currently enrolled
  - `created_at` (timestamptz)

  ### 6. `languages`
  Stores languages spoken by user
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `language_name` (text) - Name of language
  - `proficiency_level` (text) - Basic, Conversational, Fluent, Native
  - `created_at` (timestamptz)

  ### 7. `resumes`
  Stores generated resumes
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `resume_name` (text) - User-defined name for this resume
  - `template_name` (text) - Which template was used
  - `resume_data` (jsonb) - Full resume data in JSON format
  - `pdf_url` (text) - URL to generated PDF in storage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. `chatbot_conversations`
  Stores AI chatbot conversation history
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `message` (text) - The message content
  - `is_user_message` (boolean) - True if from user, false if from bot
  - `conversation_context` (jsonb) - Additional context data
  - `created_at` (timestamptz)

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
  - INSERT policies allow authenticated users to create their own records
  - SELECT, UPDATE, DELETE policies restrict access to own records only

  ## Important Notes
  - All tables use `gen_random_uuid()` for ID generation
  - Timestamps use `now()` as default value
  - Foreign key constraints ensure data integrity
  - RLS policies are restrictive and check `auth.uid()` for ownership
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  profile_picture_url text,
  professional_summary text,
  profile_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_experiences table
CREATE TABLE IF NOT EXISTS work_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  company_name text NOT NULL,
  location text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  proficiency_level text DEFAULT 'Intermediate',
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  certification_name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  expiry_date date,
  credential_id text,
  created_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  institution_name text NOT NULL,
  degree_or_program text NOT NULL,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  language_name text NOT NULL,
  proficiency_level text DEFAULT 'Conversational',
  created_at timestamptz DEFAULT now()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  resume_name text NOT NULL,
  template_name text DEFAULT 'professional',
  resume_data jsonb NOT NULL,
  pdf_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_user_message boolean NOT NULL,
  conversation_context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for work_experiences
CREATE POLICY "Users can view own work experiences"
  ON work_experiences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work experiences"
  ON work_experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work experiences"
  ON work_experiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own work experiences"
  ON work_experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for skills
CREATE POLICY "Users can view own skills"
  ON skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for certifications
CREATE POLICY "Users can view own certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for education
CREATE POLICY "Users can view own education"
  ON education FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education"
  ON education FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own education"
  ON education FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for languages
CREATE POLICY "Users can view own languages"
  ON languages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own languages"
  ON languages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own languages"
  ON languages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own languages"
  ON languages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for chatbot_conversations
CREATE POLICY "Users can view own conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON chatbot_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON chatbot_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_work_experiences_user_id ON work_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_user_id ON languages(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at);