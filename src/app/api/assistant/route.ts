import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, OpenRouterMessage } from "@/lib/openrouter";

// Rich subject/chapter topic knowledge base for offline fallback
const CHAPTER_TOPIC_REGISTRY: Record<string, { topics: string[]; formulas: string[]; tips: string }> = {
  "current electricity": {
    topics: [
      "Drift Velocity, Current Density & Ohm's Law derivation ($I = n e A v_d$)",
      "Temperature Dependence of Resistivity and Carbon Resistors",
      "Kirchhoff's Rules (KCL & KVL) applied to complex DC circuits",
      "Wheatstone Bridge Principle & Meter Bridge experiments",
      "Potentiometer (Comparison of EMF & Internal Resistance calculation)",
      "EMF, Internal Resistance, and Terminal Potential Difference of Cells",
      "Series and Parallel combination of non-identical cells",
      "Electrical Power, Heating Effect ($H = I^2 R t$), and Maximum Power Transfer Theorem",
    ],
    formulas: [
      "$I = n e A v_d = n e A \\left(\\frac{e E \\tau}{m}\\right)$",
      "$\\rho_T = \\rho_0 [1 + \\alpha(T - T_0)]$",
      "\\text{Terminal Voltage: } V = E - I r \\text{ (discharging)}, \\; V = E + I r \\text{ (charging)}",
      "\\text{Equivalent EMF (parallel): } E_{eq} = \\frac{E_1/r_1 + E_2/r_2}{1/r_1 + 1/r_2}",
    ],
    tips: "CBSE & JEE Main heavily test Kirchhoff's laws circuit reduction and meter bridge end-error corrections. Ensure you memorize how potentiometer sensitivity increases with wire length!",
  },
  "electrostatics": {
    topics: [
      "Coulomb's Law in vector form and dielectric medium",
      "Electric Field & Potential due to continuous charge distributions (ring, dipole, sheet)",
      "Gauss's Law applications (infinite wire, charged plane sheet, spherical shell)",
      "Capacitance of parallel plate capacitor with dielectric slab insertion",
      "Energy stored in capacitors and energy loss during charge sharing ($E_{loss} = \\frac{C_1 C_2}{2(C_1 + C_2)}(V_1 - V_2)^2$)",
    ],
    formulas: [
      "E_{\\text{axial}} = \\frac{2 k p}{r^3}, \\quad E_{\\text{equatorial}} = \\frac{k p}{r^3}",
      "C = \\frac{\\kappa \\varepsilon_0 A}{d - t(1 - 1/\\kappa)}",
      "U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2 C}",
    ],
    tips: "Gauss's Law derivations are virtually mandatory 5-markers in CBSE 12. In JEE, focus on charge redistribution across concentric metallic shells.",
  },
  "modern physics": {
    topics: [
      "Photoelectric Effect: Einstein's equation, stopping potential vs frequency graphs",
      "De Broglie Wavelength of accelerated electrons and charged particles",
      "Bohr's Atomic Model: Energy levels, radius, and spectral series transitions",
      "Nuclear Binding Energy Curve, Mass Defect, and Q-value calculations",
      "Radioactivity: Half-life, mean life, and decay rate equations",
    ],
    formulas: [
      "h \\nu = \\phi + e V_s = \\phi + \\frac{1}{2} m v_{max}^2",
      "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m q V}} = \\frac{12.27}{\\sqrt{V}} \\text{ \\AA (for electron)}",
      "E_n = -\\frac{13.6}{n^2} Z^2 \\text{ eV}",
    ],
    tips: "High-scoring, low-error track. Almost every JEE Main shift carries 2 to 3 direct formula questions from Bohr radius and stopping potential.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages = [], exam = "jee-main", chapter = "General Strategy", confidence } = body;

    const systemPrompt = `You are Saathi AI — an expert academic mentor, tutor, and exam strategist for Indian competitive exams (JEE Main, JEE Advanced, and CBSE Class 12 Boards).
You provide clear, authoritative, direct, and pedagogically rich explanations with step-by-step logic, key topic breakdowns, and formulas formatted in clean LaTeX ($...$ and $$...$$).

INSTRUCTIONS:
1. Always directly answer what the user asked. If the user asks for important topics in a chapter (e.g. Current Electricity), immediately list the high-yield topics, core derivations, and recurring question types for CBSE/JEE.
2. Structure your response with clean Markdown headings, bullet points, and LaTeX formulas.
3. Be concise, punchy, and academically precise. Avoid generic fluff.
4. Active context: Target Exam: ${exam.toUpperCase()}, Module: ${chapter}.`;

    const formattedMessages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-8).map((m: any) => ({
        role: (m.role === "user" || m.role === "assistant" ? m.role : "user") as "user" | "assistant",
        content: String(m.content || ""),
      })),
    ];

    if (formattedMessages.length === 1) {
      formattedMessages.push({
        role: "user",
        content: `What are the most important high-yield topics and formula priorities for ${chapter} in ${exam}?`,
      });
    }

    // Call AI with generous 25s timeout and free-tier compatible model
    const aiResult = await callOpenRouter(formattedMessages, {
      model: process.env.OPENROUTER_MODEL_ASSISTANT || "minimax/minimax-m3:free",
      temperature: 0.3,
      maxTokens: 1200,
      timeoutMs: 25000,
    });

    if (aiResult.text && !aiResult.error) {
      return NextResponse.json({
        success: true,
        source: "live_ai",
        provider: aiResult.provider || "openrouter",
        message: {
          role: "assistant",
          content: aiResult.text,
        },
      });
    }

    // Intelligent Fallback: Detect what the user was asking about
    const lastUserMessage = (messages[messages.length - 1]?.content || "").toLowerCase();
    
    // Check if user mentioned a specific chapter in their message
    let matchedChapterKey = "";
    for (const key of Object.keys(CHAPTER_TOPIC_REGISTRY)) {
      if (lastUserMessage.includes(key) || chapter.toLowerCase().includes(key)) {
        matchedChapterKey = key;
        break;
      }
    }

    let fallbackText = "";

    if (matchedChapterKey && CHAPTER_TOPIC_REGISTRY[matchedChapterKey]) {
      const info = CHAPTER_TOPIC_REGISTRY[matchedChapterKey];
      const title = matchedChapterKey.toUpperCase();
      fallbackText = `### ⚡ High-Yield Topics for ${title} (${exam.toUpperCase()} / CBSE 12)\n\n`;
      fallbackText += `Here are the essential, high-frequency concepts based on 10-year PYQ patterns:\n\n`;
      info.topics.forEach((t, i) => {
        fallbackText += `${i + 1}. **${t}**\n`;
      });
      fallbackText += `\n#### 📌 Key Mathematical Relations:\n`;
      info.formulas.forEach((f) => {
        fallbackText += `- ${f}\n`;
      });
      fallbackText += `\n> **Strategic Tip:** ${info.tips}`;
    } else if (lastUserMessage.includes("formula") || lastUserMessage.includes("equation")) {
      fallbackText = `### 📐 Formula Strategy & Precision Protocol\n\n` +
        `For ${chapter} (${exam.toUpperCase()}):\n\n` +
        `1. **Dimensional Consistency Check**: Always check the LHS vs RHS dimensions before final substitution.\n` +
        `2. **Limit Verification**: Test asymptotic bounds (e.g. $t \\to 0$, $t \\to \\infty$, or $\\theta \\to 0$).\n` +
        `3. **Unit Rigor**: Convert to SI base units before entering numericals ($1 \\text{ eV} = 1.6 \\times 10^{-19} \\text{ J}$, $1 \\text{ \\AA} = 10^{-10} \\text{ m}$).`;
    } else {
      fallbackText = `### 🎯 Strategic Revision Directive for ${chapter}\n\n` +
        `To maximize your score in ${exam.toUpperCase()}:\n\n` +
        `1. **Core NCERT Mastery**: Complete all in-text numericals and Exemplar problems.\n` +
        `2. **Historical PYQ Frequency**: Prioritize the top-weighted subtopics identified in the Chapter Analyzer.\n` +
        `3. **Error Logging**: Note sign conventions and negative-marking traps from past 3 years' shifts.`;
    }

    return NextResponse.json({
      success: true,
      source: "deterministic_fallback",
      fallbackReason: aiResult.error || "TIMEOUT_FAILOVER",
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
