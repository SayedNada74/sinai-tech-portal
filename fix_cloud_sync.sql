-- ==============================================================================================
-- 🚀 Database Migration: Add Cloud Sync Support for Learning & Social States
-- Run this script in the Supabase SQL Editor.
-- ==============================================================================================

-- 1. Add learning_state and social_state columns to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS learning_state jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_state jsonb DEFAULT '{}'::jsonb;

-- 2. Add messages column to ai_conversations table to fix chat save logic
ALTER TABLE public.ai_conversations ADD COLUMN IF NOT EXISTS messages jsonb DEFAULT '[]'::jsonb;

-- ==============================================================================================
-- DONE!
-- ==============================================================================================
