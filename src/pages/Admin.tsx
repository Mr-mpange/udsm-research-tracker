import { useState } from "react";
import { InstitutionalHeader } from "@/components/dashboard/InstitutionalHeader";
import { Navbar } from "@/components/dashboard/Navbar";
import { useSimulation } from "@/hooks/useSimulation";
import { articles, journals } from "@/data/mockData";
import { Settings, Database, RefreshCw, Activity, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const sim = useSimulation(true);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border rounded-lg shadow-md p-8 w-full max-w-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-1">Admin Access</h2>
          <p className="text-xs text-muted-foreground text-center mb-6 font-sans-ui">UDSM Research Dashboard</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm font-sans-ui"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm font-sans-ui"
            />
            <button
              onClick={() => { if (username === "admin" && password === "udsm2026") setAuthenticated(true); }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold font-sans-ui hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
            <p className="text-xs text-muted-foreground text-center font-sans-ui">
              Demo: admin / udsm2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <InstitutionalHeader />
      <Navbar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* System Status */}
        <div className="bg-card border rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> System Status
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 font-sans-ui text-sm">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-muted-foreground text-xs">Simulation</p>
              <p className="font-semibold flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${sim.isRunning ? "bg-success" : "bg-destructive"}`} />
                {sim.isRunning ? "Running" : "Stopped"}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-muted-foreground text-xs">OAI Endpoint</p>
              <p className="font-semibold text-xs">journals.udsm.ac.tz/oai</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-muted-foreground text-xs">Crossref API</p>
              <p className="font-semibold text-xs">api.crossref.org</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={sim.toggle}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold font-sans-ui hover:opacity-90 transition-opacity">
              {sim.isRunning ? "Stop Simulation" : "Start Simulation"}
            </button>
            <button className="px-4 py-2 border rounded-md text-xs font-semibold font-sans-ui hover:bg-muted transition-colors flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Refresh Metadata
            </button>
          </div>
        </div>

        {/* Journals */}
        <div className="bg-card border rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Harvested Journals
          </h2>
          <div className="grid sm:grid-cols-2 gap-2 font-sans-ui">
            {journals.map(j => (
              <div key={j} className="p-3 border rounded-md text-sm flex items-center justify-between">
                <span>{j}</span>
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles Metadata */}
        <div className="bg-card border rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-bold mb-4">Articles Metadata</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans-ui">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-semibold">Title</th>
                  <th className="text-left p-2 font-semibold hidden md:table-cell">Authors</th>
                  <th className="text-left p-2 font-semibold">DOI</th>
                  <th className="text-left p-2 font-semibold hidden sm:table-cell">Published</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-2 max-w-xs truncate">{a.title}</td>
                    <td className="p-2 text-muted-foreground hidden md:table-cell">{a.authors.join(", ")}</td>
                    <td className="p-2 text-primary">{a.doi}</td>
                    <td className="p-2 text-muted-foreground hidden sm:table-cell">{a.publishedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
