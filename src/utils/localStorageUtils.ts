export interface SavedBriefing {
  id: string;
  persona: string;
  briefing: BriefingData;
  articles: NewsArticle[];
  timestamp: number;
}

export interface NewsArticle {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
}

export interface BriefingData {
  headline: string;
  keyInsights: string[];
  sectorImpact: string[];
  marketSentiment: { label: string; score: number; summary: string };
  contrarianViews: string[];
  followUpQuestions: string[];
  futureOutlook: string;
}

const STORAGE_KEY = "et-ai-navigator-briefings";
const CURRENT_KEY = "et-ai-navigator-current";

export function saveBriefing(briefing: SavedBriefing): void {
  const all = getAllBriefings();
  all.unshift(briefing);
  if (all.length > 20) all.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  localStorage.setItem(CURRENT_KEY, JSON.stringify(briefing));
}

export function getAllBriefings(): SavedBriefing[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function getCurrentBriefing(): SavedBriefing | null {
  try {
    const data = localStorage.getItem(CURRENT_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

export function deleteBriefing(id: string): void {
  const all = getAllBriefings().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  const current = getCurrentBriefing();
  if (current?.id === id) localStorage.removeItem(CURRENT_KEY);
}

export function clearCurrentBriefing(): void {
  localStorage.removeItem(CURRENT_KEY);
}
