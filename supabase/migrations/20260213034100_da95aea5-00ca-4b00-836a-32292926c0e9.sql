
-- Articles table for persistent storage
CREATE TABLE public.articles (
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

-- Reader events for analytics
CREATE TABLE public.reader_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Country stats aggregate
CREATE TABLE public.country_stats (
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

-- All tables are public-facing (dashboard is public)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard
CREATE POLICY "Public read access for articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read access for reader_events" ON public.reader_events FOR SELECT USING (true);
CREATE POLICY "Public read access for country_stats" ON public.country_stats FOR SELECT USING (true);

-- Allow inserts from backend/edge functions (anon key for simulation)
CREATE POLICY "Allow insert reader_events" ON public.reader_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update country_stats" ON public.country_stats FOR UPDATE USING (true);
CREATE POLICY "Allow insert country_stats" ON public.country_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update articles" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Allow insert articles" ON public.articles FOR INSERT WITH CHECK (true);

-- Enable realtime for reader events
ALTER PUBLICATION supabase_realtime ADD TABLE public.reader_events;
