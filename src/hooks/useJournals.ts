import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Journal {
  id: string;
  title: string;
  issn: string | null;
  description: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  publisher: string | null;
  article_count?: number;
  total_downloads?: number;
}

// Map journal names to their metadata - EXACT names from database
const JOURNAL_METADATA: Record<string, Partial<Journal>> = {
  "Tanzania Journal of Science": {
    issn: "0856-1761",
    description: "Publishes original research articles in all fields of science including biology, chemistry, physics, mathematics, and earth sciences.",
    cover_image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/tjs",
    publisher: "University of Dar es Salaam"
  },
  "Tanzania Journal of Engineering and Technology": {
    issn: "0856-0196",
    description: "Features research in engineering disciplines including civil, mechanical, electrical, and computer engineering.",
    cover_image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/tjet",
    publisher: "University of Dar es Salaam"
  },
  "Tanzania Journal of Health Research": {
    issn: "1821-9241",
    description: "Publishes health and medical research relevant to Tanzania and the East African region.",
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/tjhr",
    publisher: "University of Dar es Salaam"
  },
  "Tanzania Journal of Development Studies": {
    issn: "0856-4728",
    description: "A peer-reviewed journal publishing research on development studies, economics, and social sciences in Tanzania and East Africa.",
    cover_image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/tjds",
    publisher: "University of Dar es Salaam"
  },
  "Tanzania Journal of Population Studies and Development": {
    issn: "0856-4728",
    description: "A peer-reviewed journal publishing research on population studies, demographics, and development issues in Tanzania and East Africa.",
    cover_image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/tjpsd",
    publisher: "University of Dar es Salaam"
  },
  "African Journal of Marine Science": {
    issn: "1814-232X",
    description: "Publishes research on marine and coastal ecosystems, fisheries, and oceanography in African waters.",
    cover_image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/ajms",
    publisher: "University of Dar es Salaam"
  },
  "Journal of Linguistics and Language in Education": {
    issn: "2221-7347",
    description: "Focuses on linguistics, language education, and language policy in East Africa.",
    cover_image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/jlle",
    publisher: "University of Dar es Salaam"
  },
  "UDSM Journal of Arts and Social Sciences": {
    issn: "2672-4235",
    description: "Publishes research in arts, humanities, and social sciences.",
    cover_image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/ujass",
    publisher: "University of Dar es Salaam"
  },
  "Eastern Africa Social Science Research Review": {
    issn: "1027-1775",
    description: "Multidisciplinary journal covering social sciences research in Eastern Africa.",
    cover_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    website_url: "https://journals.udsm.ac.tz/index.php/eassrr",
    publisher: "University of Dar es Salaam"
  }
};

export function useJournals() {
  return useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      // Get unique journals from articles table with stats
      const { data: journalStats, error } = await supabase
        .from("articles")
        .select("journal, downloads")
        .order("journal");

      if (error) throw error;

      // Aggregate by journal
      const journalMap = new Map<string, { count: number; downloads: number }>();
      
      journalStats?.forEach((article) => {
        const existing = journalMap.get(article.journal) || { count: 0, downloads: 0 };
        journalMap.set(article.journal, {
          count: existing.count + 1,
          downloads: existing.downloads + article.downloads
        });
      });

      // Create journal objects with metadata
      const journals: Journal[] = Array.from(journalMap.entries()).map(([title, stats]) => {
        const metadata = JOURNAL_METADATA[title] || {
          issn: null,
          description: `Academic journal published by the University of Dar es Salaam`,
          cover_image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
          website_url: "https://journals.udsm.ac.tz",
          publisher: "University of Dar es Salaam"
        };

        return {
          id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title,
          article_count: stats.count,
          total_downloads: stats.downloads,
          ...metadata
        };
      });

      return journals.sort((a, b) => a.title.localeCompare(b.title));
    },
  });
}
