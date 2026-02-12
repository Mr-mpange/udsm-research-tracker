import { useEffect, useState, useRef } from "react";
import { Download, BookOpen, Users, Globe2 } from "lucide-react";

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
}

function AnimatedCounter({ value, label, icon }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef(0);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = performance.now();
    const duration = 800;

    const step = (now: number) => {
      const progress = Math.min((now - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(fromRef.current + (value - fromRef.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value]);

  return (
    <div className="bg-card rounded-lg border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-foreground font-sans-ui tabular-nums">
          {display.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground font-sans-ui uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

interface LiveMetricsProps {
  totalDownloads: number;
  totalCitations: number;
  activeReaders: number;
  countriesReached: number;
}

export function LiveMetrics({ totalDownloads, totalCitations, activeReaders, countriesReached }: LiveMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatedCounter value={totalDownloads} label="Total Downloads" icon={<Download className="h-6 w-6" />} />
      <AnimatedCounter value={totalCitations} label="Total Citations" icon={<BookOpen className="h-6 w-6" />} />
      <AnimatedCounter value={activeReaders} label="Active Readers" icon={<Users className="h-6 w-6" />} />
      <AnimatedCounter value={countriesReached} label="Countries Reached" icon={<Globe2 className="h-6 w-6" />} />
    </div>
  );
}
