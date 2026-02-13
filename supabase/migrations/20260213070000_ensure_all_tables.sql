-- Ensure all tables exist and are properly configured for data import
-- Run this in Supabase SQL Editor before importing your data

-- ============================================================================
-- 1. CREATE TABLES (if they don't exist)
-- ============================================================================

-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL DEFAULT '{}',
  journal TEXT NOT NULL,
  doi TEXT NOT NULL UNIQUE,
  downloads INTEGER NOT NULL DEFAULT 0,
  citations INTEGER NOT NULL DEFAULT 0,
  published_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reader events table
CREATE TABLE IF NOT EXISTS public.reader_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Country stats table
CREATE TABLE IF NOT EXISTS public.country_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  reads INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  top_journal TEXT,
  top_article TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. DROP OLD POLICIES (clean slate)
-- ============================================================================

-- Articles policies
DROP POLICY IF EXISTS "Public read access for articles" ON public.articles;
DROP POLICY IF EXISTS "Allow insert articles" ON public.articles;
DROP POLICY IF EXISTS "Allow update articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can update articles" ON public.articles;
DROP POLICY IF EXISTS "Allow insert articles for seeding" ON public.articles;
DROP POLICY IF EXISTS "Allow update articles for seeding" ON public.articles;

-- Reader events policies
DROP POLICY IF EXISTS "Public read access for reader_events" ON public.reader_events;
DROP POLICY IF EXISTS "Allow insert reader_events" ON public.reader_events;
DROP POLICY IF EXISTS "Admin can insert reader_events" ON public.reader_events;
DROP POLICY IF EXISTS "Allow insert reader_events for seeding" ON public.reader_events;

-- Country stats policies
DROP POLICY IF EXISTS "Public read access for country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Allow insert country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Allow update country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Admin can insert country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Admin can update country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Allow insert country_stats for seeding" ON public.country_stats;
DROP POLICY IF EXISTS "Allow update country_stats for seeding" ON public.country_stats;

-- Profiles policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- User roles policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

-- ============================================================================
-- 4. CREATE NEW POLICIES (permissive for import)
-- ============================================================================

-- Articles: Public read, anyone can insert/update (for import)
CREATE POLICY "Public read articles" ON public.articles 
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert articles" ON public.articles 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update articles" ON public.articles 
  FOR UPDATE USING (true);

-- Reader events: Public read, anyone can insert (for import)
CREATE POLICY "Public read reader_events" ON public.reader_events 
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reader_events" ON public.reader_events 
  FOR INSERT WITH CHECK (true);

-- Country stats: Public read, anyone can insert/update (for import)
CREATE POLICY "Public read country_stats" ON public.country_stats 
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert country_stats" ON public.country_stats 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update country_stats" ON public.country_stats 
  FOR UPDATE USING (true);

-- Profiles: Users can manage their own
CREATE POLICY "Users can read own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: Users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles 
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 5. CREATE HELPER FUNCTION (if not exists)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================================
-- 6. CREATE TRIGGER FOR AUTO-PROFILE CREATION (if not exists)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. ENABLE REALTIME (if not already enabled)
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.reader_events;

-- ============================================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_articles_doi ON public.articles(doi);
CREATE INDEX IF NOT EXISTS idx_articles_journal ON public.articles(journal);
CREATE INDEX IF NOT EXISTS idx_articles_downloads ON public.articles(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_articles_citations ON public.articles(citations DESC);

CREATE INDEX IF NOT EXISTS idx_reader_events_country_code ON public.reader_events(country_code);
CREATE INDEX IF NOT EXISTS idx_reader_events_article_id ON public.reader_events(article_id);
CREATE INDEX IF NOT EXISTS idx_reader_events_created_at ON public.reader_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_country_stats_code ON public.country_stats(code);
CREATE INDEX IF NOT EXISTS idx_country_stats_reads ON public.country_stats(reads DESC);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('articles', 'reader_events', 'country_stats', 'profiles', 'user_roles')
ORDER BY table_name;

-- Check row counts
SELECT 
  'articles' as table_name, COUNT(*) as row_count FROM public.articles
UNION ALL
SELECT 'reader_events', COUNT(*) FROM public.reader_events
UNION ALL
SELECT 'country_stats', COUNT(*) FROM public.country_stats
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM public.user_roles;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All tables are ready for data import!';
  RAISE NOTICE '📊 Tables created: articles, reader_events, country_stats, profiles, user_roles';
  RAISE NOTICE '🔓 RLS policies set to allow imports';
  RAISE NOTICE '📥 You can now import your data!';
END $$;
