import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * Optimizes a student diagram request into a high-precision textbook diagram prompt using Gemini Free Key
 */
async function optimizeDiagramPromptWithGemini(userPrompt: string, exam: string, chapter: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY_SECONDARY || process.env.GEMINI_API_KEY;
  if (!geminiKey) return userPrompt;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert textbook illustrator for CBSE Class 12 and JEE Main exams.
Convert this student diagram request: "${userPrompt}" (Chapter: ${chapter}, Exam: ${exam}) into a concise, detailed 2D scientific diagram image generation prompt.
Rules:
- Must specify: "Clean 2D scientific textbook illustration, white background, high contrast, labeled parts, technical schematic, no artistic clutter".
- Output ONLY the prompt string, with no quotes, preamble, or explanations.`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 120,
          temperature: 0.2,
        }
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text && text.length > 10) {
        return text;
      }
    }
  } catch (err) {
    console.warn("Gemini prompt optimization fallback:", err);
  }

  return `clean 2D scientific textbook diagram of ${userPrompt}, white background, labeled technical illustration, ${chapter}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { prompt = "", exam = "cbse-12", chapter = "Physics" } = body;

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Use Gemini Free Account to optimize and structure the scientific diagram prompt
    const optimizedPrompt = await optimizeDiagramPromptWithGemini(prompt, exam, chapter);

    // Step 2: Attempt OpenRouter Image API
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey && !openrouterKey.includes("placeholder")) {
      try {
        const orRes = await fetch("https://openrouter.ai/api/v1/images", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "bytedance-seed/seedream-5-0-lite",
            prompt: optimizedPrompt,
            size: "1024x1024",
          }),
        });

        if (orRes.ok) {
          const orData = await orRes.json();
          const imageUrl = orData?.data?.[0]?.url || orData?.data?.[0]?.b64_json;
          if (imageUrl) {
            return NextResponse.json({
              success: true,
              imageUrl,
              source: "openrouter",
              prompt: optimizedPrompt,
              caption: prompt,
            });
          }
        } else {
          const errData = await orRes.json().catch(() => ({}));
          console.warn("[Image Generation] OpenRouter credits depleted or rate-limited:", errData?.error?.message || orRes.status);
          // Failover triggers automatically when OpenRouter credits are depleted
        }
      } catch (orErr) {
        console.warn("[Image Generation] OpenRouter exception:", orErr);
      }
    }

    // Step 3: High-speed Edge CDN Image Synthesis (Zero-credit, instant fallback)
    const encodedPrompt = encodeURIComponent(optimizedPrompt);
    const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=500&nologo=true`;

    return NextResponse.json({
      success: true,
      imageUrl: fallbackImageUrl,
      source: "gemini_optimized_edge_cdn",
      prompt: optimizedPrompt,
      caption: prompt,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
