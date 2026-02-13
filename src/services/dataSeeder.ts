// Data Seeder - Populate Supabase with real OAI-PMH data

import { supabase } from "@/integrations/supabase/client";
import { harvestAllRecords, listSets, type OAIRecord } from "./oaiHarvester";

export interface SeedResult {
  success: boolean;
  articlesAdded: number;
  journalsFound: number;
  errors: string[];
}

/**
 * Seed articles from OAI-PMH endpoint into Supabase
 */
export async function seedArticlesFromOAI(
  oaiEndpoint: string,
  options: {
    from?: string;
    until?: string;
    maxRecords?: number;
  } = {}
): Promise<SeedResult> {
  const result: SeedResult = {
    success: false,
    articlesAdded: 0,
    journalsFound: 0,
    errors: [],
  };

  try {
    // Harvest records from OAI-PMH
    console.log("Harvesting records from:", oaiEndpoint);
    const harvestResult = await harvestAllRecords(oaiEndpoint, {
      metadataPrefix: "oai_dc",
      ...options,
    });

    if (harvestResult.error) {
      result.errors.push(harvestResult.error);
      return result;
    }

    console.log(`Harvested ${harvestResult.records.length} records`);

    // Get unique journals
    const journals = new Set(harvestResult.records.map((r) => r.journal));
    result.journalsFound = journals.size;

    // Insert articles into Supabase
    for (const record of harvestResult.records) {
      try {
        const articleData = {
          title: record.title,
          authors: record.authors,
          journal: record.journal,
          doi: record.doi || `oai:${record.identifier}`,
          downloads: 0,
          citations: 0,
          published_date: record.publishedDate,
        };

        const { error } = await supabase
          .from("articles")
          .upsert(articleData, { onConflict: "doi" });

        if (error) {
          result.errors.push(`Failed to insert "${record.title}": ${error.message}`);
        } else {
          result.articlesAdded++;
        }
      } catch (error) {
        result.errors.push(
          `Error processing "${record.title}": ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    result.success = result.articlesAdded > 0;
    console.log(`Successfully added ${result.articlesAdded} articles`);

    return result;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : "Unknown error");
    return result;
  }
}

/**
 * Seed initial country stats
 */
export async function seedInitialCountryStats(): Promise<void> {
  const countries = [
    { name: "Tanzania", code: "TZ", lat: -6.37, lng: 34.89 },
    { name: "Kenya", code: "KE", lat: -0.02, lng: 37.91 },
    { name: "United States", code: "US", lat: 37.09, lng: -95.71 },
    { name: "United Kingdom", code: "GB", lat: 55.38, lng: -3.44 },
    { name: "South Africa", code: "ZA", lat: -30.56, lng: 22.94 },
    { name: "Uganda", code: "UG", lat: 1.37, lng: 32.29 },
    { name: "Nigeria", code: "NG", lat: 9.08, lng: 8.68 },
    { name: "India", code: "IN", lat: 20.59, lng: 78.96 },
    { name: "Germany", code: "DE", lat: 51.17, lng: 10.45 },
    { name: "China", code: "CN", lat: 35.86, lng: 104.2 },
    { name: "Ethiopia", code: "ET", lat: 9.15, lng: 40.49 },
    { name: "Rwanda", code: "RW", lat: -1.94, lng: 29.87 },
    { name: "Canada", code: "CA", lat: 56.13, lng: -106.35 },
    { name: "Sweden", code: "SE", lat: 60.13, lng: 18.64 },
    { name: "Australia", code: "AU", lat: -25.27, lng: 133.78 },
    { name: "Brazil", code: "BR", lat: -14.24, lng: -51.93 },
    { name: "Japan", code: "JP", lat: 36.2, lng: 138.25 },
    { name: "Mozambique", code: "MZ", lat: -18.67, lng: 35.53 },
  ];

  for (const country of countries) {
    await supabase.from("country_stats").upsert(
      {
        name: country.name,
        code: country.code,
        reads: 0,
        downloads: 0,
        lat: country.lat,
        lng: country.lng,
      },
      { onConflict: "code" }
    );
  }
}

/**
 * Fetch citation counts from Crossref for articles with DOIs
 */
export async function enrichArticlesWithCitations(): Promise<{
  updated: number;
  errors: string[];
}> {
  const result = { updated: 0, errors: [] };

  try {
    // Get all articles with DOIs
    const { data: articles, error } = await supabase
      .from("articles")
      .select("id, doi")
      .not("doi", "is", null)
      .like("doi", "10.%");

    if (error) {
      result.errors.push(error.message);
      return result;
    }

    if (!articles || articles.length === 0) {
      return result;
    }

    // Update citations using Crossref edge function
    for (const article of articles) {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("crossref-lookup", {
          body: { doi: article.doi },
        });

        if (fnError) {
          result.errors.push(`Crossref lookup failed for ${article.doi}: ${fnError.message}`);
          continue;
        }

        if (data && typeof data.citations === "number") {
          const { error: updateError } = await supabase
            .from("articles")
            .update({ citations: data.citations })
            .eq("id", article.id);

          if (updateError) {
            result.errors.push(`Failed to update ${article.doi}: ${updateError.message}`);
          } else {
            result.updated++;
          }
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        result.errors.push(
          `Error processing ${article.doi}: ${error instanceof Error ? error.message : "Unknown"}`
        );
      }
    }

    return result;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : "Unknown error");
    return result;
  }
}
