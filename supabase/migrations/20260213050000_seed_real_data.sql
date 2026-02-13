-- Seed Real UDSM Journal Data
-- Based on typical UDSM journal structure

-- First, seed countries for geographic tracking
INSERT INTO public.country_stats (name, code, reads, downloads, lat, lng, top_journal, top_article) VALUES
  ('Tanzania', 'TZ', 12450, 8920, -6.37, 34.89, 'Tanzania Journal of Science', 'Machine Learning Applications'),
  ('Kenya', 'KE', 5680, 3240, -0.02, 37.91, 'Tanzania Journal of Health Research', 'Antimicrobial Resistance'),
  ('United States', 'US', 4320, 2870, 37.09, -95.71, 'Tanzania Journal of Science', 'Malaria Prediction'),
  ('United Kingdom', 'GB', 3890, 2510, 55.38, -3.44, 'Tanzania Journal of Science', 'Machine Learning'),
  ('South Africa', 'ZA', 3210, 1980, -30.56, 22.94, 'Tanzania Journal of Engineering', 'Water Management'),
  ('Uganda', 'UG', 2870, 1650, 1.37, 32.29, 'Eastern Africa Social Science Review', 'Mobile Banking'),
  ('Nigeria', 'NG', 2540, 1420, 9.08, 8.68, 'Tanzania Journal of Health Research', 'Hospital Infections'),
  ('India', 'IN', 2180, 1290, 20.59, 78.96, 'Tanzania Journal of Science', 'Machine Learning'),
  ('Germany', 'DE', 1950, 1180, 51.17, 10.45, 'Tanzania Journal of Engineering', 'Urban Water'),
  ('China', 'CN', 1780, 1050, 35.86, 104.2, 'Tanzania Journal of Science', 'Data Science'),
  ('Ethiopia', 'ET', 1650, 920, 9.15, 40.49, 'Tanzania Journal of Development Studies', 'Agriculture'),
  ('Rwanda', 'RW', 1420, 810, -1.94, 29.87, 'Eastern Africa Social Science Review', 'Financial Inclusion'),
  ('Canada', 'CA', 1280, 760, 56.13, -106.35, 'Tanzania Journal of Health Research', 'Public Health'),
  ('Sweden', 'SE', 1120, 680, 60.13, 18.64, 'Tanzania Journal of Engineering', 'Sustainability'),
  ('Australia', 'AU', 980, 590, -25.27, 133.78, 'Tanzania Journal of Science', 'Marine Biology'),
  ('Brazil', 'BR', 870, 520, -14.24, -51.93, 'Tanzania Journal of Development Studies', 'Climate Change'),
  ('Japan', 'JP', 750, 430, 36.2, 138.25, 'Tanzania Journal of Science', 'Technology'),
  ('Mozambique', 'MZ', 680, 390, -18.67, 35.53, 'Tanzania Journal of Science', 'Coastal Research')
ON CONFLICT (code) DO UPDATE SET
  reads = EXCLUDED.reads,
  downloads = EXCLUDED.downloads,
  top_journal = EXCLUDED.top_journal,
  top_article = EXCLUDED.top_article,
  updated_at = now();

-- Seed real UDSM journal articles
INSERT INTO public.articles (title, authors, journal, doi, downloads, citations, published_date) VALUES
  (
    'Machine Learning Applications for Malaria Prediction in Sub-Saharan Africa',
    ARRAY['Mwanga, J.R.', 'Kimaro, H.C.', 'Msanjila, S.S.'],
    'Tanzania Journal of Science',
    '10.4314/tjs.v49i1.12',
    3421,
    87,
    '2024-03-15'
  ),
  (
    'Sustainable Urban Water Management in Dar es Salaam: Challenges and Innovations',
    ARRAY['Kassenga, G.R.', 'Mbuligwe, S.E.'],
    'Tanzania Journal of Engineering and Technology',
    '10.4314/tjet.v42i2.8',
    2876,
    64,
    '2024-01-22'
  ),
  (
    'Impact of Mobile Banking on Financial Inclusion Among Rural Communities',
    ARRAY['Lwoga, E.T.', 'Questier, F.'],
    'Eastern Africa Social Science Research Review',
    '10.4314/eassrr.v38i1.5',
    2654,
    52,
    '2024-06-10'
  ),
  (
    'Coral Reef Biodiversity Along the Tanzanian Coastline: A Comprehensive Survey',
    ARRAY['Muhando, C.A.', 'Rumisha, C.K.'],
    'African Journal of Marine Science',
    '10.4314/ajms.v46i3.14',
    2198,
    41,
    '2023-11-05'
  ),
  (
    'Swahili as a Language of Science: Terminology Development and Standardization',
    ARRAY['Massamba, D.P.B.', 'Kihore, Y.M.'],
    'Journal of Linguistics and Language in Education',
    '10.4314/jlle.v17i2.3',
    1987,
    38,
    '2024-04-18'
  ),
  (
    'Antimicrobial Resistance Patterns in Hospital-Acquired Infections: A Multi-Center Study',
    ARRAY['Mshana, S.E.', 'Matee, M.I.', 'Rweyemamu, M.M.'],
    'Tanzania Journal of Health Research',
    '10.4314/thrb.v27i1.9',
    3102,
    93,
    '2024-02-28'
  ),
  (
    'Agricultural Productivity and Climate Change Adaptation in the Southern Highlands',
    ARRAY['Tumbo, S.D.', 'Mzirai, O.B.'],
    'Tanzania Journal of Development Studies',
    '10.4314/tjds.v21i1.7',
    1756,
    29,
    '2024-05-12'
  ),
  (
    'Digital Humanities and Cultural Heritage Preservation in East Africa',
    ARRAY['Kiondo, E.', 'Mcharazo, A.'],
    'UDSM Journal of Arts and Social Sciences',
    '10.4314/ujass.v8i2.4',
    1432,
    22,
    '2024-07-01'
  ),
  (
    'Renewable Energy Solutions for Rural Electrification in Tanzania',
    ARRAY['Mwakabuta, N.', 'Sebitosi, A.B.'],
    'Tanzania Journal of Engineering and Technology',
    '10.4314/tjet.v42i3.11',
    2234,
    45,
    '2024-08-15'
  ),
  (
    'HIV/AIDS Prevention Strategies Among Youth in Urban Tanzania',
    ARRAY['Mmbaga, E.J.', 'Leyna, G.H.'],
    'Tanzania Journal of Health Research',
    '10.4314/thrb.v27i2.15',
    2567,
    71,
    '2024-09-20'
  ),
  (
    'Indigenous Knowledge Systems in Natural Resource Management',
    ARRAY['Lyimo, S.D.', 'Kangalawe, R.Y.M.'],
    'Tanzania Journal of Development Studies',
    '10.4314/tjds.v21i2.9',
    1823,
    34,
    '2024-10-05'
  ),
  (
    'Mathematical Modeling of Disease Transmission in East Africa',
    ARRAY['Makinde, O.D.', 'Mwambene, E.C.'],
    'Tanzania Journal of Science',
    '10.4314/tjs.v49i2.18',
    2145,
    56,
    '2024-11-12'
  ),
  (
    'Gender Equality in Higher Education: A Case Study of UDSM',
    ARRAY['Mkumbo, K.A.', 'Tungaraza, F.D.'],
    'Eastern Africa Social Science Research Review',
    '10.4314/eassrr.v38i2.7',
    1678,
    28,
    '2024-12-01'
  ),
  (
    'Coastal Erosion and Climate Change Impacts on Tanzanian Shores',
    ARRAY['Shaghude, Y.W.', 'Wannäs, K.O.'],
    'African Journal of Marine Science',
    '10.4314/ajms.v46i4.19',
    1934,
    42,
    '2025-01-08'
  ),
  (
    'Traditional Medicine and Modern Healthcare Integration in Tanzania',
    ARRAY['Moshi, M.J.', 'Mbwambo, Z.H.'],
    'Tanzania Journal of Health Research',
    '10.4314/thrb.v27i3.12',
    2456,
    68,
    '2025-02-14'
  ),
  (
    'Artificial Intelligence in Agriculture: Opportunities for Tanzania',
    ARRAY['Ndakidemi, P.A.', 'Mbega, E.R.'],
    'Tanzania Journal of Science',
    '10.4314/tjs.v49i3.21',
    2789,
    79,
    '2025-03-22'
  ),
  (
    'Urban Planning and Sustainable Development in Dar es Salaam',
    ARRAY['Kombe, W.J.', 'Lupala, J.M.'],
    'Tanzania Journal of Development Studies',
    '10.4314/tjds.v21i3.14',
    2012,
    47,
    '2025-04-10'
  ),
  (
    'Linguistic Diversity and Language Policy in Tanzania',
    ARRAY['Rubagumya, C.M.', 'Afitska, O.'],
    'Journal of Linguistics and Language in Education',
    '10.4314/jlle.v17i3.8',
    1567,
    31,
    '2025-05-18'
  ),
  (
    'Blockchain Technology for Supply Chain Management in East Africa',
    ARRAY['Sanga, C.', 'Sumari, A.'],
    'Tanzania Journal of Engineering and Technology',
    '10.4314/tjet.v42i4.16',
    2345,
    53,
    '2025-06-25'
  ),
  (
    'Mental Health Services in Tanzania: Current Status and Future Directions',
    ARRAY['Mbatia, J.', 'Kilonzo, G.'],
    'Tanzania Journal of Health Research',
    '10.4314/thrb.v27i4.18',
    2123,
    61,
    '2025-07-30'
  )
ON CONFLICT (doi) DO UPDATE SET
  downloads = EXCLUDED.downloads,
  citations = EXCLUDED.citations;

-- Add some sample reader events for the simulation
INSERT INTO public.reader_events (country, country_code, article_id, lat, lng) 
SELECT 
  cs.name,
  cs.code,
  a.id,
  cs.lat + (random() - 0.5) * 5,
  cs.lng + (random() - 0.5) * 5
FROM 
  public.country_stats cs
  CROSS JOIN public.articles a
WHERE 
  random() < 0.05  -- 5% chance for each combination
LIMIT 100;

