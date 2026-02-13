// Utility to check database status
import { supabase } from "@/integrations/supabase/client";

export async function checkDatabaseStatus() {
  console.log("🔍 Checking database status...\n");

  // Check articles
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("*", { count: "exact" });

  if (articlesError) {
    console.error("❌ Error fetching articles:", articlesError.message);
  } else {
    console.log(`📚 Articles in database: ${articles?.length || 0}`);
    if (articles && articles.length > 0) {
      console.log("   Sample article:", articles[0].title);
    }
  }

  // Check country stats
  const { data: countries, error: countriesError } = await supabase
    .from("country_stats")
    .select("*", { count: "exact" });

  if (countriesError) {
    console.error("❌ Error fetching countries:", countriesError.message);
  } else {
    console.log(`🌍 Countries in database: ${countries?.length || 0}`);
    if (countries && countries.length > 0) {
      console.log("   Sample country:", countries[0].name);
    }
  }

  // Check reader events
  const { data: events, error: eventsError } = await supabase
    .from("reader_events")
    .select("*", { count: "exact" });

  if (eventsError) {
    console.error("❌ Error fetching events:", eventsError.message);
  } else {
    console.log(`📊 Reader events in database: ${events?.length || 0}`);
  }

  console.log("\n" + "=".repeat(50));
  
  if ((articles?.length || 0) === 0) {
    console.log("⚠️  DATABASE IS EMPTY!");
    console.log("\nTo populate with real data:");
    console.log("1. Go to /admin");
    console.log("2. Sign in");
    console.log("3. Click 'Initialize Countries' first");
    console.log("4. Click 'Test Connection' to verify OAI-PMH endpoint");
    console.log("5. Click 'Harvest Articles' to import from UDSM journals");
    console.log("6. Click 'Enrich Citations' to add citation counts");
  } else {
    console.log("✅ Database has data!");
  }
  
  console.log("=".repeat(50) + "\n");

  return {
    articles: articles?.length || 0,
    countries: countries?.length || 0,
    events: events?.length || 0,
  };
}
