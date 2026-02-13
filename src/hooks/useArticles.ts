import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  doi: string;
  downloads: number;
  citations: number;
  publishedDate: string | null;
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("downloads", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(row => ({
        id: row.id,
        title: row.title,
        authors: row.authors,
        journal: row.journal,
        doi: row.doi,
        downloads: row.downloads,
        citations: row.citations,
        publishedDate: row.published_date,
      }));
    },
  });
}
