-- ====================================================================
-- SU IT Guide — Comprehensive Database Persistence Migration Schema
-- Target Supabase Database: https://odjodsorkpdgixzyiyyc.supabase.co
-- ====================================================================

-- 1. Ensure Profiles Table has all required columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  level TEXT DEFAULT 'الفرقة الأولى',
  department TEXT DEFAULT 'تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)',
  student_id TEXT,
  avatar TEXT DEFAULT '🎓',
  bio TEXT DEFAULT 'طالب مسجل في المنصة الأكاديمية.',
  social_links JSONB DEFAULT '{}'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  cv_url TEXT DEFAULT '',
  projects JSONB DEFAULT '[]'::jsonb,
  badges JSONB DEFAULT '["طالب"]'::jsonb,
  points INT DEFAULT 50,
  is_profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Academic Progress Table (Cross-Device Cloud Persistence)
CREATE TABLE IF NOT EXISTS public.academic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_courses JSONB DEFAULT '[]'::jsonb,
  planned_courses JSONB DEFAULT '[]'::jsonb,
  target_gpa NUMERIC(3,2) DEFAULT 3.50,
  completed_hours INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on academic_progress
ALTER TABLE public.academic_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for academic_progress
CREATE POLICY "Users can view their own academic progress" ON public.academic_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own academic progress" ON public.academic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own academic progress" ON public.academic_progress FOR UPDATE USING (auth.uid() = user_id);

-- 3. AI Assistant Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI conversations" ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own AI conversations" ON public.ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own AI conversations" ON public.ai_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own AI conversations" ON public.ai_conversations FOR DELETE USING (auth.uid() = user_id);

-- 4. AI Assistant Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on ai_messages
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their conversations" ON public.ai_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations
    WHERE public.ai_conversations.id = public.ai_messages.conversation_id
    AND public.ai_conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages into their conversations" ON public.ai_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_conversations
    WHERE public.ai_conversations.id = public.ai_messages.conversation_id
    AND public.ai_conversations.user_id = auth.uid()
  )
);
