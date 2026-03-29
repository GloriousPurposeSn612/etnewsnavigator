import { ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/utils/localStorageUtils";

interface Props {
  articles: NewsArticle[];
  loading?: boolean;
}

export default function NewsFeedPanel({ articles, loading }: Props) {
  return (
    <div className="glass-panel p-4 flex flex-col h-full">
      <h2 className="font-display text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        ET News Feed ({articles.length})
      </h2>
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin">
        {loading && articles.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">Fetching articles...</div>
        )}
        {articles.map((a, i) => (
          <a
            key={i}
            href={a.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-md border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {a.title}
              </h3>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-primary/70 font-mono">{a.source}</span>
              <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/50">{a.published}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
