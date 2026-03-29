# ET AI News Navigator

AI-powered multi-agent news intelligence platform built for the Economic Times GenAI Hackathon (Track 8: AI-Native News Experience).

---

## 🚀 Overview

ET AI News Navigator transforms multiple Economic Times news articles into a single, structured, and personalized intelligence briefing.

Instead of reading several articles separately, users get a unified, insight-rich report tailored to their needs.

---

## 🧠 Key Features

- Multi-agent AI pipeline (end-to-end automation)
- Real-time news ingestion using Economic Times RSS feeds
- Multi-article synthesis into a single briefing
- Persona-based personalization:
  - CFO
  - Investor
  - Student
  - Technology
  - UPSC
  - Sports
  - Entertainment
  - Jobs
- Interactive dashboard UI
- Export reports (PDF / DOCX / JPG)
- Persistent history (saved briefings)
- Built-in AI assistant for:
  - Q&A
  - Summarization
  - Translation (including Hinglish)

---

## ⚙️ Agent Pipeline

1. News Ingestion Agent  
   Fetches latest ET news via RSS feeds  

2. Processing Agent  
   Cleans text and extracts entities  

3. Sentiment & Topic Agent  
   Detects sentiment and key themes  

4. Synthesizer Agent  
   Combines multiple articles into one narrative  

5. Persona Agent  
   Adapts content for different user types  

6. Briefing Generator Agent  
   Produces final structured report  

---

## 🧩 Tech Stack

Frontend  
- React (Lovable)  
- TailwindCSS  

Backend  
- Lovable Cloud (Edge Functions)  

AI  
- Gemini Flash (free-tier model via Lovable integration)  

Data Source  
- Economic Times RSS feeds  

Storage  
- Local storage (history persistence)  

---

## 🎯 Problem Solved

Traditional news platforms deliver static, one-size-fits-all content.

This project introduces:
- Personalized news experience  
- Multi-article intelligence synthesis  
- Faster decision-making with minimal reading  

---

## 📊 Impact

- Reduces news consumption time significantly  
- Improves clarity through structured insights  
- Enhances user engagement via personalization  

---

## ▶️ How It Works

1. Select a persona  
2. Click "Generate Briefing"  
3. AI pipeline processes news automatically  
4. View personalized intelligence report  
5. Download or save for later  

---

## 🛠️ Setup (Local Development)

```bash
npm install
npm run dev
