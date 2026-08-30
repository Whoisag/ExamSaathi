/**
 * ExamSaathi OpenRouter Client Utility
 * Manages API communication with OpenRouter LLM endpoints, timeouts, and fallbacks.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "mock-openrouter-key" || apiKey.includes("placeholder") || apiKey.startsWith("your-")) {
    return { text: "", error: "OPENROUTER_API_KEY_NOT_CONFIGURED" };
  }

  const model =
    options.model ||
    process.env.OPENROUTER_MODEL_ANALYSIS ||
    "google/gemini-2.0-flash-001";
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 1500;
  const timeoutMs = options.timeoutMs ?? 5000;

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
      return { text: "", error: `OpenRouter HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return { text: content };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { text: "", error: errorMsg };
  }
}
