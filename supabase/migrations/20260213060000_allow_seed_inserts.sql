-- Temporarily allow inserts for seeding
-- This will be used during initial setup only

-- Allow anyone to insert articles (for seeding)
DROP POLICY IF EXISTS "Admin can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can update articles" ON public.articles;

CREATE POLICY "Allow insert articles for seeding" ON public.articles FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Allow update articles for seeding" ON public.articles FOR UPDATE
  USING (true);

-- Allow anyone to insert country_stats (for seeding)
DROP POLICY IF EXISTS "Admin can insert country_stats" ON public.country_stats;
DROP POLICY IF EXISTS "Admin can update country_stats" ON public.country_stats;

CREATE POLICY "Allow insert country_stats for seeding" ON public.country_stats FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Allow update country_stats for seeding" ON public.country_stats FOR UPDATE
  USING (true);

-- Allow anyone to insert reader_events (for seeding)
DROP POLICY IF EXISTS "Admin can insert reader_events" ON public.reader_events;

CREATE POLICY "Allow insert reader_events for seeding" ON public.reader_events FOR INSERT
  WITH CHECK (true);
