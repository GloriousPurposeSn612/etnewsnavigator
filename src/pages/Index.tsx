import { useState, useCallback, useEffect } from "react";
import { Zap } from "lucide-react";
import Header from "@/components/Header";
import PersonaSelector from "@/components/PersonaSelector";
import NewsFeedPanel from "@/components/NewsFeedPanel";
import BriefingPanel from "@/components/BriefingPanel";
import BootSequence from "@/components/BootSequence";
import ChatAssistant from "@/components/ChatAssistant";
import HistoryPanel from "@/components/HistoryPanel";
import { supabase } from "@/integrations/supabase/client";
import {
  saveBriefing,
  getCurrentBriefing,
  type NewsArticle,
  type BriefingData,
  type SavedBriefing,
} from "@/utils/localStorageUtils";

export default function Index() {
  const [persona, setPersona] = useState("cfo");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = getCurrentBriefing();
    if (saved) {
      setPersona(saved.persona);
      setArticles(saved.articles);
      setBriefing(saved.briefing);
    }
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    setBriefing(null);
    setPipelineStep(0);

    try {
      // Step 0-1: Fetch & process news
      const interval = setInterval(() => {
        setPipelineStep(prev => (prev < 5 ? prev + 1 : prev));
      }, 2500);

      const { data, error } = await supabase.functions.invoke("generate-briefing", {
        body: { persona },
      });

      clearInterval(interval);

      if (error) throw error;

      setPipelineStep(6);
      setArticles(data.articles || []);
      setBriefing(data.briefing);

      // Save to localStorage
      const saved: SavedBriefing = {
        id: crypto.randomUUID(),
        persona,
        briefing: data.briefing,
        articles: data.articles || [],
        timestamp: Date.now(),
      };
      saveBriefing(saved);

      setTimeout(() => setPipelineStep(-1), 1500);
    } catch (err) {
      console.error("Generation failed:", err);
      setPipelineStep(-1);
    } finally {
      setLoading(false);
    }
  }, [persona]);

  const loadSaved = (saved: SavedBriefing) => {
    setPersona(saved.persona);
    setArticles(saved.articles);
    setBriefing(saved.briefing);
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 max-w-[1400px] mx-auto">
      <Header />
      <PersonaSelector selected={persona} onSelect={setPersona} />

      <div className="flex items-center gap-3">
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 glow-primary transition-all"
        >
          <Zap className="w-4 h-4" />
          {loading ? "Generating..." : "Generate Briefing"}
        </button>
        {pipelineStep >= 0 && <BootSequence currentStep={pipelineStep} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <NewsFeedPanel articles={articles} loading={loading} />
          <HistoryPanel onLoad={loadSaved} />
        </div>
        <div className="lg:col-span-2 min-h-[500px]">
          <BriefingPanel briefing={briefing} persona={persona} />
        </div>
      </div>

      <ChatAssistant briefing={briefing} />
    </div>
  );
}
