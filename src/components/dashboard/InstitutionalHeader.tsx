import { Globe } from "lucide-react";

export function InstitutionalHeader() {
  return (
    <header className="bg-primary border-b-4 border-accent">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-accent overflow-hidden shrink-0">
            <img src="/favicon.jpeg" alt="UDSM Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-primary-foreground leading-tight truncate">
              UDSM Global Research Impact Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-primary-foreground/70 font-sans-ui flex items-center gap-1 sm:gap-1.5 mt-0.5">
              <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">Tracking UDSM's Academic Footprint Worldwide</span>
            </p>
          </div>
          <div className="hidden lg:block text-right shrink-0">
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
