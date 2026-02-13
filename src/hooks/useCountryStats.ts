import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CountryData {
  name: string;
  code: string;
  reads: number;
  downloads: number;
  topJournal: string;
  topArticle: string;
  lat: number;
  lng: number;
}

export function useCountryStats() {
  return useQuery({
    queryKey: ["country_stats"],
    queryFn: async (): Promise<CountryData[]> => {
      const { data, error } = await supabase
        .from("country_stats")
        .select("*")
        .order("reads", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(row => ({
        name: row.name,
        code: row.code,
        reads: row.reads,
        downloads: row.downloads,
        topJournal: row.top_journal ?? "",
        topArticle: row.top_article ?? "",
        lat: row.lat ?? 0,
        lng: row.lng ?? 0,
      }));
    },
  });
}
