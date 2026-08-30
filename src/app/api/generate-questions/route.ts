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
    const topic = body.topic || "Core Syllabus";
    const count = Math.min(Math.max(body.count || 2, 1), 5);
    const difficulty = body.difficulty || "Medium";

    // 1. Prepare OpenRouter prompt requesting structured JSON
    const systemPrompt = `You are the ExamSaathi Synthetic Question Generator.
Generate authentic, high-quality multiple choice practice questions adhering strictly to the testing style and difficulty of ${exam.toUpperCase()} for the chapter "${chapter}".
Enforce strictly valid JSON output matching this schema:
{
  "questions": [
    {
      "id": "syn-1",
      "title": "Concise Descriptive Title",
      "questionLatex": "Full question statement using LaTeX notation $...$ for equations",
      "options": [
        { "key": "A", "textLatex": "Option A with $LaTeX$", "isCorrect": false },
        { "key": "B", "textLatex": "Option B with $LaTeX$", "isCorrect": true },
        { "key": "C", "textLatex": "Option C with $LaTeX$", "isCorrect": false },
        { "key": "D", "textLatex": "Option D with $LaTeX$", "isCorrect": false }
      ],
      "solutionLatex": "Rigorous, step-by-step mathematical explanation using $...$",
      "difficultyBadge": "Easy" | "Medium" | "Hard" | "Multi-Concept",
      "expectedYear": "${exam.includes("cbse") ? "CBSE 2026 Board" : "JEE 2026 Shift"} Predicted",
      "predictedProbability": 92,
      "subtopic": "${topic}"
    }
  ]
}`;

    const userPrompt = `Generate ${count} ${difficulty} level synthetic practice question(s) for:
Exam: ${exam}
Chapter: ${chapter}
Target Concept: ${topic}
Ensure exactly 1 option has "isCorrect": true, and all equations are strictly enclosed in LaTeX $...$ delimiters.`;

    const aiResult = await callOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      {
        model: process.env.OPENROUTER_MODEL_ANALYSIS || "meta-llama/llama-3.3-70b-instruct",
        temperature: 0.3,
        maxTokens: 650,
        timeoutMs: 8000,
        responseFormat: { type: "json_object" },
      }
    );

    if (aiResult.text && !aiResult.error) {
      try {
        let cleanText = aiResult.text.trim();
        if (cleanText.includes("```")) {
          const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
          if (match && match[1]) {
            cleanText = match[1].trim();
          }
        }
        const parsed = JSON.parse(cleanText);
        const questions = parsed.questions || parsed;
        if (Array.isArray(questions) && questions.length > 0) {
          return NextResponse.json({
            success: true,
            exam,
            chapter,
            count: questions.length,
            source: "live_ai",
            provider: aiResult.provider || "openrouter",
            questions,
          });
        }
      } catch (parseError) {
        console.warn("[/api/generate-questions] Failed to parse AI JSON response:", parseError);
      }
    }

    // 2. Deterministic Fallback: Retrieve questions from questions.json or mock analyzer
    let fallbackQuestions = [];
    try {
      const qPath = path.join(process.cwd(), "public", "data", "questions.json");
      if (fs.existsSync(qPath)) {
        const allQuestions = JSON.parse(fs.readFileSync(qPath, "utf-8"));
        const matched = allQuestions.filter(
          (q: any) =>
            q.exam === exam &&
            (q.chapter?.toLowerCase().includes(chapter) ||
              q.chapter_slug?.toLowerCase().includes(chapter))
        );

        if (matched.length > 0) {
          fallbackQuestions = matched.slice(0, count).map((q: any, i: number) => ({
            id: q.id || `pyq-fallback-${i + 1}`,
            title: `${exam.toUpperCase()} Verified PYQ (${q.year || 2024})`,
            questionLatex: q.question_latex || q.question || `Solve the standard problem on ${topic}.`,
            options: [
              { key: "A", textLatex: "Option A", isCorrect: false },
              { key: "B", textLatex: "Option B", isCorrect: true },
              { key: "C", textLatex: "Option C", isCorrect: false },
              { key: "D", textLatex: "Option D", isCorrect: false },
            ],
            solutionLatex: q.solution_latex || "Refer to NCERT/Official Answer Key for detailed derivation.",
            difficultyBadge: q.difficulty || difficulty,
            expectedYear: "Verified Historical Pattern",
            predictedProbability: 88,
            subtopic: q.topic || topic,
          }));
        }
      }
    } catch (readErr) {
      console.warn("[/api/generate-questions] Error reading questions.json:", readErr);
    }

    // If still empty, use mock analyzer generated questions
    if (fallbackQuestions.length === 0) {
      const mockData = getMockAnalyzerData(exam, chapter);
      fallbackQuestions = mockData.generatedQuestions.slice(0, count);
    }

    return NextResponse.json({
      success: true,
      exam,
      chapter,
      count: fallbackQuestions.length,
      source: "fallback",
      fallbackReason: aiResult.error || "OPENROUTER_FALLBACK",
      questions: fallbackQuestions,
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
