import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, topic, formulaName, formulaLatex, subject, examSlug } = body;

    const examTitle =
      examSlug === "cbse-12"
        ? "CBSE Class 12 Boards"
        : examSlug === "jee-main"
        ? "NTA JEE Main"
        : examSlug === "jee-advanced"
        ? "JEE Advanced"
        : examSlug === "neet"
        ? "NEET (UG)"
        : "National Examinations";

    if (action === "explain") {
      const prompt = `You are the Lead Master Academic Tutor for ${examTitle}.
Explain this formula thoroughly for a student preparing for ${examTitle}:
Formula Name: ${formulaName}
LaTeX: ${formulaLatex}
Subject: ${subject || "Science/Math"}

Provide a structured, beautifully formatted markdown response with:
1. ### ⚡ Core Concept & Intuition (1-2 clear paragraphs)
2. ### 📐 Step-by-Step Derivation / Key Transformation (Clean LaTeX steps)
3. ### ⚠️ Common Negative Marking Traps & Boundary Constraints (Bullet points with sign convention traps)
4. ### 🎯 Model Exam Practice Problem (With full step-by-step solution)`;

      const aiResult = await callOpenRouter([
        { role: "system", content: "You are an expert pedagogical tutor for Indian competitive exams. Use clean LaTeX with standard math notation." },
        { role: "user", content: prompt },
      ], {
        temperature: 0.3,
        maxTokens: 3000,
        timeoutMs: 15000,
      });

      return NextResponse.json({
        success: true,
        explanation: aiResult.text || "### Formula Derivation\n\nRefer to standard NCERT & Exam blueprints for step-by-step substitution.",
        provider: aiResult.provider,
      });
    }

    // Default action: "generate" high-yield formula cards
    const prompt = `You are the Lead Master Formula Curator for ${examTitle} (${subject || "All Subjects"}).
Generate high-yield formula cards for the topic/chapter: "${topic || subject}".

Respond ONLY with a JSON array of formula objects matching this TypeScript structure:
[
  {
    "id": "f-ai-1",
    "name": "Standard Name of Formula",
    "chapter": "${topic || subject}",
    "latex": "Full KaTeX valid formula string",
    "variables": [
      { "symbol": "x", "meaning": "Precise physical meaning and units" }
    ],
    "whenToUse": "Exact conditions when this formula applies in exams",
    "commonMistake": "Exact trap students fall into (units, sign conventions, assumptions)",
    "frequencyBadge": "Tested in 8 of last 10 shifts",
    "priority": "High",
    "tags": ["Tag1", "Tag2"]
  }
]`;

    const aiResult = await callOpenRouter([
      { role: "system", content: "You are an expert formula curator. Output only a valid JSON array of formula objects." },
      { role: "user", content: prompt },
    ], {
      temperature: 0.2,
      maxTokens: 3000,
      responseFormat: { type: "json_object" },
      timeoutMs: 15000,
    });

    if (aiResult.text && !aiResult.error) {
      try {
        const cleaned = aiResult.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const formulaList = Array.isArray(parsed) ? parsed : (parsed.formulas || parsed.items || []);

        return NextResponse.json({
          success: true,
          formulas: formulaList,
          provider: aiResult.provider,
        });
      } catch (err) {
        console.warn("[FormulasAI] JSON parse error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      formulas: [],
      error: "AI_GENERATION_FAILED",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
