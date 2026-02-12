import { useEffect, useRef, useState, useCallback } from "react";
import { generateReaderEvent, type ReaderEvent, type CountryData, countriesData } from "@/data/mockData";

export interface SimulationState {
  totalDownloads: number;
  totalCitations: number;
  activeReaders: number;
  countriesReached: number;
  recentEvents: ReaderEvent[];
  countryStats: Map<string, CountryData>;
  isRunning: boolean;
}

export function useSimulation(enabled: boolean = true) {
  const [state, setState] = useState<SimulationState>(() => {
    const countryStats = new Map<string, CountryData>();
    countriesData.forEach(c => countryStats.set(c.code, { ...c }));
    return {
      totalDownloads: 19426,
      totalCitations: 1247,
      activeReaders: 42,
      countriesReached: countriesData.length,
      recentEvents: [],
      countryStats,
      isRunning: enabled,
    };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const event = generateReaderEvent();
      setState(prev => {
        const newStats = new Map(prev.countryStats);
        const existing = newStats.get(event.countryCode);
        if (existing) {
          newStats.set(event.countryCode, {
            ...existing,
            reads: existing.reads + 1,
            downloads: existing.downloads + (Math.random() > 0.5 ? 1 : 0),
          });
        }
        const recentEvents = [event, ...prev.recentEvents].slice(0, 50);
        return {
          ...prev,
          totalDownloads: prev.totalDownloads + (Math.random() > 0.4 ? 1 : 0),
          totalCitations: prev.totalCitations + (Math.random() > 0.95 ? 1 : 0),
          activeReaders: Math.max(15, Math.min(120, prev.activeReaders + Math.floor(Math.random() * 7) - 3)),
          countriesReached: prev.countriesReached,
          recentEvents,
          countryStats: newStats,
        };
      });
    }, 2000 + Math.random() * 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning]);

  return { ...state, toggle };
}
