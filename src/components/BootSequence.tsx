import { motion } from "framer-motion";
import { CheckCircle, Loader2, Circle } from "lucide-react";

const STEPS = [
  "News Ingestion",
  "Entity Extraction",
  "Sentiment Analysis",
  "Multi-Article Synthesis",
  "Persona Adaptation",
  "Briefing Generation",
];

interface Props {
  currentStep: number; // -1 = not started, 0-5 = in progress, 6 = done
}

export default function BootSequence({ currentStep }: Props) {
  if (currentStep < 0) return null;

  return (
    <div className="glass-panel p-6 glow-primary">
      <h3 className="font-display text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Agent Pipeline Active</h3>
      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              {done ? (
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
              ) : active ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              )}
              <span className={`text-sm ${done ? "text-accent" : active ? "text-primary font-medium" : "text-muted-foreground/40"}`}>
                {step}
              </span>
              {active && (
                <motion.div
                  className="h-0.5 flex-1 bg-primary/30 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
