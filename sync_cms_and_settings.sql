-- ==============================================================================================
-- 🚀 SINAI TECH PORTAL — COMPREHENSIVE CLOUD DATA PERSISTENCE & CMS MIGRATION
-- Copy and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/odjodsorkpdgixzyiyyc/sql
-- ==============================================================================================

-- 1. Create FAQs Table (Knowledge Base)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'التسجيل',
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Settings Table (AI Prompts, Custom Courses & Platform Configuration)
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ensure Posts Table has comments and likes JSONB columns
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General Discussion',
  author TEXT NOT NULL,
  author_email TEXT NOT NULL,
  avatar TEXT DEFAULT '🎓',
  date TEXT NOT NULL,
  likes JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  reported BOOLEAN DEFAULT FALSE,
  attachment_name TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.posts 
  ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;

ALTER TABLE IF EXISTS public.posts 
  ADD COLUMN IF NOT EXISTS likes JSONB DEFAULT '[]'::jsonb;

-- 4. Create Free Certificates Table
CREATE TABLE IF NOT EXISTS public.free_certificates (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ai_data',
  category_ar TEXT,
  category_en TEXT,
  duration TEXT,
  language TEXT,
  desc_ar TEXT,
  desc_en TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Ensure Roadmaps Table Exists
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  duration TEXT NOT NULL,
  duration_en TEXT,
  nodes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Ensure Careers Table Exists
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'مصر',
  type TEXT NOT NULL DEFAULT 'internship',
  experience TEXT DEFAULT 'entry',
  department TEXT DEFAULT 'all',
  description TEXT NOT NULL,
  link TEXT DEFAULT '#',
  date_added TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Ensure Announcements Table Exists
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'news',
  date TEXT NOT NULL,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Ensure Resources Table Exists
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  course_code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'pdf',
  author TEXT NOT NULL,
  upload_date TEXT NOT NULL,
  download_count INT DEFAULT 0,
  rating NUMERIC DEFAULT 5,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Ensure Reviews Table Exists
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
  author_id TEXT,
  date TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Ensure Academic Progress Table Exists
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

-- ==============================================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE COLLABORATION POLICIES
-- ==============================================================================================
ALTER TABLE IF EXISTS public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.free_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.academic_progress ENABLE ROW LEVEL SECURITY;

-- Drop conflicting legacy policies
DROP POLICY IF EXISTS "Faqs viewable by everyone" ON public.faqs;
DROP POLICY IF EXISTS "Faqs manageable by all" ON public.faqs;
DROP POLICY IF EXISTS "Settings viewable by everyone" ON public.settings;
DROP POLICY IF EXISTS "Settings manageable by all" ON public.settings;
DROP POLICY IF EXISTS "Posts viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Certificates viewable by everyone" ON public.free_certificates;
DROP POLICY IF EXISTS "Certificates manageable by all" ON public.free_certificates;
DROP POLICY IF EXISTS "Roadmaps viewable by everyone" ON public.roadmaps;
DROP POLICY IF EXISTS "Roadmaps manageable by all" ON public.roadmaps;
DROP POLICY IF EXISTS "Careers viewable by everyone" ON public.careers;
DROP POLICY IF EXISTS "Careers manageable by all" ON public.careers;
DROP POLICY IF EXISTS "Announcements viewable by everyone" ON public.announcements;
DROP POLICY IF EXISTS "Announcements manageable by all" ON public.announcements;
DROP POLICY IF EXISTS "Resources viewable by everyone" ON public.resources;
DROP POLICY IF EXISTS "Resources manageable by all" ON public.resources;
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Reviews manageable by all" ON public.reviews;
DROP POLICY IF EXISTS "Academic progress viewable by everyone" ON public.academic_progress;
DROP POLICY IF EXISTS "Academic progress manageable by all" ON public.academic_progress;

-- 1. FAQs Policies
CREATE POLICY "Faqs viewable by everyone" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Faqs manageable by all" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

-- 2. Settings Policies (AI Prompting, Custom Courses, Platform Settings)
CREATE POLICY "Settings viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings manageable by all" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- 3. Posts Policies (Forum, Comments, and Likes)
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Users can delete posts" ON public.posts FOR DELETE USING (true);

-- 4. Free Certificates Policies
CREATE POLICY "Certificates viewable by everyone" ON public.free_certificates FOR SELECT USING (true);
CREATE POLICY "Certificates manageable by all" ON public.free_certificates FOR ALL USING (true) WITH CHECK (true);

-- 5. Roadmaps Policies
CREATE POLICY "Roadmaps viewable by everyone" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Roadmaps manageable by all" ON public.roadmaps FOR ALL USING (true) WITH CHECK (true);

-- 6. Careers Policies
CREATE POLICY "Careers viewable by everyone" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Careers manageable by all" ON public.careers FOR ALL USING (true) WITH CHECK (true);

-- 7. Announcements Policies
CREATE POLICY "Announcements viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Announcements manageable by all" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

-- 8. Resources Policies
CREATE POLICY "Resources viewable by everyone" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Resources manageable by all" ON public.resources FOR ALL USING (true) WITH CHECK (true);

-- 9. Reviews Policies (Course Reviews & Helpful Votes)
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews manageable by all" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- 10. Academic Progress Policies (Cross-device GPA & course progress)
CREATE POLICY "Academic progress viewable by everyone" ON public.academic_progress FOR SELECT USING (true);
CREATE POLICY "Academic progress manageable by all" ON public.academic_progress FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================================
-- SEED INITIAL REPOSITORIES (Only if tables are empty)
-- ==============================================================================================

-- Seed FAQs
INSERT INTO public.faqs (id, question, answer, category, pinned)
VALUES 
('faq-1', 'ما هو الحد الأقصى للساعات المعتمدة للتسجيل في الفصل الدراسي الواحد؟', 'الحد الأقصى هو 18 ساعة معتمدة للطلاب ذوي المعدل التراكمي المرتفع، و12 ساعة معتمدة للطلاب الخاضعين للإنذار الأكاديمي.', 'التسجيل', true),
('faq-2', 'كيف يتم حساب المعدل التراكمي (GPA) في الكلية؟', 'يتم بضرب نقاط تقدير كل مقرر في عدد ساعاته المعتمدة، ثم جمع إجمالي النقاط وقسمتها على إجمالي الساعات المسجلة.', 'الدرجات', true),
('faq-3', 'كيف يمكنني رفع معدلي التراكمي (GPA)؟', 'يمكنك إعادة دراسة المواد التي حصلت فيها على تقدير أقل من C لرفع التقدير وحساب المعدل مجدداً.', 'الدرجات', false),
('faq-4', 'ما هي شروط الالتحاق بمشروع التخرج (1)؟', 'يشترط إتمام 100 ساعة معتمدة بنجاح واجتياز المتطلبات المحددة بالقسم الأكاديمي الخاص بك.', 'التخرج', false)
ON CONFLICT (id) DO NOTHING;

-- Seed Settings (AI Config & Platform Settings)
INSERT INTO public.settings (id, value)
VALUES 
('ai_config', '{"systemPrompt":"أنت مساعد أكاديمي ذكي لطلاب تكنولوجيا المعلومات بجامعة سيناء. أجب بأسلوب لبق وموجز وباللغة العربية.","temperature":0.7,"suggestedReplies":["ما هي شروط تسجيل مشروع التخرج؟","اقترح لي خطة دراسية متوازنة","ما هي أصعب مواد قسم تكنولوجيا المعلومات؟"]}'),
('platform_settings', '{"siteName":"دليل ومرشد طلاب IT","logo":"🎓","contactEmail":"it.guide@sinai.edu.eg","maintenanceMode":false,"theme":"system","featureFlags":{"gpaPredictor":true,"aiAssistant":true,"courseReviews":true,"resourceSharing":true,"careersPortal":true,"freeCertificatesHub":true,"semesterTranscript":true,"liveAnnouncements":true,"studentDirectory":true},"gpaFeatureStatus":"ADMIN_ONLY","featureAccess":{"gpa":"ALL","gpaRegular":"ALL","gpaFlexible":"ALL","aiAssistant":"ALL","careers":"ALL","courseReviews":"ALL","resourceSharing":"ALL","studentDirectory":"ALL","planner":"ALL"}}')
ON CONFLICT (id) DO NOTHING;

-- Seed Community Posts
INSERT INTO public.posts (id, title, category, content, date, author, author_email, avatar, likes, comments, reported)
VALUES 
('post-1', 'ما هي أفضل الطرق للتعامل مع مادة الداتا ستراكشر (CSW 232)؟', 'Study Help', 'يا شباب، محتاج نصائح للتعامل مع أسئلة امتحان الميدتيرم لمادة بناء البيانات والمعلومات. تنصحوا بحل مسائل شيت الكود واللاب ولا التركيز على الفهم النظري فقط؟', '2026-07-25', 'أحمد محمود', 'ahmed.m@sinai.edu.eg', '👨‍💻', '["admin@sinai.edu.eg"]'::jsonb, '[{"id":"comm-1","postId":"post-1","author":"سيد ندى","authorEmail":"sayed@example.com","avatar":"🎓","content":"ركز جداً على كود Linked Lists والـ Binary Trees لأن الدكاترة بيطلبوا كتابة الكود بنفسك بالورقة والقلم!","date":"2026-07-26","replies":[]}]'::jsonb, false),
('post-2', 'جلسة دراسية وتطبيق عملي لمشروع تطوير الويب بـ React & Next.js 🚀', 'Web Development', 'بنجهز لجروب عمل وتدريب أسبوعي زوم لتطبيق مشاريع تخرج وأفكار مواقع حقيقية بـ Next.js و Tailwind. اللي حابب ينضم يسيب تعليق بمهاراته الحالية!', '2026-07-27', 'مريم علي', 'mariam.a@sinai.edu.eg', '👩‍💻', '[]'::jsonb, '[]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- Seed Free Certificates
INSERT INTO public.free_certificates (id, title_ar, title_en, provider, category, category_ar, category_en, duration, language, desc_ar, desc_en, skills, link)
VALUES 
('cert-1', 'شهادة أساسيات الذكاء الاصطناعي التوليدي', 'Generative AI Fundamentals Certificate', 'MaharaTech (ITI - معهد تكنولوجيا المعلومات)', 'ai_data', 'الذكاء الاصطناعي وعلوم البيانات', 'AI & Data Science', '15 ساعة تدريبية', 'العربية / الإنجليزية', 'تمنحك الشهادة فهمًا عمليًا لبناء ونشر نماذج الذكاء الاصطناعي التوليدي، مع التعامل مع الهندسة الفورية (Prompt Engineering) وتطبيقات الـ Large Language Models (LLMs).', 'Provides practical hands-on understanding of building Generative AI applications and Prompt Engineering.', '["Prompt Engineering", "Generative AI", "LLMs", "Python"]'::jsonb, 'https://maharatech.gov.eg/course/index.php?categoryid=40'),
('cert-2', 'شهادة تحليل البيانات المعتمدة من جوجل', 'Google Data Analytics Professional Certificate', 'Google (عبر Coursera - مع دعم مالي مجاني 100%)', 'ai_data', 'الذكاء الاصطناعي وعلوم البيانات', 'AI & Data Science', '180 ساعة (مرنة)', 'الإنجليزية (مترجمة للعربية)', 'شهادة احترافية من Google تؤهلك للعمل كمحلل بيانات. تشمل تنظيف البيانات تحليلها باستخدام SQL و R و Tableau وإعداد التقارير التفاعلية.', 'Official Google certificate equipping you with SQL, R programming, Tableau visualization, and data cleaning skills.', '["SQL", "R Language", "Tableau", "Data Analysis", "Spreadsheets"]'::jsonb, 'https://www.coursera.org/professional-certificates/google-data-analytics')
ON CONFLICT (id) DO NOTHING;
