import { InstitutionalHeader } from "@/components/dashboard/InstitutionalHeader";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { useSimulation } from "@/hooks/useSimulation";
import { Activity } from "lucide-react";

const Dashboard = () => {
  const sim = useSimulation(true);

  return (
    <div className="min-h-screen bg-background">
      <InstitutionalHeader />

      {/* Live indicator bar */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-2 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-xs text-muted-foreground font-sans-ui">
            Live simulation active · Data updates every 2–5 seconds
          </span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <LiveMetrics
          totalDownloads={sim.totalDownloads}
          totalCitations={sim.totalCitations}
          activeReaders={sim.activeReaders}
          countriesReached={sim.countriesReached}
        />

        <WorldMap countryStats={sim.countryStats} recentEvents={sim.recentEvents} />

        <div className="grid lg:grid-cols-2 gap-6">
          <TrendChart />
          <div className="lg:col-span-1">
            <ArticlesTable />
          </div>
        </div>

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
