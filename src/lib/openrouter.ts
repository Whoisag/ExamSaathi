/**
 * ExamSaathi Multi-Tier AI Engine with Automatic Failover:
 * 1) Tier 1: Google Gemini (High-performance direct API)
 * 2) Tier 2: OpenRouter (Multi-model free/paid routing array)
 * 3) Tier 3: HaiMaker AI (Failover backup)
 * Final Fallback: Ground-Truth Deterministic Academic Knowledge Base
 */

const GEMINI_OPENAI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const HAIMAKER_DEFAULT_URL = process.env.HAIMAKER_BASE_URL || "https://api.haimaker.ai/v1/chat/completions";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallOpenRouterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  responseFormat?: { type: "json_object" } | undefined;
}

/**
 * Tier 1: Calls Google Gemini API
 */
async function callGeminiPrimary(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string; provider: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey.includes("placeholder") || geminiKey.startsWith("your-")) {
    return { text: "", error: "GEMINI_API_KEY_NOT_CONFIGURED", provider: "gemini" };
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 4096;
  const timeoutMs = options.timeoutMs ?? 16000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Convert system/user messages to Gemini native format
    let systemInstruction: string | undefined = undefined;
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const m of messages) {
      if (m.role === "system") {
        systemInstruction = systemInstruction ? `${systemInstruction}\n\n${m.content}` : m.content;
      } else {
        contents.push({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    }

    if (contents.length === 0 && systemInstruction) {
      contents.push({
        role: "user",
        parts: [{ text: systemInstruction }],
      });
      systemInstruction = undefined;
    }

    const payload: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    if (options.responseFormat?.type === "json_object") {
      (payload.generationConfig as Record<string, unknown>).responseMimeType = "application/json";
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return { text: "", error: `Gemini HTTP ${res.status}: ${errText}`, provider: "gemini" };
    }

    const data = await res.json();
    const candidatePart = data?.candidates?.[0]?.content?.parts?.find((p: any) => typeof p.text === "string");
    const content = candidatePart?.text || "";
    return { text: content, provider: "gemini" };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { text: "", error: `Gemini exception: ${errorMsg}`, provider: "gemini" };
  }
}

/**
 * Tier 3: Calls HaiMaker AI endpoint as backup provider
 */
async function callHaiMakerBackup(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string; provider: string }> {
  const haimakerKey = process.env.HAIMAKER_API_KEY;
  if (!haimakerKey || haimakerKey.includes("placeholder") || haimakerKey.startsWith("your-")) {
    return { text: "", error: "HAIMAKER_API_KEY_NOT_CONFIGURED", provider: "haimaker" };
  }

  const model =
    process.env.HAIMAKER_MODEL ||
    options.model ||
    "haimaker-default";
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 1000;
  const timeoutMs = options.timeoutMs ?? 4000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (options.responseFormat) {
      payload.response_format = options.responseFormat;
    }

    const res = await fetch(HAIMAKER_DEFAULT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${haimakerKey}`,
        "X-Title": "ExamSaathi Backup AI",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return { text: "", error: `HaiMaker HTTP ${res.status}: ${errText}`, provider: "haimaker" };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || data?.text || "";
    return { text: content, provider: "haimaker" };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { text: "", error: `HaiMaker exception: ${errorMsg}`, provider: "haimaker" };
  }
}

/**
 * Tier 2: Calls OpenRouter API
 */
async function callOpenRouterDirect(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string; provider: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const isOpenRouterUsable =
    apiKey &&
    apiKey !== "mock-openrouter-key" &&
    !apiKey.includes("placeholder") &&
    !apiKey.startsWith("your-");

  if (!isOpenRouterUsable) {
    return { text: "", error: "OPENROUTER_API_KEY_NOT_CONFIGURED", provider: "openrouter" };
  }

  const model =
    options.model ||
    process.env.OPENROUTER_MODEL_ANALYSIS ||
    "google/gemini-2.0-flash-lite-001";
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 2048;
  const timeoutMs = options.timeoutMs ?? 12000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const modelsList = [
      model,
      "google/gemini-2.0-flash-lite-001",
      "meta-llama/llama-3.3-70b-instruct:free",
      "minimax/minimax-m3:free",
    ];
    const uniqueModels = Array.from(new Set(modelsList.filter(Boolean)));

    const payload: Record<string, unknown> = {
      models: uniqueModels,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (options.responseFormat) {
      payload.response_format = options.responseFormat;
    }

    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://examsaathi.in",
        "X-Title": "ExamSaathi Academic Intelligence",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return { text: "", error: `OpenRouter HTTP ${res.status}: ${errText}`, provider: "openrouter" };
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content || "";
    return { text: rawContent, provider: "openrouter" };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { text: "", error: `OpenRouter exception: ${errorMsg}`, provider: "openrouter" };
  }
}

/**
 * Cleans thinking processes, scratchpads, and reasoning blocks from LLM responses.
 * If the model returned only a thinking process without the actual answer, returns empty string to trigger fallback.
 */
export function cleanAiResponse(text: string): string {
  if (!text) return "";

  // 1. Remove standard XML-style think tags
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 2. Remove thinking process prefix if followed by the actual answer
  const thinkMarkerRegex = /^(?:Here['\u2019\u0027]?s a thinking process:?|Thinking Process:?|\*+Thinking Process\*+:?)/i;
  if (thinkMarkerRegex.test(cleaned)) {
    const markerPatterns = [
      /\n\s*---\s*\n/,
      /\n(?=#{1,4}\s+)/,
      /\n(?=(?:Here (?:is|are|below)|Top \d|Based on|For |The |To answer)\b)/i,
      /\n(?=\*\*(?:Top \d|[A-Z0-9\s]{3,30})\*\*)/,
    ];

    let splitIndex = -1;
    for (const pat of markerPatterns) {
      const match = cleaned.match(pat);
      if (match && match.index && match.index > 20) {
        if (splitIndex === -1 || match.index < splitIndex) {
          splitIndex = match.index;
        }
      }
    }

    if (splitIndex !== -1) {
      const actualContent = cleaned.slice(splitIndex).trim();
      if (actualContent.length > 40) {
        return actualContent;
      }
    }

    return "";
  }

  return cleaned.trim();
}

/**
 * Multi-Tier Cascading AI Executor:
 * 1) Attempts Gemini (Tier 1)
 * 2) Fails over to OpenRouter (Tier 2)
 * 3) Fails over to HaiMaker AI (Tier 3)
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string; provider?: string }> {
  // 1) Tier 1: Google Gemini
  const geminiRes = await callGeminiPrimary(messages, options);
  if (geminiRes.text && !geminiRes.error) {
    const cleaned = cleanAiResponse(geminiRes.text);
    if (cleaned) {
      return { text: cleaned, provider: "gemini" };
    }
    console.warn("[AI Gateway] Gemini output was only thinking scratchpad. Falling over to Tier 2 (OpenRouter)...");
  } else if (geminiRes.error !== "GEMINI_API_KEY_NOT_CONFIGURED") {
    console.warn(`[AI Gateway] Tier 1 (Gemini) unavailable (${geminiRes.error}). Failing over to Tier 2 (OpenRouter)...`);
  }

  // 2) Tier 2: OpenRouter
  const openrouterRes = await callOpenRouterDirect(messages, options);
  if (openrouterRes.text && !openrouterRes.error) {
    const cleaned = cleanAiResponse(openrouterRes.text);
    if (cleaned) {
      return { text: cleaned, provider: "openrouter" };
    }
    console.warn("[AI Gateway] OpenRouter output was only thinking scratchpad. Falling over to Tier 3 (HaiMaker)...");
  } else {
    console.warn(`[AI Gateway] Tier 2 (OpenRouter) unavailable (${openrouterRes.error}). Failing over to Tier 3 (HaiMaker)...`);
  }

  // 3) Tier 3: HaiMaker AI
  const haimakerRes = await callHaiMakerBackup(messages, options);
  if (haimakerRes.text && !haimakerRes.error) {
    const cleaned = cleanAiResponse(haimakerRes.text);
    if (cleaned) {
      return { text: cleaned, provider: "haimaker" };
    }
  }

  return {
    text: "",
    error: `All AI tiers exhausted. Gemini: ${geminiRes.error || "empty"}, OpenRouter: ${openrouterRes.error || "empty"}, HaiMaker: ${haimakerRes.error || "empty"}`,
    provider: "none",
  };
}
