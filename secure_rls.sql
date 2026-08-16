-- ==============================================================================================
-- 🚀 Production Security Migration: Enforce Strict Row Level Security (RLS)
-- Run this script in the Supabase SQL Editor to secure the database.
-- ==============================================================================================

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop the dangerous "Public" policies that allowed ANYONE to edit ANY data
DROP POLICY IF EXISTS "Public Profiles Access" ON public.profiles;
DROP POLICY IF EXISTS "Public Academic Progress Access" ON public.academic_progress;
DROP POLICY IF EXISTS "Public AI Conversations Access" ON public.ai_conversations;
DROP POLICY IF EXISTS "Public AI Messages Access" ON public.ai_messages;

-- (Also drop any legacy policies from previous migrations just in case)
DROP POLICY IF EXISTS "Users can view their own academic progress" ON public.academic_progress;
DROP POLICY IF EXISTS "Users can insert their own academic progress" ON public.academic_progress;
DROP POLICY IF EXISTS "Users can update their own academic progress" ON public.academic_progress;
DROP POLICY IF EXISTS "Users can view their own AI conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can insert their own AI conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can update their own AI conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can delete their own AI conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can view messages of their conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON public.ai_messages;

-- 3. Create Strict Secure Policies

-- PROFILES: Everyone can view profiles, but only the owner can update their own profile.
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ACADEMIC PROGRESS: Only the owner can view, insert, update, or delete.
CREATE POLICY "Users can view own academic progress" 
ON public.academic_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own academic progress" 
ON public.academic_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own academic progress" 
ON public.academic_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own academic progress" 
ON public.academic_progress FOR DELETE USING (auth.uid() = user_id);


-- AI CONVERSATIONS: Only the owner can view, insert, update, or delete.
CREATE POLICY "Users can view own AI conversations" 
ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI conversations" 
ON public.ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI conversations" 
ON public.ai_conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI conversations" 
ON public.ai_conversations FOR DELETE USING (auth.uid() = user_id);


-- AI MESSAGES: Only the owner of the conversation can interact.
CREATE POLICY "Users can view own AI messages" 
ON public.ai_messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.ai_conversations 
        WHERE ai_conversations.id = ai_messages.conversation_id 
        AND ai_conversations.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own AI messages" 
ON public.ai_messages FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.ai_conversations 
        WHERE ai_conversations.id = ai_messages.conversation_id 
        AND ai_conversations.user_id = auth.uid()
    )
);

-- ==============================================================================================
-- DONE! The database is now secure for production.
-- ==============================================================================================
