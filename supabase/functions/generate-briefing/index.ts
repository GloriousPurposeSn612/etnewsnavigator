import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RSS_FEEDS = [
  { url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms", source: "ET Top Stories" },
  { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", source: "ET Markets" },
  { url: "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms", source: "ET Tech" },
];

interface Article {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
}

async function fetchRSSArticles(): Promise<Article[]> {
  const articles: Article[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const resp = await fetch(feed.url, {
        headers: { "User-Agent": "ET-AI-Navigator/1.0" },
      });
      if (!resp.ok) continue;
      const xml = await resp.text();

      // Simple XML parsing for RSS items
      const items = xml.split("<item>").slice(1);
      for (const item of items.slice(0, 5)) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]>/s)?.[1] || item.match(/<title>(.*?)<\/title>/s)?.[1] || "";
        const link = item.match(/<link>(.*?)<\/link>/s)?.[1] || "";
        const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]>/s)?.[1] || item.match(/<description>(.*?)<\/description>/s)?.[1] || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1] || "";

        if (title) {
          articles.push({
            title: title.trim(),
            link: link.trim(),
            summary: desc.replace(/<[^>]*>/g, "").trim().slice(0, 200),
            published: pubDate ? new Date(pubDate).toLocaleDateString() : "Recent",
            source: feed.source,
          });
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${feed.source}:`, e);
    }
  }

  return articles;
}

const PERSONA_PROMPTS: Record<string, string> = {
  cfo: "You are briefing a Chief Financial Officer. Focus on financial implications, balance sheet impacts, revenue/cost considerations, regulatory risks, and capital allocation decisions.",
  investor: "You are briefing a retail/institutional investor. Focus on stock market opportunities, sector performance, valuation insights, portfolio risks, and actionable investment signals.",
  student: "You are briefing a business/economics student. Explain concepts clearly, connect to academic frameworks, highlight learning opportunities, and suggest areas for deeper study.",
  "tech-analyst": "You are briefing a technology analyst. Focus on tech stack trends, AI/ML developments, digital transformation, startup ecosystem, and emerging technology impacts.",
  upsc: "You are briefing a UPSC aspirant. Connect news to governance, public policy, constitutional matters, economic surveys, and current affairs relevant to civil services exams.",
  "sports-biz": "You are briefing a sports business analyst. Focus on sports industry economics, sponsorship deals, media rights, athlete economics, and sports-tech convergence.",
  entertainment: "You are briefing an entertainment industry observer. Focus on media economics, OTT platform strategies, content monetization, celebrity brand value, and cultural trends.",
  "job-market": "You are briefing a job market analyst. Focus on hiring trends, layoff patterns, skill demand shifts, salary benchmarks, gig economy, and workforce transformation.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { persona } = await req.json();
    const personaPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.cfo;

    // Agent 1: News Ingestion
    const articles = await fetchRSSArticles();
    if (articles.length === 0) {
      return new Response(JSON.stringify({ error: "No articles fetched" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const articlesSummary = articles.slice(0, 12).map((a, i) =>
      `[${i + 1}] ${a.title} (${a.source}): ${a.summary}`
    ).join("\n\n");

    // Agents 2-6: Combined AI processing
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a multi-agent AI news intelligence system for Economic Times business news.

${personaPrompt}

You must process these articles through a pipeline:
1. ENTITY EXTRACTION: Identify companies, sectors, financial figures, key people
2. SENTIMENT ANALYSIS: Determine overall market sentiment and per-sector sentiment
3. MULTI-ARTICLE SYNTHESIS: Find common themes, contradictions, and emerging narratives
4. PERSONA ADAPTATION: Tailor insights to the specified persona
5. BRIEFING GENERATION: Produce a structured intelligence briefing

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "headline": "One compelling headline summarizing the day's business landscape",
  "keyInsights": ["insight1", "insight2", "insight3", "insight4", "insight5"],
  "sectorImpact": ["sector1: impact", "sector2: impact", "sector3: impact"],
  "marketSentiment": {
    "label": "Bullish|Bearish|Neutral|Mixed|Cautiously Optimistic",
    "score": 7,
    "summary": "Brief sentiment explanation"
  },
  "contrarianViews": ["contrarian1", "contrarian2"],
  "followUpQuestions": ["question1", "question2", "question3"],
  "futureOutlook": "2-3 sentence forward-looking analysis"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Process these Economic Times articles and generate a persona-adapted intelligence briefing:\n\n${articlesSummary}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";

    // Clean markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let briefing;
    try {
      briefing = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    return new Response(JSON.stringify({ articles: articles.slice(0, 12), briefing }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-briefing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
