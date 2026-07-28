-- ====================================================================
-- SU IT Guide — Complete Supabase PostgreSQL Database Schema
-- Execute this file in your Supabase SQL Editor (1-Click Safe Setup)
-- ====================================================================

-- 1. Profiles Table (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  level TEXT DEFAULT 'الفرقة الأولى',
  department TEXT DEFAULT 'تكنولوجيا المعلومات (IT)',
  student_id TEXT,
  bio TEXT,
  avatar TEXT DEFAULT '🎓',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Community Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'عام',
  author TEXT NOT NULL,
  author_email TEXT NOT NULL,
  avatar TEXT DEFAULT '🎓',
  date TEXT NOT NULL,
  likes JSONB DEFAULT '[]'::jsonb,
  reported BOOLEAN DEFAULT FALSE,
  attachment_name TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Course Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 5,
  difficulty NUMERIC DEFAULT 3,
  workload NUMERIC DEFAULT 3,
  attendance BOOLEAN DEFAULT TRUE,
  exam_difficulty NUMERIC DEFAULT 3,
  comment TEXT,
  tips TEXT,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Academic Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_code TEXT NOT NULL,
  type TEXT NOT NULL,
  author TEXT NOT NULL,
  upload_date TEXT NOT NULL,
  download_count INT DEFAULT 0,
  rating NUMERIC DEFAULT 5,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Careers & Internships Table
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'مصر',
  type TEXT NOT NULL DEFAULT 'internship',
  description TEXT NOT NULL,
  link TEXT DEFAULT '#',
  department TEXT DEFAULT 'all',
  experience TEXT DEFAULT 'entry',
  date_added TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  nodes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'news',
  date TEXT NOT NULL,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TEXT NOT NULL,
  category TEXT DEFAULT 'settings',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Grant Public Read/Write Access for App Operations
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running to avoid duplicate policy errors
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
DROP POLICY IF EXISTS "Public Posts Access" ON public.posts;
DROP POLICY IF EXISTS "Public Reviews Access" ON public.reviews;
DROP POLICY IF EXISTS "Public Resources Access" ON public.resources;
DROP POLICY IF EXISTS "Public Careers Access" ON public.careers;
DROP POLICY IF EXISTS "Public Roadmaps Access" ON public.roadmaps;
DROP POLICY IF EXISTS "Public Announcements Access" ON public.announcements;
DROP POLICY IF EXISTS "Public Audit Logs Access" ON public.audit_logs;

-- Create Policies
CREATE POLICY "Public Profiles Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Posts Access" ON public.posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Reviews Access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Resources Access" ON public.resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Careers Access" ON public.careers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Roadmaps Access" ON public.roadmaps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Announcements Access" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Audit Logs Access" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
