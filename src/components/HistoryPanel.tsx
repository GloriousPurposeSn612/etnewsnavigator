import { Clock, Trash2 } from "lucide-react";
import { getAllBriefings, deleteBriefing, type SavedBriefing } from "@/utils/localStorageUtils";
import { useState } from "react";

interface Props {
  onLoad: (b: SavedBriefing) => void;
}

export default function HistoryPanel({ onLoad }: Props) {
  const [items, setItems] = useState(getAllBriefings);

  const handleDelete = (id: string) => {
    deleteBriefing(id);
    setItems(getAllBriefings());
  };

  if (items.length === 0) return null;

  return (
    <div className="glass-panel p-4">
      <h2 className="font-display text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" /> History
      </h2>
      <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
        {items.map(b => (
          <div key={b.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 group">
            <button onClick={() => onLoad(b)} className="text-xs text-foreground/80 hover:text-primary text-left flex-1 truncate">
              {b.briefing.headline}
            </button>
            <span className="text-[10px] text-muted-foreground mx-2">{b.persona}</span>
            <button onClick={() => handleDelete(b.id)} className="opacity-0 group-hover:opacity-100 text-destructive/60 hover:text-destructive">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
