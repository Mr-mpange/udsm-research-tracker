import { InstitutionalHeader } from "@/components/dashboard/InstitutionalHeader";
import { Navbar } from "@/components/dashboard/Navbar";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useSimulation } from "@/hooks/useSimulation";
import { useArticles } from "@/hooks/useArticles";
import { useCountryStats } from "@/hooks/useCountryStats";
import { useEffect } from "react";

const Dashboard = () => {
  const sim = useSimulation(true);
  const { data: articles, isLoading: articlesLoading } = useArticles();
  const { data: countries, isLoading: countriesLoading } = useCountryStats();

  // Check database status on mount (only in development)
  useEffect(() => {
    // Database check removed for production
  }, []);

  const isLoading = articlesLoading || countriesLoading;

  return (
    <div className="min-h-screen bg-background">
      <InstitutionalHeader />
      <Navbar />

      {/* Live indicator bar */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-xs text-muted-foreground font-sans-ui">
            {isLoading ? "Loading research data..." : "Live tracking active · Real-time research impact monitoring"}
          </span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading UDSM research data...</p>
            </div>
          </div>
        ) : (
          <>
            <LiveMetrics
              totalDownloads={sim.totalDownloads}
              totalCitations={sim.totalCitations}
              activeReaders={sim.activeReaders}
              countriesReached={sim.countriesReached}
            />

            <WorldMap countryStats={sim.countryStats} recentEvents={sim.recentEvents} />

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendChart />
              </div>
              <div className="lg:col-span-1">
                <ActivityFeed recentEvents={sim.recentEvents} articles={sim.articles} />
              </div>
            </div>

            <ArticlesTable articles={sim.articles} />
          </>
        )}

        <footer className="text-center py-6 border-t">
          <p className="text-xs text-muted-foreground font-sans-ui">
            © 2026 University of Dar es Salaam · ICT Innovation Challenge · Prototype Demo
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
