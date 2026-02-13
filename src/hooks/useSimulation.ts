import { useEffect, useRef, useState, useCallback } from "react";
import { useCountryStats, type CountryData } from "./useCountryStats";
import { useArticles, type Article } from "./useArticles";

export interface ReaderEvent {
  country: string;
  countryCode: string;
  articleId: string;
  timestamp: number;
  lat: number;
  lng: number;
}

export interface SimulationState {
  totalDownloads: number;
  totalCitations: number;
  activeReaders: number;
  countriesReached: number;
  recentEvents: ReaderEvent[];
  countryStats: Map<string, CountryData>;
  isRunning: boolean;
  articles: Article[];
}

export function useSimulation(enabled: boolean = true) {
  const { data: dbCountries } = useCountryStats();
  const { data: dbArticles } = useArticles();

  const [state, setState] = useState<SimulationState>(() => ({
    totalDownloads: 0,
    totalCitations: 0,
    activeReaders: 42,
    countriesReached: 0,
    recentEvents: [],
    countryStats: new Map(),
    isRunning: enabled,
    articles: [],
  }));

  // Seed state from DB once loaded
  useEffect(() => {
    if (!dbCountries || !dbArticles) return;
    const countryStats = new Map<string, CountryData>();
    dbCountries.forEach(c => countryStats.set(c.code, { ...c }));
    const totalDownloads = dbArticles.reduce((s, a) => s + a.downloads, 0);
    const totalCitations = dbArticles.reduce((s, a) => s + a.citations, 0);
    setState(prev => ({
      ...prev,
      totalDownloads,
      totalCitations,
      countriesReached: dbCountries.length,
      countryStats,
      articles: dbArticles,
    }));
  }, [dbCountries, dbArticles]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  useEffect(() => {
    if (!state.isRunning || state.articles.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const countries = Array.from(state.countryStats.values());
    if (countries.length === 0) return;

    intervalRef.current = setInterval(() => {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const article = state.articles[Math.floor(Math.random() * state.articles.length)];
      const event: ReaderEvent = {
        country: country.name,
        countryCode: country.code,
        articleId: article.id,
        timestamp: Date.now(),
        lat: country.lat + (Math.random() - 0.5) * 5,
        lng: country.lng + (Math.random() - 0.5) * 5,
      };

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
          recentEvents,
          countryStats: newStats,
        };
      });
    }, 2000 + Math.random() * 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.articles.length, state.countryStats.size]);

  return { ...state, toggle };
}
