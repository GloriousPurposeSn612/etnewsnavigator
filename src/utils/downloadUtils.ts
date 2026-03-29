import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import type { BriefingData } from "./localStorageUtils";

export async function downloadAsPDF(elementId: string, filename = "briefing.pdf") {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: "#111827", scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(filename);
}

export async function downloadAsJPG(elementId: string, filename = "briefing.jpg") {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { backgroundColor: "#111827", scale: 2 });
  canvas.toBlob((blob) => {
    if (blob) saveAs(blob, filename);
  }, "image/jpeg", 0.95);
}

export async function downloadAsDOCX(briefing: BriefingData, persona: string, filename = "briefing.docx") {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: briefing.headline, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: `Persona: ${persona}`, italics: true })] }),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Key Insights")] }),
        ...briefing.keyInsights.map(i => new Paragraph({ children: [new TextRun(`• ${i}`)] })),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Sector Impact")] }),
        ...briefing.sectorImpact.map(i => new Paragraph({ children: [new TextRun(`• ${i}`)] })),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Market Sentiment")] }),
        new Paragraph({ children: [new TextRun(`${briefing.marketSentiment.label} (${briefing.marketSentiment.score}/10) — ${briefing.marketSentiment.summary}`)] }),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Contrarian Views")] }),
        ...briefing.contrarianViews.map(i => new Paragraph({ children: [new TextRun(`• ${i}`)] })),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Follow-Up Questions")] }),
        ...briefing.followUpQuestions.map(i => new Paragraph({ children: [new TextRun(`• ${i}`)] })),
        new Paragraph({ children: [new TextRun("")] }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Future Outlook")] }),
        new Paragraph({ children: [new TextRun(briefing.futureOutlook)] }),
      ],
    }],
  });
  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, filename);
}
