/**
 * ExamSaathi Multi-Provider AI Engine with Automatic Failover
 * Primary: OpenRouter
 * Backup / Secondary: HaiMaker AI (automatically triggered if OpenRouter is depleted, 402, 429, or fails)
 * Final Fallback: Ground-Truth Deterministic Engine
 */

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
 * Calls HaiMaker AI endpoint as backup provider
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
 * Cascading AI Executor:
 * 1. Attempts OpenRouter
 * 2. If depleted (402), rate-limited (429), or failed -> automatically fails over to HaiMaker AI
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: CallOpenRouterOptions = {}
): Promise<{ text: string; error?: string; provider?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const isOpenRouterUsable =
    apiKey &&
    apiKey !== "mock-openrouter-key" &&
    !apiKey.includes("placeholder") &&
    !apiKey.startsWith("your-");

  if (!isOpenRouterUsable) {
    // OpenRouter unconfigured -> Try HaiMaker AI immediately
    const haimakerRes = await callHaiMakerBackup(messages, options);
    if (haimakerRes.text) {
      return haimakerRes;
    }
    return { text: "", error: "OPENROUTER_AND_HAIMAKER_NOT_CONFIGURED", provider: "none" };
  }

  const model =
    options.model ||
    process.env.OPENROUTER_MODEL_ANALYSIS ||
    "minimax/minimax-m3:free";
  const temperature = options.temperature ?? 0.3;
  const maxTokens = options.maxTokens ?? 1500;
  const timeoutMs = options.timeoutMs ?? 25000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Resilient OpenRouter model routing array: if primary hits 429 rate limit, upstream automatically fails over
    const modelsList = [
      model,
      "minimax/minimax-m3:free",
      "nvidia/nemotron-3.5-lightning:free",
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

    // If OpenRouter credits are depleted (402 Payment Required) or rate limited (429) or 5xx server error:
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[OpenRouter] Call failed (${res.status}: ${errText}). Failing over to HaiMaker backup...`);

      // Cascading Failover to HaiMaker AI
      const haimakerRes = await callHaiMakerBackup(messages, options);
      if (haimakerRes.text) {
        return haimakerRes;
      }

      return { text: "", error: `OpenRouter HTTP ${res.status}, HaiMaker error: ${haimakerRes.error}`, provider: "none" };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return { text: content, provider: "openrouter" };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[OpenRouter] Connection error (${errorMsg}). Failing over to HaiMaker backup...`);

    // Cascading Failover to HaiMaker AI
    const haimakerRes = await callHaiMakerBackup(messages, options);
    if (haimakerRes.text) {
      return haimakerRes;
    }

    return { text: "", error: `OpenRouter exception (${errorMsg}), HaiMaker: ${haimakerRes.error}`, provider: "none" };
  }
}
