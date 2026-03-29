import { TrendingUp, TrendingDown, Minus, Download, FileText, Image, FileDown } from "lucide-react";
import type { BriefingData } from "@/utils/localStorageUtils";
import { downloadAsPDF, downloadAsJPG, downloadAsDOCX } from "@/utils/downloadUtils";

interface Props {
  briefing: BriefingData | null;
  persona: string;
}

function SentimentBadge({ label, score }: { label: string; score: number }) {
  const color = score >= 6 ? "text-sentiment-positive" : score <= 4 ? "text-sentiment-negative" : "text-sentiment-neutral";
  const Icon = score >= 6 ? TrendingUp : score <= 4 ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${color}`}>
      <Icon className="w-4 h-4" /> {label} ({score}/10)
    </span>
  );
}

export default function BriefingPanel({ briefing, persona }: Props) {
  if (!briefing) {
    return (
      <div className="glass-panel p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary/40" />
          </div>
          <p className="text-muted-foreground text-sm">Select a persona and generate your briefing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 overflow-y-auto scrollbar-thin h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{briefing.headline}</h2>
          <p className="text-xs text-primary mt-1 font-mono uppercase">Persona: {persona}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => downloadAsPDF("briefing-content")} className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="PDF">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={() => downloadAsDOCX(briefing, persona)} className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="DOCX">
            <FileDown className="w-4 h-4" />
          </button>
          <button onClick={() => downloadAsJPG("briefing-content")} className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="JPG">
            <Image className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div id="briefing-content" className="space-y-6">
        <Section title="Market Sentiment">
          <SentimentBadge label={briefing.marketSentiment.label} score={briefing.marketSentiment.score} />
          <p className="text-sm text-muted-foreground mt-2">{briefing.marketSentiment.summary}</p>
        </Section>

        <Section title="Key Insights">
          <ul className="space-y-2">
            {briefing.keyInsights.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-mono text-xs mt-0.5">0{i + 1}</span>
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Sector Impact">
          <div className="flex flex-wrap gap-2">
            {briefing.sectorImpact.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground border border-border">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Contrarian Views">
          <ul className="space-y-2">
            {briefing.contrarianViews.map((v, i) => (
              <li key={i} className="text-sm text-destructive/80 flex gap-2">
                <span className="text-destructive">⚡</span> {v}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Follow-Up Questions">
          <ul className="space-y-1">
            {briefing.followUpQuestions.map((q, i) => (
              <li key={i} className="text-sm text-muted-foreground">→ {q}</li>
            ))}
          </ul>
        </Section>

        <Section title="Future Outlook">
          <p className="text-sm text-foreground/90 leading-relaxed">{briefing.futureOutlook}</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold text-primary uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}
