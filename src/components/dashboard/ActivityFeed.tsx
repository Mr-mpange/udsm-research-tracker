import type { ReaderEvent } from "@/hooks/useSimulation";
import type { Article } from "@/hooks/useArticles";
import { Globe } from "lucide-react";

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join("");
}

interface ActivityFeedProps {
  recentEvents: ReaderEvent[];
  articles: Article[];
}

export function ActivityFeed({ recentEvents, articles }: ActivityFeedProps) {
  const articleMap = new Map(articles.map(a => [a.id, a]));

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          <p className="text-xs text-muted-foreground font-sans-ui">Live reader events worldwide</p>
        </div>
      </div>
      <div className="divide-y max-h-[360px] overflow-y-auto">
        {recentEvents.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground font-sans-ui">Waiting for reader events…</p>
        )}
        {recentEvents.slice(0, 15).map((event, i) => {
          const article = articleMap.get(event.articleId);
          const timeDiff = Math.round((Date.now() - event.timestamp) / 1000);
          return (
            <div key={event.timestamp + "-" + i} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
              <span className="text-xl leading-none mt-0.5" role="img" aria-label={event.country}>
                {countryFlag(event.countryCode)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans-ui text-foreground">
                  Reader from <span className="font-semibold">{event.country}</span>
                </p>
                {article && (
                  <p className="text-xs text-muted-foreground font-sans-ui truncate mt-0.5">
                    {article.title}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-sans-ui whitespace-nowrap">
                {timeDiff < 60 ? `${timeDiff}s ago` : `${Math.floor(timeDiff / 60)}m ago`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
