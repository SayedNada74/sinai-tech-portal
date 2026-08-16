-- ====================================================================
-- SU IT Guide — Cloud Sync Database Tables (Legacy Safe)
-- ====================================================================
-- This script creates the missing tables for GPA, Courses, and AI Chats!
-- It is designed to safely support legacy local accounts by using TEXT user_id.

-- 1. Academic Progress Table (Cross-Device Cloud Persistence)
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

ALTER TABLE public.academic_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Academic Progress Access" ON public.academic_progress;
CREATE POLICY "Public Academic Progress Access" ON public.academic_progress FOR ALL USING (true) WITH CHECK (true);


-- 2. AI Assistant Conversations Table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public AI Conversations Access" ON public.ai_conversations;
CREATE POLICY "Public AI Conversations Access" ON public.ai_conversations FOR ALL USING (true) WITH CHECK (true);


-- 3. AI Assistant Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public AI Messages Access" ON public.ai_messages;
CREATE POLICY "Public AI Messages Access" ON public.ai_messages FOR ALL USING (true) WITH CHECK (true);
