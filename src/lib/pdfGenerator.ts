import { jsPDF } from "jspdf";

export interface PdfOptions {
  title: string;
  subject?: string;
  exam?: string;
  chapter?: string;
  sections?: Array<{
    heading: string;
    content: string | string[];
  }>;
  rawContent?: string;
}

/**
 * Curated high-yield study sheet data for high-frequency Class 12 & JEE topics
 */
const CURATED_TOPIC_DATA: Record<string, {
  title: string;
  subject: string;
  exam: string;
  sections: Array<{ heading: string; content: string[] }>;
}> = {
  "inverse trigonometric functions": {
    title: "Inverse Trigonometric Functions — Class 12 & JEE Complete Formula & Revision Guide",
    subject: "Mathematics",
    exam: "CBSE Class 12 & JEE Main 2026",
    sections: [
      {
        heading: "1. Principal Value Branches (Domain & Range Table)",
        content: [
          "• y = sin⁻¹(x)  |  Domain: [-1, 1]  |  Principal Range: [-π/2, π/2]",
          "• y = cos⁻¹(x)  |  Domain: [-1, 1]  |  Principal Range: [0, π]",
          "• y = tan⁻¹(x)  |  Domain: R        |  Principal Range: (-π/2, π/2)",
          "• y = cot⁻¹(x)  |  Domain: R        |  Principal Range: (0, π)",
          "• y = sec⁻¹(x)  |  Domain: R - (-1, 1) | Principal Range: [0, π] - {π/2}",
          "• y = cosec⁻¹(x)|  Domain: R - (-1, 1) | Principal Range: [-π/2, π/2] - {0}",
        ]
      },
      {
        heading: "2. Essential Self-Inverse & Negative-Angle Properties",
        content: [
          "• sin(sin⁻¹ x) = x for all x ∈ [-1, 1]",
          "• sin⁻¹(sin θ) = θ ONLY if θ ∈ [-π/2, π/2]. Trap: sin⁻¹(sin(2π/3)) = π/3, not 2π/3!",
          "• cos(cos⁻¹ x) = x for all x ∈ [-1, 1]",
          "• cos⁻¹(cos θ) = θ ONLY if θ ∈ [0, π]. Trap: cos⁻¹(cos(7π/6)) = 5π/6!",
          "• sin⁻¹(-x) = -sin⁻¹(x),   tan⁻¹(-x) = -tan⁻¹(x),   cosec⁻¹(-x) = -cosec⁻¹(x)",
          "• cos⁻¹(-x) = π - cos⁻¹(x), cot⁻¹(-x) = π - cot⁻¹(x), sec⁻¹(-x) = π - sec⁻¹(x)",
        ]
      },
      {
        heading: "3. Complementary Angle Identities",
        content: [
          "• sin⁻¹(x) + cos⁻¹(x) = π/2    for all x ∈ [-1, 1]",
          "• tan⁻¹(x) + cot⁻¹(x) = π/2    for all x ∈ R",
          "• sec⁻¹(x) + cosec⁻¹(x) = π/2  for all |x| ≥ 1",
        ]
      },
      {
        heading: "4. Addition & Double-Angle Conversion Formulas",
        content: [
          "• tan⁻¹(x) + tan⁻¹(y) = tan⁻¹((x + y)/(1 - xy))    [if xy < 1]",
          "• tan⁻¹(x) + tan⁻¹(y) = π + tan⁻¹((x + y)/(1 - xy)) [if x > 0, y > 0, xy > 1]",
          "• tan⁻¹(x) - tan⁻¹(y) = tan⁻¹((x - y)/(1 + xy))    [if xy > -1]",
          "• 2 tan⁻¹(x) = sin⁻¹(2x / (1 + x²))               [for |x| ≤ 1]",
          "• 2 tan⁻¹(x) = cos⁻¹((1 - x²) / (1 + x²))          [for x ≥ 0]",
          "• 2 tan⁻¹(x) = tan⁻¹(2x / (1 - x²))               [for -1 < x < 1]",
        ]
      },
      {
        heading: "5. High-Yield CBSE Board PYQs & Exam Tips",
        content: [
          "1. Evaluate: sin(π/3 - sin⁻¹(-1/2)) = sin(π/3 - (-π/6)) = sin(π/2) = 1. [CBSE 2024]",
          "2. Solve: tan⁻¹((x-1)/(x-2)) + tan⁻¹((x+1)/(x+2)) = π/4. Answer: x = ±1/√2. [CBSE 2023]",
          "3. Common Mistake: Forgetting to verify whether the angle lies in the Principal Value Branch!",
          "4. In 2026 CBSE Syllabus: Graphs and simple properties are prioritized for Section A (MCQ) and Section B (2-markers).",
        ]
      }
    ]
  }
};

/**
 * Parses markdown text into formatted sections for jsPDF
 */
function parseTextToSections(raw: string): Array<{ heading: string; content: string[] }> {
  const lines = raw.split("\n");
  const sections: Array<{ heading: string; content: string[] }> = [];
  let currentHeading = "Summary & Key Highlights";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
      if (currentLines.length > 0) {
        sections.push({ heading: currentHeading, content: [...currentLines] });
        currentLines = [];
      }
      currentHeading = trimmed.replace(/^#{1,4}\s+/, "").replace(/\*\*/g, "");
    } else {
      // Clean markdown stars and special tags
      const cleanLine = trimmed
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1");
      currentLines.push(cleanLine);
    }
  }

  if (currentLines.length > 0) {
    sections.push({ heading: currentHeading, content: currentLines });
  }

  return sections.length > 0 ? sections : [
    { heading: "Revision Notes", content: lines.filter(l => l.trim().length > 0) }
  ];
}

/**
 * Generates and triggers browser download of an official ExamSaathi PDF study sheet
 */
export function downloadStudyGuidePdf(options: PdfOptions): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Check if we have curated high-precision data for this topic
  const lookupKey = (options.chapter || options.title || "").toLowerCase();
  let topicData = Object.entries(CURATED_TOPIC_DATA).find(([key]) => lookupKey.includes(key))?.[1];

  const title = topicData?.title || options.title || "ExamSaathi AI Study Guide";
  const subject = topicData?.subject || options.subject || "Academic Sciences & Mathematics";
  const exam = topicData?.exam || options.exam || "CBSE Class 12 / JEE Main";
  const sections = topicData?.sections || options.sections || (options.rawContent ? parseTextToSections(options.rawContent) : []);

  let y = margin;

  const drawHeader = () => {
    // Top black banner with accent border
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 18, "F");

    doc.setFillColor(255, 77, 0); // #FF4D00
    doc.rect(margin, y + 18, contentWidth, 2, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("EXAMSAATHI.AI", margin + 5, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 77, 0);
    doc.text(`TARGET: ${exam.toUpperCase()}`, margin + 5, y + 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("OFFICIAL REVISION CHEATSHEET", pageWidth - margin - 5, y + 11, { align: "right" });

    y += 26;

    // Document Title
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const splitTitle = doc.splitTextToSize(title, contentWidth);
    doc.text(splitTitle, margin, y);
    y += splitTitle.length * 6 + 2;

    // Meta row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text(`Subject: ${subject}  |  Generated: ${new Date().toLocaleDateString()}  |  Confidential Student Study Guide`, margin, y);
    y += 6;

    // Divider
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  const drawFooter = (pageNum: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text("ExamSaathi • Socratic AI Academic Mentor • Indira Gandhi Memorial High School", margin, pageHeight - 7);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  };

  let pageNum = 1;
  drawHeader();

  // Iterate over sections
  for (const sec of sections) {
    // Check if we need a new page for heading
    if (y > pageHeight - 40) {
      drawFooter(pageNum);
      doc.addPage();
      pageNum++;
      y = margin;
      drawHeader();
    }

    // Section header box
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, contentWidth, 7.5, "F");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, 7.5, "S");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(sec.heading, margin + 3, y + 5.2);
    y += 11;

    // Section lines
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);

    const items = Array.isArray(sec.content) ? sec.content : [sec.content];
    for (const item of items) {
      const splitLines = doc.splitTextToSize(item, contentWidth - 4);
      if (y + splitLines.length * 4.5 > pageHeight - 20) {
        drawFooter(pageNum);
        doc.addPage();
        pageNum++;
        y = margin;
        drawHeader();
      }

      doc.text(splitLines, margin + 2, y);
      y += splitLines.length * 4.5 + 1.5;
    }

    y += 4;
  }

  drawFooter(pageNum);

  // Generate safe filename
  const cleanName = (options.chapter || options.title || "ExamSaathi_Study_Guide")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 40);

  doc.save(`${cleanName}_Class12_Revision.pdf`);
}
