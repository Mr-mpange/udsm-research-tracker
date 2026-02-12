import { GraduationCap, Globe } from "lucide-react";

export function InstitutionalHeader() {
  return (
    <header className="bg-primary border-b-4 border-accent">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <GraduationCap className="h-8 w-8 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground leading-tight">
              UDSM Global Research Impact Dashboard
            </h1>
            <p className="text-sm text-primary-foreground/70 font-sans-ui flex items-center gap-1.5 mt-0.5">
              <Globe className="h-3.5 w-3.5" />
              Tracking UDSM's Academic Footprint Worldwide
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs text-primary-foreground/60 font-sans-ui">University of Dar es Salaam</p>
            <a href="https://journals.udsm.ac.tz" target="_blank" rel="noopener noreferrer"
              className="text-xs text-accent hover:underline font-sans-ui">
              journals.udsm.ac.tz
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
