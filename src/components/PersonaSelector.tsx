import { User, TrendingUp, GraduationCap, Cpu, BookOpen, Trophy, Clapperboard, Briefcase } from "lucide-react";

const PERSONAS = [
  { id: "cfo", label: "CFO", icon: Briefcase, desc: "Financial strategy focus" },
  { id: "investor", label: "Investor", icon: TrendingUp, desc: "Market opportunities" },
  { id: "student", label: "Student", icon: GraduationCap, desc: "Learning perspective" },
  { id: "tech-analyst", label: "Tech Analyst", icon: Cpu, desc: "Technology trends" },
  { id: "upsc", label: "UPSC Aspirant", icon: BookOpen, desc: "Policy & governance" },
  { id: "sports-biz", label: "Sports Business", icon: Trophy, desc: "Sports industry" },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard, desc: "Entertainment biz" },
  { id: "job-market", label: "Job Market", icon: User, desc: "Employment trends" },
] as const;

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PersonaSelector({ selected, onSelect }: Props) {
  return (
    <div className="glass-panel p-4">
      <h2 className="font-display text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Persona</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PERSONAS.map(p => {
          const Icon = p.icon;
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-xs ${
                active
                  ? "border-primary bg-primary/10 text-primary glow-primary"
                  : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
