import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { CountryData, ReaderEvent } from "@/data/mockData";
import { X } from "lucide-react";
import "leaflet/dist/leaflet.css";

function getColor(reads: number): string {
  if (reads > 8000) return "#FFCC00";
  if (reads > 4000) return "#E6A800";
  if (reads > 2000) return "#CC7A00";
  if (reads > 1000) return "#994D00";
  return "#3377CC";
}

function getRadius(reads: number): number {
  if (reads > 8000) return 18;
  if (reads > 4000) return 14;
  if (reads > 2000) return 10;
  if (reads > 1000) return 7;
  return 5;
}

interface CountryPanelProps {
  country: CountryData | null;
  onClose: () => void;
}

function CountryPanel({ country, onClose }: CountryPanelProps) {
  if (!country) return null;
  return (
    <div className="absolute top-0 right-0 z-[1000] w-72 bg-card border rounded-lg shadow-lg m-3 p-4 font-sans-ui">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-foreground">{country.name}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Reads</span>
          <span className="font-semibold">{country.reads.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Downloads</span>
          <span className="font-semibold">{country.downloads.toLocaleString()}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <p className="text-muted-foreground text-xs">Top Journal</p>
          <p className="font-medium text-xs">{country.topJournal}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Top Article</p>
          <p className="font-medium text-xs">{country.topArticle}</p>
        </div>
      </div>
    </div>
  );
}

interface WorldMapProps {
  countryStats: Map<string, CountryData>;
  recentEvents: ReaderEvent[];
}

export function WorldMap({ countryStats, recentEvents }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const eventMarkersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [5, 20],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update country markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const countries = Array.from(countryStats.values());
    countries.forEach(c => {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: getRadius(c.reads),
        color: getColor(c.reads),
        fillColor: getColor(c.reads),
        fillOpacity: 0.6,
        weight: 2,
      })
        .bindPopup(`<div style="font-family:system-ui;font-size:13px"><b>${c.name}</b><br>Reads: ${c.reads.toLocaleString()}</div>`)
        .on("click", () => setSelectedCountry(c))
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [countryStats]);

  // Update event markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    eventMarkersRef.current.forEach(m => map.removeLayer(m));
    eventMarkersRef.current = [];

    recentEvents.slice(0, 5).forEach(e => {
      const m = L.circleMarker([e.lat, e.lng], {
        radius: 4,
        color: "#FFCC00",
        fillColor: "#FFCC00",
        fillOpacity: 0.8,
        weight: 2,
      }).addTo(map);
      eventMarkersRef.current.push(m);
    });
  }, [recentEvents]);

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden relative">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-foreground">Global Readership Map</h2>
        <p className="text-xs text-muted-foreground font-sans-ui">Click a marker for details · Live reader events shown in gold</p>
      </div>
      <div className="relative h-[400px] md:h-[500px]">
        <div ref={containerRef} className="h-full w-full" />
        <CountryPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>
    </div>
  );
}
