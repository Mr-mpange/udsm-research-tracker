-- Create journals table
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issn TEXT,
  description TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  publisher TEXT DEFAULT 'University of Dar es Salaam',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to journals"
  ON journals FOR SELECT
  TO public
  USING (true);

-- Insert sample UDSM journals with cover images
INSERT INTO journals (title, issn, description, cover_image_url, website_url) VALUES
  (
    'Tanzania Journal of Population Studies and Development',
    '0856-4728',
    'A peer-reviewed journal publishing research on population studies, demographics, and development issues in Tanzania and East Africa.',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/tjpsd'
  ),
  (
    'Tanzania Journal of Science',
    '0856-1761',
    'Publishes original research articles in all fields of science including biology, chemistry, physics, mathematics, and earth sciences.',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/tjs'
  ),
  (
    'Tanzania Journal of Engineering and Technology',
    '0856-0196',
    'Features research in engineering disciplines including civil, mechanical, electrical, and computer engineering.',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/tjet'
  ),
  (
    'Huria: Journal of the Open University of Tanzania',
    '0856-6739',
    'Multidisciplinary journal covering education, social sciences, and humanities research.',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/huria'
  ),
  (
    'Tanzania Journal of Health Research',
    '1821-9241',
    'Publishes health and medical research relevant to Tanzania and the East African region.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/tjhr'
  ),
  (
    'Business Management Review',
    '0856-2253',
    'Features research in business management, economics, and entrepreneurship.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop',
    'https://journals.udsm.ac.tz/index.php/bmr'
  );
