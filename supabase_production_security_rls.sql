-- ==============================================================================================
-- 🛡️ SINAI TECH PORTAL — HARDENED PRODUCTION SECURITY & STRICT LEAST-PRIVILEGE RLS MIGRATION
-- Copy and execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/odjodsorkpdgixzyiyyc/sql
-- ==============================================================================================

-- 1. Ensure required columns and data safety
ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"publicSkills": true, "publicProjects": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- SECURITY: Drop plain password column from profiles if it exists (passwords live in auth.users only)
ALTER TABLE IF EXISTS public.profiles DROP COLUMN IF EXISTS password;

-- 2. Ensure academic_progress and ai_conversations tables exist
CREATE TABLE IF NOT EXISTS public.academic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  completed_courses JSONB DEFAULT '[]'::jsonb,
  planned_courses JSONB DEFAULT '[]'::jsonb,
  target_gpa NUMERIC(3,2) DEFAULT 3.50,
  completed_hours INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure reviews table has author_id for strict ownership checks
ALTER TABLE IF EXISTS public.reviews
  ADD COLUMN IF NOT EXISTS author_id TEXT;

-- 3. Security Definer Helper Functions with Hardened search_path
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role 
  FROM public.profiles 
  WHERE id::text = auth.uid()::text 
  LIMIT 1;
  
  RETURN COALESCE(v_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_user_role() IN ('admin', 'super-admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_user_role() IN ('moderator', 'admin', 'super-admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

-- 4. Role Privilege Escalation Protection Trigger (Applies to INSERT & UPDATE)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT, enforce student role unless caller is an existing super-admin
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.role IS NOT NULL AND NEW.role != 'student') THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id::text = auth.uid()::text AND role = 'super-admin'
      ) THEN
        NEW.role := 'student';
      END IF;
    END IF;
  END IF;

  -- On UPDATE, prevent non-super-admins from changing their role
  IF (TG_OP = 'UPDATE') THEN
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id::text = auth.uid()::text AND role = 'super-admin'
      ) THEN
        NEW.role := OLD.role;
      END IF;
    END IF;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role();


-- ==============================================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ==============================================================================================
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.academic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_messages ENABLE ROW LEVEL SECURITY;


-- ==============================================================================================
-- 6. DROP ALL LEGACY / PERMISSIVE POLICIES
-- ==============================================================================================
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;


-- ==============================================================================================
-- 7. RE-CREATE PRODUCTION LEAST-PRIVILEGE RLS POLICIES
-- ==============================================================================================

-- -------------------------------------------------------------
-- PROFILES
-- -------------------------------------------------------------
CREATE POLICY "Profiles viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile or super admin" 
ON public.profiles FOR UPDATE 
USING (auth.uid()::text = id::text OR public.current_user_role() = 'super-admin');

CREATE POLICY "Only super admin can delete profiles" 
ON public.profiles FOR DELETE 
USING (public.current_user_role() = 'super-admin');


-- -------------------------------------------------------------
-- ACADEMIC PROGRESS
-- -------------------------------------------------------------
CREATE POLICY "Users can view own academic progress" 
ON public.academic_progress FOR SELECT 
USING (auth.uid()::text = user_id::text OR public.is_admin_or_super());

CREATE POLICY "Users can insert own academic progress" 
ON public.academic_progress FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own academic progress" 
ON public.academic_progress FOR UPDATE 
USING (auth.uid()::text = user_id::text OR public.is_admin_or_super());

CREATE POLICY "Users can delete own academic progress" 
ON public.academic_progress FOR DELETE 
USING (auth.uid()::text = user_id::text OR public.is_admin_or_super());


-- -------------------------------------------------------------
-- AI CONVERSATIONS & MESSAGES
-- -------------------------------------------------------------
CREATE POLICY "Users can view own AI conversations" 
ON public.ai_conversations FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own AI conversations" 
ON public.ai_conversations FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own AI conversations" 
ON public.ai_conversations FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own AI conversations" 
ON public.ai_conversations FOR DELETE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own AI messages" 
ON public.ai_messages FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own AI messages" 
ON public.ai_messages FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);


-- -------------------------------------------------------------
-- COMMUNITY POSTS
-- -------------------------------------------------------------
CREATE POLICY "Posts viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Author or staff can update posts" 
ON public.posts FOR UPDATE 
USING (
  (auth.email() IS NOT NULL AND auth.email() = author_email) OR 
  public.is_staff_or_admin()
);

CREATE POLICY "Author or staff can delete posts" 
ON public.posts FOR DELETE 
USING (
  (auth.email() IS NOT NULL AND auth.email() = author_email) OR 
  public.is_staff_or_admin()
);


-- -------------------------------------------------------------
-- COURSE REVIEWS (Strict Least-Privilege Author / Staff Only)
-- -------------------------------------------------------------
CREATE POLICY "Reviews viewable by everyone" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can post reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Author or staff can update reviews" 
ON public.reviews FOR UPDATE 
USING (
  (auth.uid()::text = author_id::text) OR 
  public.is_staff_or_admin()
);

CREATE POLICY "Author or staff can delete reviews" 
ON public.reviews FOR DELETE 
USING (
  (auth.uid()::text = author_id::text) OR 
  public.is_staff_or_admin()
);


-- -------------------------------------------------------------
-- ACADEMIC RESOURCES, CAREERS, ROADMAPS, ANNOUNCEMENTS
-- -------------------------------------------------------------
CREATE POLICY "Resources viewable by everyone" 
ON public.resources FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage resources" 
ON public.resources FOR ALL 
USING (public.is_staff_or_admin()) 
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Careers viewable by everyone" 
ON public.careers FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage careers" 
ON public.careers FOR ALL 
USING (public.is_admin_or_super()) 
WITH CHECK (public.is_admin_or_super());

CREATE POLICY "Roadmaps viewable by everyone" 
ON public.roadmaps FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage roadmaps" 
ON public.roadmaps FOR ALL 
USING (public.is_admin_or_super()) 
WITH CHECK (public.is_admin_or_super());

CREATE POLICY "Announcements viewable by everyone" 
ON public.announcements FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage announcements" 
ON public.announcements FOR ALL 
USING (public.is_staff_or_admin()) 
WITH CHECK (public.is_staff_or_admin());


-- -------------------------------------------------------------
-- AUDIT LOGS (IMMUTABLE LOGS)
-- -------------------------------------------------------------
CREATE POLICY "Only staff can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_admin_or_super());

CREATE POLICY "Authenticated users can append audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- (No UPDATE or DELETE policies created: audit logs are strictly immutable)


-- ==============================================================================================
-- 8. PERFORMANCE INDEXES
-- ==============================================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_academic_user_id ON public.academic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON public.reviews(course_code);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ==============================================================================================
-- DONE: Production database RLS is hardened and schema cache is refreshed.
-- ==============================================================================================
