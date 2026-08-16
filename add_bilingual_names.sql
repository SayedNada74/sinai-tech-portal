-- ==============================================================================================
-- 🚀 Database Migration: Add Bilingual Names Support
-- Run this script in the Supabase SQL Editor.
-- ==============================================================================================

-- 1. Add name_ar and name_en columns to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name_ar text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name_en text;

-- 2. Optional: Populate initial values from the existing 'name' column if desired
-- UPDATE public.profiles SET name_ar = name, name_en = name WHERE name_ar IS NULL OR name_en IS NULL;

-- ==============================================================================================
-- DONE!
-- ==============================================================================================
