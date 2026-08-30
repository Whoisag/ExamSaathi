import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, OpenRouterMessage } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages = [], exam = "jee-main", chapter = "General Preparation", confidence } = body;

    const systemPrompt = `You are Saathi AI — the Socratic academic strategist and tutor within ExamSaathi.
You assist Indian students preparing for ${exam.toUpperCase()} and CBSE Class 12 Boards.
CURRENT CONTEXT:
- Active Subject / Chapter: ${chapter}
- Student Confidence Level: ${confidence || "Self-Paced"}

CORE PRINCIPLES:
1. Socratic Mentorship: When a student asks a concept or problem question, do not simply dump the final answer. Ask probing questions, isolate the underlying physical/mathematical theorem, and guide them step-by-step.
2. Kinetic & Brutalist Tone: Direct, zero corporate fluff, analytically sharp, and focused on score optimization.
3. Mathematical Precision: Always format equations and formulas in clean LaTeX using $...$ for inline or $$...$$ for multi-line expressions.
4. Exam Pattern Alignment: Anchor advice in actual NTA / CBSE shift patterns, recurring traps, and NCERT exemplar references.`;

    const formattedMessages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-8).map((m: any) => ({
        role: (m.role === "user" || m.role === "assistant" ? m.role : "user") as "user" | "assistant",
        content: String(m.content || ""),
      })),
    ];

    // If no user message was provided in array, add a greeting prompt
    if (formattedMessages.length === 1) {
      formattedMessages.push({
        role: "user",
        content: `I am revising ${chapter} for ${exam}. What should be my immediate tactical focus?`,
      });
    }

    const aiResult = await callOpenRouter(formattedMessages, {
      model: process.env.OPENROUTER_MODEL_ASSISTANT || "anthropic/claude-3.5-haiku",
      temperature: 0.5,
      maxTokens: 1000,
      timeoutMs: 8000,
    });

    if (aiResult.text && !aiResult.error) {
      return NextResponse.json({
        success: true,
        source: "live_ai",
        message: {
          role: "assistant",
          content: aiResult.text,
        },
      });
    }

    // Deterministic fallback response when AI is offline or key not provided
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    let fallbackText = `**Saathi Strategy Directive for ${chapter} (${exam.toUpperCase()}):**\n\n`;

    if (lastUserMessage.toLowerCase().includes("formula") || lastUserMessage.toLowerCase().includes("equation")) {
      fallbackText += `For **${chapter}**, keep these fundamental relations at your fingertips:\n\n` +
        `1. Master the base conservation laws and dimensional consistency.\n` +
        `2. Always verify boundary conditions (e.g. $t \\to 0$, $t \\to \\infty$, or asymptotic limits).\n` +
        `3. Keep track of SI unit multipliers like $\\text{eV} = 1.6 \\times 10^{-19} \\text{ J}$ and $\\text{\\AA} = 10^{-10} \\text{ m}$.`;
    } else if (lastUserMessage.toLowerCase().includes("weak") || confidence === "weak") {
      fallbackText += `Since this is marked as a **weak spot**, execute the 3-step recovery protocol:\n\n` +
        `1. **NCERT Exemplar Review**: Solve all solved examples in the chapter to build baseline confidence.\n` +
        `2. **Formula Sheet Check**: Write out every core formula from memory on a blank sheet.\n` +
        `3. **Targeted PYQ Drill**: Solve 10 questions from the 2021-2024 shift archives under timed conditions.`;
    } else {
      fallbackText += `To maximize your percentile in **${chapter}**:\n\n` +
        `- Focus on high-frequency subtopics identified in the Chapter Analyzer.\n` +
        `- Watch out for standard sign convention errors and negative marking traps.\n` +
        `- Try solving one synthetic problem right now in the Practice hub to test your recall!`;
    }

    return NextResponse.json({
      success: true,
      source: "deterministic_fallback",
      fallbackReason: aiResult.error || "OPENROUTER_FALLBACK",
      message: {
        role: "assistant",
        content: fallbackText,
      },
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
