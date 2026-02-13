-- Create OJS (Open Journal Systems) tables for data import
-- This migration creates tables matching the EXACT OJS database structure from tjpsd32

-- ============================================================================
-- 1. CREATE AUTHORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ojs_authors (
  author_id BIGSERIAL PRIMARY KEY,
  email VARCHAR(90) NOT NULL,
  include_in_browse SMALLINT NOT NULL DEFAULT 1,
  publication_id BIGINT NOT NULL,
  seq DOUBLE PRECISION NOT NULL DEFAULT 0,
  user_group_id BIGINT
);

-- ============================================================================
-- 2. CREATE AUTHOR_SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ojs_author_settings (
  author_id BIGINT NOT NULL,
  locale VARCHAR(14) NOT NULL DEFAULT '',
  setting_name VARCHAR(255) NOT NULL,
  setting_value TEXT,
  UNIQUE (author_id, locale, setting_name)
);

-- ============================================================================
-- 3. CREATE PUBLICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ojs_publications (
  publication_id BIGSERIAL PRIMARY KEY,
  access_status BIGINT DEFAULT 0,
  date_published DATE,
  last_modified TIMESTAMP,
  primary_contact_id BIGINT,
  section_id BIGINT,
  seq DOUBLE PRECISION NOT NULL DEFAULT 0,
  submission_id BIGINT NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  url_path VARCHAR(64),
  version BIGINT
);

-- ============================================================================
-- 4. CREATE PUBLICATION_SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ojs_publication_settings (
  publication_id BIGINT NOT NULL,
  locale VARCHAR(14) NOT NULL DEFAULT '',
  setting_name VARCHAR(255) NOT NULL,
  setting_value TEXT,
  UNIQUE (publication_id, locale, setting_name)
);

-- ============================================================================
-- 5. CREATE METRICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ojs_metrics (
  load_id VARCHAR(255) NOT NULL,
  context_id BIGINT NOT NULL,
  pkp_section_id BIGINT,
  assoc_object_type BIGINT,
  assoc_object_id BIGINT,
  submission_id BIGINT,
  representation_id BIGINT,
  assoc_type BIGINT NOT NULL,
  assoc_id BIGINT NOT NULL,
  day VARCHAR(8),
  month VARCHAR(6),
  file_type SMALLINT,
  country_id VARCHAR(2),
  region VARCHAR(2),
  city VARCHAR(255),
  metric_type VARCHAR(255) NOT NULL,
  metric INTEGER NOT NULL
);

-- ============================================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.ojs_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ojs_author_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ojs_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ojs_publication_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ojs_metrics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. CREATE PERMISSIVE POLICIES FOR IMPORT
-- ============================================================================

-- Authors
CREATE POLICY "Public read ojs_authors" ON public.ojs_authors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ojs_authors" ON public.ojs_authors FOR INSERT WITH CHECK (true);

-- Author settings
CREATE POLICY "Public read ojs_author_settings" ON public.ojs_author_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ojs_author_settings" ON public.ojs_author_settings FOR INSERT WITH CHECK (true);

-- Publications
CREATE POLICY "Public read ojs_publications" ON public.ojs_publications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ojs_publications" ON public.ojs_publications FOR INSERT WITH CHECK (true);

-- Publication settings
CREATE POLICY "Public read ojs_publication_settings" ON public.ojs_publication_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ojs_publication_settings" ON public.ojs_publication_settings FOR INSERT WITH CHECK (true);

-- Metrics
CREATE POLICY "Public read ojs_metrics" ON public.ojs_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ojs_metrics" ON public.ojs_metrics FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ojs_authors_publication_id ON public.ojs_authors(publication_id);
CREATE INDEX IF NOT EXISTS idx_ojs_author_settings_author_id ON public.ojs_author_settings(author_id);
CREATE INDEX IF NOT EXISTS idx_ojs_publications_submission_id ON public.ojs_publications(submission_id);
CREATE INDEX IF NOT EXISTS idx_ojs_publication_settings_publication_id ON public.ojs_publication_settings(publication_id);
CREATE INDEX IF NOT EXISTS idx_ojs_metrics_submission_id ON public.ojs_metrics(submission_id);
CREATE INDEX IF NOT EXISTS idx_ojs_metrics_country_id ON public.ojs_metrics(country_id);
CREATE INDEX IF NOT EXISTS idx_ojs_metrics_metric_type ON public.ojs_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_ojs_metrics_load_id ON public.ojs_metrics(load_id);

-- ============================================================================
-- 9. CREATE DATA TRANSFORMATION FUNCTION
-- ============================================================================

-- Function to transform OJS data into dashboard format
CREATE OR REPLACE FUNCTION public.transform_ojs_to_dashboard()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_article_id UUID;
  v_publication RECORD;
  v_title TEXT;
  v_abstract TEXT;
  v_authors TEXT[];
  v_total_downloads INTEGER;
  v_country_code TEXT;
  v_country_downloads INTEGER;
BEGIN
  RAISE NOTICE 'Starting OJS to Dashboard transformation...';
  
  -- Transform publications to articles
  FOR v_publication IN 
    SELECT 
      p.publication_id,
      p.submission_id,
      p.date_published,
      p.status
    FROM public.ojs_publications p
    WHERE p.status = 3 -- Published articles only
      AND p.date_published IS NOT NULL
  LOOP
    -- Get title from publication_settings
    SELECT setting_value INTO v_title
    FROM public.ojs_publication_settings
    WHERE publication_id = v_publication.publication_id
      AND setting_name = 'title'
      AND locale = 'en_US'
    LIMIT 1;
    
    -- Get abstract from publication_settings
    SELECT setting_value INTO v_abstract
    FROM public.ojs_publication_settings
    WHERE publication_id = v_publication.publication_id
      AND setting_name = 'abstract'
      AND locale = 'en_US'
    LIMIT 1;
    
    -- Get authors from author_settings
    SELECT ARRAY_AGG(DISTINCT 
      COALESCE(
        (SELECT setting_value FROM public.ojs_author_settings 
         WHERE author_id = a.author_id AND setting_name = 'preferredPublicName' AND locale = 'en_US'),
        (SELECT setting_value FROM public.ojs_author_settings 
         WHERE author_id = a.author_id AND setting_name = 'givenName' AND locale = 'en_US') || ' ' ||
        (SELECT setting_value FROM public.ojs_author_settings 
         WHERE author_id = a.author_id AND setting_name = 'familyName' AND locale = 'en_US')
      )
    ) INTO v_authors
    FROM public.ojs_authors a
    WHERE a.publication_id = v_publication.publication_id
      AND a.include_in_browse = 1;
    
    -- Skip if no title
    IF v_title IS NULL OR v_title = '' THEN
      CONTINUE;
    END IF;
    
    -- Calculate total downloads for this submission
    SELECT COALESCE(SUM(metric), 0) INTO v_total_downloads
    FROM public.ojs_metrics
    WHERE submission_id = v_publication.submission_id
      AND metric_type = 'ojs::counter'
      AND assoc_type = 1048585; -- Article downloads
    
    -- Insert or update article
    INSERT INTO public.articles (
      title,
      authors,
      journal,
      doi,
      downloads,
      citations,
      published_date
    ) VALUES (
      v_title,
      COALESCE(v_authors, ARRAY['Unknown']),
      'Tanzania Journal of Population Studies and Development',
      'tjpsd-' || v_publication.publication_id,
      v_total_downloads,
      0, -- Citations will be enriched later
      v_publication.date_published
    )
    ON CONFLICT (doi) DO UPDATE SET
      downloads = EXCLUDED.downloads,
      authors = EXCLUDED.authors,
      title = EXCLUDED.title,
      published_date = EXCLUDED.published_date
    RETURNING id INTO v_article_id;
    
    -- Create reader events for each country
    FOR v_country_code, v_country_downloads IN
      SELECT country_id, SUM(metric) as downloads
      FROM public.ojs_metrics
      WHERE submission_id = v_publication.submission_id
        AND country_id IS NOT NULL
        AND country_id != ''
        AND metric_type = 'ojs::counter'
      GROUP BY country_id
    LOOP
      -- Insert reader events (limit to 50 per country to avoid too many rows)
      FOR i IN 1..LEAST(v_country_downloads, 50) LOOP
        INSERT INTO public.reader_events (
          country,
          country_code,
          article_id
        ) VALUES (
          v_country_code,
          v_country_code,
          v_article_id
        );
      END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Transformed publication % (% downloads)', v_publication.publication_id, v_total_downloads;
  END LOOP;
  
  RAISE NOTICE '✅ Transformation complete!';
END;
$$;

-- ============================================================================
-- 10. CREATE COUNTRY STATS AGGREGATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.aggregate_country_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_country RECORD;
BEGIN
  RAISE NOTICE 'Aggregating country statistics...';
  
  FOR v_country IN
    SELECT 
      country_code,
      COUNT(*) as total_reads,
      COUNT(DISTINCT article_id) as unique_articles
    FROM public.reader_events
    WHERE country_code IS NOT NULL
    GROUP BY country_code
  LOOP
    INSERT INTO public.country_stats (
      name,
      code,
      reads,
      downloads
    ) VALUES (
      v_country.country_code,
      v_country.country_code,
      v_country.total_reads,
      v_country.total_reads
    )
    ON CONFLICT (code) DO UPDATE SET
      reads = EXCLUDED.reads,
      downloads = EXCLUDED.downloads,
      updated_at = now();
    
    RAISE NOTICE 'Aggregated stats for %: % reads', v_country.country_code, v_country.total_reads;
  END LOOP;
  
  RAISE NOTICE '✅ Country stats aggregation complete!';
END;
$$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 
  'ojs_authors' as table_name, 
  COUNT(*) as row_count,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ojs_authors') as column_count
FROM public.ojs_authors
UNION ALL
SELECT 'ojs_author_settings', COUNT(*), (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ojs_author_settings') FROM public.ojs_author_settings
UNION ALL
SELECT 'ojs_publications', COUNT(*), (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ojs_publications') FROM public.ojs_publications
UNION ALL
SELECT 'ojs_publication_settings', COUNT(*), (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ojs_publication_settings') FROM public.ojs_publication_settings
UNION ALL
SELECT 'ojs_metrics', COUNT(*), (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ojs_metrics') FROM public.ojs_metrics;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ OJS tables created successfully!';
  RAISE NOTICE '📊 Tables: ojs_authors, ojs_author_settings, ojs_publications, ojs_publication_settings, ojs_metrics';
  RAISE NOTICE '🔄 Transformation functions ready';
  RAISE NOTICE '📥 You can now import your OJS database!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '1. Import your tjpsd32 (1) (1).sql file';
  RAISE NOTICE '2. Run: SELECT public.transform_ojs_to_dashboard();';
  RAISE NOTICE '3. Run: SELECT public.aggregate_country_stats();';
  RAISE NOTICE '4. Check your dashboard!';
END $$;
