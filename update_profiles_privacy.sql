-- ==============================================================================================
-- 🚀 Database Migration: Add Privacy Settings to Profiles
-- Run this script in the Supabase SQL Editor.
-- ==============================================================================================

-- 1. Add privacy_settings column as JSONB (Default: public for skills and projects)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"publicSkills": true, "publicProjects": true}'::jsonb;

-- 2. Update existing rows that might have a null privacy_settings
UPDATE profiles
SET privacy_settings = '{"publicSkills": true, "publicProjects": true}'::jsonb
WHERE privacy_settings IS NULL;

-- 3. Notify postgrest to reload the schema cache
NOTIFY pgrst, 'reload schema';
