import { useState } from "react";
import { Search, ExternalLink, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Journal {
  id: string;
  title: string;
  issn: string | null;
  description: string | null;
  cover_image_url: string | null;
  website_url: string | null;
  publisher: string | null;
  article_count?: number;
  total_downloads?: number;
}

interface JournalSearchProps {
  journals: Journal[];
}

export function JournalSearch({ journals }: JournalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredJournals = searchQuery.trim() === "" && !showAll
    ? [] 
    : searchQuery.trim() === "" && showAll
    ? journals
    : journals.filter((journal) =>
        journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journal.issn?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">UDSM Journals</h2>
            <p className="text-xs text-muted-foreground font-sans-ui">
              Browse and search our academic publications
            </p>
          </div>
          <Badge variant="secondary" className="font-sans-ui">
            {journals.length} Journals
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search journals by title, description, or ISSN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-sans-ui"
          />
        </div>
      </div>

      <div className="p-4">
        {searchQuery.trim() === "" && !showAll ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Start typing to search for journals...
            </p>
            <p className="text-xs text-muted-foreground/70 mb-4">
              Search by title, ISSN, or keywords
            </p>
            <button
              onClick={() => setShowAll(true)}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Show All Journals ({journals.length})
            </button>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No journals found matching "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setShowAll(true);
              }}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Show all journals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJournals.map((journal) => (
              <Card
                key={journal.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  {journal.cover_image_url ? (
                    <img
                      src={journal.cover_image_url}
                      alt={`${journal.title} cover`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <BookOpen className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  {journal.issn && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-xs font-mono"
                    >
                      ISSN: {journal.issn}
                    </Badge>
                  )}
                </div>

                {/* Journal Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                      {journal.title}
                    </h3>
                    {journal.publisher && (
                      <p className="text-xs text-muted-foreground font-sans-ui">
                        {journal.publisher}
                      </p>
                    )}
                  </div>

                  {journal.description && (
                    <p className="text-xs text-muted-foreground font-sans-ui line-clamp-3">
                      {journal.description}
                    </p>
                  )}

                  {/* Stats */}
                  {(journal.article_count || journal.total_downloads) && (
                    <div className="flex gap-3 text-xs font-sans-ui">
                      {journal.article_count && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span className="font-semibold">{journal.article_count}</span>
                          <span className="text-muted-foreground">articles</span>
                        </div>
                      )}
                      {journal.total_downloads && (
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{journal.total_downloads.toLocaleString()}</span>
                          <span className="text-muted-foreground">downloads</span>
                        </div>
                      )}
                    </div>
                  )}

                  {journal.website_url && (
                    <a
                      href={journal.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                    >
                      Visit Journal
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
