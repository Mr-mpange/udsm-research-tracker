
-- Tighten articles insert/update to admin only
DROP POLICY "Allow insert articles" ON public.articles;
DROP POLICY "Allow update articles" ON public.articles;

CREATE POLICY "Admin can insert articles" ON public.articles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update articles" ON public.articles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten country_stats insert/update to admin only  
DROP POLICY "Allow insert country_stats" ON public.country_stats;
DROP POLICY "Allow update country_stats" ON public.country_stats;

CREATE POLICY "Admin can insert country_stats" ON public.country_stats FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update country_stats" ON public.country_stats FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten reader_events insert to admin/service role
DROP POLICY "Allow insert reader_events" ON public.reader_events;

CREATE POLICY "Admin can insert reader_events" ON public.reader_events FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
