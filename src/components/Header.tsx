import { Newspaper } from "lucide-react";

export default function Header() {
  return (
    <header className="glass-panel px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
          <Newspaper className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-gradient">ET AI News Navigator</h1>
          <p className="text-xs text-muted-foreground">Multi-Agent Intelligence Briefing System</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">GenAI Hackathon • Track 8</span>
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
      </div>
    </header>
  );
}
