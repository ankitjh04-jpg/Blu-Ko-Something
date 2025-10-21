/*
  # Update Resumes Table for Botpress Integration

  ## Overview
  This migration updates the resumes table to support Botpress webhook integration
  with structured resume data including personal information, work experience, 
  skills, and education. It also adds sharing functionality and status tracking.

  ## Changes to Existing Tables

  ### 1. `resumes` Table Updates
  Adding new columns to support Botpress integration:
  - `title` (text) - Resume title/name for easier identification
  - `personal_info` (jsonb) - Structured personal information (name, phone, email, location)
  - `work_experience` (jsonb) - Array of work experience entries
  - `skills` (jsonb) - Array of skills
  - `education` (jsonb) - Array of education entries
  - `status` (text) - Resume status: 'draft' or 'complete'
  - `file_size` (text) - Approximate file size for display
  - `share_token` (text, unique) - Unique token for public sharing
  - `is_public` (boolean) - Whether resume can be accessed via share link

  ## New Tables

  ### 1. `resume_shares` Table
  Tracks resume share links and access
  - `id` (uuid, primary key)
  - `resume_id` (uuid) - References resumes table
  - `share_token` (text, unique) - Unique shareable token
  - `created_at` (timestamptz) - When share link was created
  - `accessed_count` (integer) - Number of times accessed
  - `last_accessed_at` (timestamptz) - Last access timestamp

  ## Security
  - Maintain existing RLS policies for resumes table
  - Add public read policy for shared resumes using share_token
  - Enable RLS on resume_shares table
  - Users can only create/manage shares for their own resumes
  - Public users can access shared resumes without authentication

  ## Important Notes
  - All new columns use appropriate default values
  - Existing resume records are preserved
  - Share tokens are generated using gen_random_uuid()
  - Public access is restricted to shared resumes only
*/

-- Add new columns to resumes table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'title'
  ) THEN
    ALTER TABLE resumes ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'personal_info'
  ) THEN
    ALTER TABLE resumes ADD COLUMN personal_info jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'work_experience'
  ) THEN
    ALTER TABLE resumes ADD COLUMN work_experience jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'skills'
  ) THEN
    ALTER TABLE resumes ADD COLUMN skills jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'education'
  ) THEN
    ALTER TABLE resumes ADD COLUMN education jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'status'
  ) THEN
    ALTER TABLE resumes ADD COLUMN status text DEFAULT 'draft';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE resumes ADD COLUMN file_size text DEFAULT '0 KB';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'share_token'
  ) THEN
    ALTER TABLE resumes ADD COLUMN share_token text UNIQUE DEFAULT gen_random_uuid()::text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resumes' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE resumes ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Create resume_shares table if it doesn't exist
CREATE TABLE IF NOT EXISTS resume_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  share_token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  accessed_count integer DEFAULT 0,
  last_accessed_at timestamptz
);

-- Enable RLS on resume_shares
ALTER TABLE resume_shares ENABLE ROW LEVEL SECURITY;

-- Add indexes for share_token lookup
CREATE INDEX IF NOT EXISTS idx_resumes_share_token ON resumes(share_token);
CREATE INDEX IF NOT EXISTS idx_resume_shares_share_token ON resume_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_resume_shares_resume_id ON resume_shares(resume_id);

-- Public read policy for shared resumes (no authentication required)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Public can view shared resumes'
  ) THEN
    CREATE POLICY "Public can view shared resumes"
      ON resumes FOR SELECT
      TO anon
      USING (is_public = true);
  END IF;
END $$;

-- RLS Policies for resume_shares
CREATE POLICY "Users can view own resume shares"
  ON resume_shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = resume_shares.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shares for own resumes"
  ON resume_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = resume_shares.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own resume shares"
  ON resume_shares FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resumes
      WHERE resumes.id = resume_shares.resume_id
      AND resumes.user_id = auth.uid()
    )
  );
