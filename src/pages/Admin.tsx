import { useState, type ChangeEvent } from "react";
import { InstitutionalHeader } from "@/components/dashboard/InstitutionalHeader";
import { Navbar } from "@/components/dashboard/Navbar";
import { useSimulation } from "@/hooks/useSimulation";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "@/hooks/useArticles";
import { RefreshCw, Activity, Shield, LogOut, Download, Search } from "lucide-react";
import { identifyRepository } from "@/services/oaiHarvester";
import { seedArticlesFromOAI, enrichArticlesWithCitations, seedInitialCountryStats } from "@/services/dataSeeder";
import { toast } from "sonner";

const Admin = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const sim = useSimulation(true);
  const { data: articles, refetch: refetchArticles } = useArticles();
  
  // OAI Harvesting state
  const [oaiEndpoint, setOaiEndpoint] = useState("https://journals.udsm.ac.tz/oai");
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestStatus, setHarvestStatus] = useState("");
  const [repositoryInfo, setRepositoryInfo] = useState<any>(null);

  // Handler functions
  const handleIdentifyRepository = async () => {
    setHarvestStatus("Identifying repository...");
    const info = await identifyRepository(oaiEndpoint);
    if (info.error) {
      toast.error(`Failed to identify repository: ${info.error}`);
      setHarvestStatus("");
    } else {
      setRepositoryInfo(info);
      toast.success(`Connected to ${info.repositoryName}`);
      setHarvestStatus(`Repository: ${info.repositoryName}`);
    }
  };

  const handleHarvestArticles = async () => {
    setIsHarvesting(true);
    setHarvestStatus("Harvesting articles from OAI-PMH endpoint...");
    
    try {
      const result = await seedArticlesFromOAI(oaiEndpoint, { maxRecords: 500 });
      
      if (result.success) {
        toast.success(`Successfully harvested ${result.articlesAdded} articles from ${result.journalsFound} journals`);
        setHarvestStatus(`Harvested ${result.articlesAdded} articles`);
        await refetchArticles();
      } else {
        toast.error(`Harvest failed: ${result.errors.join(", ")}`);
        setHarvestStatus("Harvest failed");
      }
      
      if (result.errors.length > 0) {
        console.error("Harvest errors:", result.errors);
      }
    } catch (error) {
      toast.error(`Harvest error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setHarvestStatus("Error during harvest");
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleEnrichCitations = async () => {
    setHarvestStatus("Enriching articles with citation data from Crossref...");
    toast.info("Fetching citation counts from Crossref API...");
    
    try {
      const result = await enrichArticlesWithCitations();
      toast.success(`Updated ${result.updated} articles with citation counts`);
      setHarvestStatus(`Updated ${result.updated} articles`);
      
      if (result.errors.length > 0) {
        console.error("Citation enrichment errors:", result.errors);
      }
      
      await refetchArticles();
    } catch (error) {
      toast.error(`Citation enrichment failed: ${error instanceof Error ? error.message : "Unknown"}`);
      setHarvestStatus("Citation enrichment failed");
    }
  };

  const handleInitializeCountries = async () => {
    setHarvestStatus("Initializing country statistics...");
    try {
      await seedInitialCountryStats();
      toast.success("Country statistics initialized");
      setHarvestStatus("Countries initialized");
    } catch (error) {
      toast.error("Failed to initialize countries");
      setHarvestStatus("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans-ui text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border rounded-lg shadow-md p-8 w-full max-w-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-1">{isSignUp ? "Create Account" : "Admin Access"}</h2>
          <p className="text-xs text-muted-foreground text-center mb-6 font-sans-ui">UDSM Research Dashboard</p>
          {signUpSuccess && (
            <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-md text-xs text-success font-sans-ui">
              Check your email to confirm your account, then sign in.
            </div>
          )}
          {authError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive font-sans-ui">
              {authError}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm font-sans-ui"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm font-sans-ui"
            />
            <button
              onClick={async () => {
                setAuthError("");
                if (isSignUp) {
                  const { error } = await signUp(email, password);
                  if (error) setAuthError(error.message);
                  else setSignUpSuccess(true);
                } else {
                  const { error } = await signIn(email, password);
                  if (error) setAuthError(error.message);
                }
              }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold font-sans-ui hover:opacity-90 transition-opacity"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); setSignUpSuccess(false); }}
              className="w-full text-xs text-muted-foreground font-sans-ui hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button onClick={signOut} className="flex items-center gap-1 px-3 py-1.5 border rounded-md text-xs font-sans-ui hover:bg-muted transition-colors">
            <LogOut className="h-3 w-3" /> Sign Out
          </button>
        </div>

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
              <p className="text-muted-foreground text-xs">Articles in DB</p>
              <p className="font-semibold text-lg">{articles?.length || 0}</p>
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
          </div>
        </div>

        {/* OAI-PMH Harvester */}
        <div className="bg-card border rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" /> OAI-PMH Data Harvester
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                OAI-PMH Endpoint URL
              </label>
              <input
                type="text"
                value={oaiEndpoint}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOaiEndpoint(e.target.value)}
                placeholder="https://journals.udsm.ac.tz/oai"
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm font-sans-ui"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: https://journals.udsm.ac.tz/oai or try /index.php/oai
              </p>
            </div>

            {repositoryInfo && (
              <div className="p-3 bg-success/10 border border-success/30 rounded-md text-xs">
                <p className="font-semibold text-success mb-1">✓ Connected to Repository</p>
                <p><strong>Name:</strong> {repositoryInfo.repositoryName}</p>
                <p><strong>Base URL:</strong> {repositoryInfo.baseURL}</p>
                <p><strong>Protocol:</strong> {repositoryInfo.protocolVersion}</p>
                <p><strong>Earliest Record:</strong> {repositoryInfo.earliestDatestamp}</p>
              </div>
            )}

            {harvestStatus && (
              <div className="p-3 bg-info/10 border border-info/30 rounded-md text-xs text-info">
                {harvestStatus}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleIdentifyRepository}
                disabled={isHarvesting}
                className="px-4 py-2 border rounded-md text-xs font-semibold font-sans-ui hover:bg-muted transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Search className="h-3 w-3" /> Test Connection
              </button>
              
              <button
                onClick={handleHarvestArticles}
                disabled={isHarvesting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold font-sans-ui hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
              >
                <Download className="h-3 w-3" /> 
                {isHarvesting ? "Harvesting..." : "Harvest Articles"}
              </button>

              <button
                onClick={handleEnrichCitations}
                disabled={isHarvesting}
                className="px-4 py-2 border rounded-md text-xs font-semibold font-sans-ui hover:bg-muted transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className="h-3 w-3" /> Enrich Citations
              </button>

              <button
                onClick={handleInitializeCountries}
                disabled={isHarvesting}
                className="px-4 py-2 border rounded-md text-xs font-semibold font-sans-ui hover:bg-muted transition-colors disabled:opacity-50"
              >
                Initialize Countries
              </button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click "Test Connection" to verify the OAI-PMH endpoint</li>
                <li>Click "Harvest Articles" to fetch metadata from UDSM journals</li>
                <li>Click "Enrich Citations" to fetch citation counts from Crossref</li>
                <li>Click "Initialize Countries" to set up geographic tracking</li>
              </ol>
            </div>
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
                  <th className="text-left p-2 font-semibold">Journal Link</th>
                  <th className="text-left p-2 font-semibold hidden sm:table-cell">Published</th>
                </tr>
              </thead>
              <tbody>
                {(articles ?? []).map((a: any) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-2 max-w-xs truncate">{a.title}</td>
                    <td className="p-2 text-muted-foreground hidden md:table-cell">{a.authors.join(", ")}</td>
                    <td className="p-2">
                      <a 
                        href="https://journals.udsm.ac.tz/index.php/tjpsd" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs">
                        View Journal →
                      </a>
                    </td>
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
