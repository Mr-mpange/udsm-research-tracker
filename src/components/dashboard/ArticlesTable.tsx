import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import type { Article } from "@/hooks/useArticles";

type SortKey = "downloads" | "citations" | "title";

interface ArticlesTableProps {
  articles: Article[];
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("downloads");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...articles].sort((a, b) => {
    const mul = sortAsc ? 1 : -1;
    if (sortKey === "title") return mul * a.title.localeCompare(b.title);
    return mul * (a[sortKey] - b[sortKey]);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-foreground">Top Articles</h2>
        <p className="text-xs text-muted-foreground font-sans-ui">Ranked by research impact metrics</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans-ui">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-semibold text-muted-foreground cursor-pointer" onClick={() => toggleSort("title")}>
                <span className="flex items-center gap-1">Article Title <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Journal</th>
              <th className="text-right p-3 font-semibold text-muted-foreground cursor-pointer" onClick={() => toggleSort("downloads")}>
                <span className="flex items-center justify-end gap-1">Downloads <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-right p-3 font-semibold text-muted-foreground cursor-pointer" onClick={() => toggleSort("citations")}>
                <span className="flex items-center justify-end gap-1">Citations <ArrowUpDown className="h-3 w-3" /></span>
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Journal Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((article) => (
              <tr key={article.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-3 max-w-xs">
                  <p className="font-medium text-foreground truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 md:hidden">{article.journal}</p>
                </td>
                <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">{article.journal}</td>
                <td className="p-3 text-right font-semibold tabular-nums">{article.downloads.toLocaleString()}</td>
                <td className="p-3 text-right font-semibold tabular-nums">{article.citations.toLocaleString()}</td>
                <td className="p-3 hidden lg:table-cell">
                  <a 
                    href="https://journals.udsm.ac.tz/index.php/tjpsd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline" 
                    title="View journal on UDSM Journals"
                  >
                    View Journal →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
