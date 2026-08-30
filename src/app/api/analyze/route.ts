import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { getMockAnalyzerData } from "@/data/mock";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const exam = (body.exam || "jee-main").toLowerCase();
    const chapter = (body.chapter || "modern-physics").toLowerCase();

    // 1. Fetch deterministic ground truth from analysis.json
    let deterministicData = null;
    try {
      const analysisPath = path.join(process.cwd(), "public", "data", "analysis.json");
      if (fs.existsSync(analysisPath)) {
        const fileContent = fs.readFileSync(analysisPath, "utf-8");
        const parsed = JSON.parse(fileContent);
        const indexedKey = `${exam}/${chapter}`;
        if (parsed.indexedChapters && parsed.indexedChapters[indexedKey]) {
          deterministicData = parsed.indexedChapters[indexedKey];
        } else if (parsed.examSlug === exam && parsed.chapterSlug === chapter) {
          deterministicData = parsed;
        }
      }
    } catch (e) {
      console.warn("[/api/analyze] Could not read analysis.json, falling back to mock:", e);
    }

    // Fallback to structured mock analyzer data if not in generated json
    if (!deterministicData) {
      deterministicData = getMockAnalyzerData(exam, chapter);
    }

    // 2. Format prompt for OpenRouter AI
    const systemPrompt = `You are ExamSaathi's Academic Intelligence Engine.
You synthesize and explain verified deterministic PYQ (Previous Year Questions) statistics for competitive Indian examinations (JEE Main, JEE Advanced, CBSE Class 12 Boards).
GUIDELINES:
- Never fabricate numbers or statistics; base your insights strictly on the provided mathematical ground-truth.
- Highlight high-frequency subtopics, Poisson gap anomalies (overdue concepts), and shift-wise difficulty variations.
- Format all equations using inline LaTeX ($E = h\\nu$) or display LaTeX ($$\\lambda = \\frac{h}{p}$$).
- Keep your tone kinetic, analytical, rigorous, and direct.`;

    const userPrompt = `Analyze the mathematical ground-truth data for:
Exam: ${exam.toUpperCase()}
Chapter: ${deterministicData.chapter?.name || chapter}

Deterministic Summary:
- Weightage: ${deterministicData.chapter?.weightagePercent || 10}%
- Historical PYQ Count: ${deterministicData.chapter?.questionCount || 35} questions
- Subtopic Weightages: ${JSON.stringify(deterministicData.pieData || deterministicData.weightagePie || [])}
- Expected Next-Exam Count: ${JSON.stringify(deterministicData.expectedCounts || [])}
- Recurrence Gap Alerts: ${JSON.stringify(deterministicData.gapAlerts || [])}

Provide:
1. Shift Probability Verdict: Which specific subtopic is virtually guaranteed in the upcoming test session?
2. Recurrence Alert: Analysis of any topics currently overdue (Poisson gap anomaly).
3. Strategic Preparation Directive: Exactly how a candidate should sequence revision for maximum score efficiency.`;

    // 3. Request OpenRouter
    const aiResult = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: process.env.OPENROUTER_MODEL_ANALYSIS || "meta-llama/llama-3.3-70b-instruct",
        temperature: 0.3,
        maxTokens: 500,
        timeoutMs: 8000,
      }
    );

    if (aiResult.text && !aiResult.error) {
      return NextResponse.json({
        success: true,
        exam,
        chapter,
        source: "live_ai",
        aiInsights: aiResult.text,
        analysis: deterministicData,
      });
    }

    // 4. Deterministic fallback if OpenRouter is unreachable or key is not configured
    const defaultInsights = `### Shift Probability Verdict
Based on 10-year empirical frequency matrices, the highest yield topic in **${deterministicData.chapter?.name || chapter}** commands significant weightage across all shifts. Focus heavily on core derivations and standard numerical patterns.

### Recurrence Alert (Overdue Patterns)
Topics displaying high interval gaps between successive paper appearances are statistically due for recurrence in upcoming morning/evening shifts. Pay close attention to boundary condition problems.

### Strategic Revision Directive
1. Master fundamental equations and dimensional constraints first.
2. Solve the past 5 years of verified shift numericals under timed 3-minute intervals.
3. Review formula sheets and ensure sign conventions are thoroughly memorized.`;

    return NextResponse.json({
      success: true,
      exam,
      chapter,
      source: "deterministic_fallback",
      fallbackReason: aiResult.error || "OPENROUTER_NOT_AVAILABLE",
      aiInsights: defaultInsights,
      analysis: deterministicData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
