// Elevator Talk のAIフィードバック用 中継サーバー（Cloudflare Workers）
//
// 必要な設定（Cloudflare の管理画面で登録する。コードには書かない）
//   GEMINI_API_KEY  … シークレット。Google AI Studio で発行したAPIキー
//   GEMINI_MODEL    … 変数（任意）。使うモデル名。未設定なら DEFAULT_MODEL
//   ALLOW_LOCALHOST … 変数（任意）。"true" にすると localhost からの動作確認を許可

const ALLOWED_ORIGINS = ["https://salty-en-jp.github.io"];
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_CHARS = 1200;

const SYSTEM_PROMPT = `あなたは英語を学ぶ日本人のための、やさしい英会話コーチです。
学習者が「エレベータートーク」（30秒程度で、決められたテーマについて英語で話し切る練習）で話した英文を読み、フィードバックを返します。
話し言葉を文字起こししたものなので、句読点や大文字小文字の乱れ、言いよどみは指摘しないでください。

- good_points: よかったところを最大3つ。日本語で、具体的に。
- improvements: 文法の誤りや、意味は通じるが不自然な表現だけを最大3つ。
  - original: 学習者が実際に書いた文（または句）をそのまま引用する
  - natural: 自然な言い方。学習者のレベルに合った、短く簡単な英語にする
  - reason: なぜ不自然かを日本語で1文
- 直すところがなければ improvements は空の配列にする。無理に指摘を作らない。`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    good_points: { type: "ARRAY", items: { type: "STRING" } },
    improvements: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          original: { type: "STRING" },
          natural: { type: "STRING" },
          reason: { type: "STRING" }
        },
        required: ["original", "natural", "reason"]
      }
    }
  },
  required: ["good_points", "improvements"]
};

function isAllowed(origin, env) {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return env.ALLOW_LOCALHOST === "true" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
  });
}

function clean(list, max, mapItem) {
  return (Array.isArray(list) ? list : []).slice(0, max).map(mapItem).filter(Boolean);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = isAllowed(origin, env);
    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: allowed ? 204 : 403, headers: cors });
    }
    if (!allowed) return json({ error: "forbidden" }, 403, cors);
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, cors);
    if (!env.GEMINI_API_KEY) return json({ error: "not_configured" }, 500, cors);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "bad_request" }, 400, cors);
    }

    const text = String(body.text || "").trim();
    if (text.length < 3 || text.length > MAX_CHARS) {
      return json({ error: "invalid_length" }, 400, cors);
    }
    const theme = String(body.theme || "").slice(0, 50);
    const level = [1, 2, 3].includes(Number(body.level)) ? Number(body.level) : 1;
    const templates = clean(body.templates, 3, (t) => String(t).slice(0, 100));

    const userPrompt = [
      `テーマ: ${theme}`,
      `レベル: ${level}（1=型を3つ使う、2=最初の型だけ、3=型なし）`,
      templates.length ? `使えるセリフの型: ${templates.join(" / ")}` : "セリフの型: なし",
      "学習者の英文:",
      text
    ].join("\n");

    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    let upstream;
    try {
      upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA
            }
          })
        }
      );
    } catch (e) {
      return json({ error: "upstream_unreachable" }, 502, cors);
    }

    if (!upstream.ok) {
      // 429 は無料枠の上限に達したとき
      return json({ error: "upstream", status: upstream.status }, upstream.status === 429 ? 429 : 502, cors);
    }

    let feedback;
    try {
      const data = await upstream.json();
      feedback = JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (e) {
      return json({ error: "bad_upstream_response" }, 502, cors);
    }

    return json({
      good_points: clean(feedback.good_points, 3, (g) => String(g).slice(0, 300)),
      improvements: clean(feedback.improvements, 3, (i) =>
        i && i.original && i.natural
          ? {
              original: String(i.original).slice(0, 300),
              natural: String(i.natural).slice(0, 300),
              reason: String(i.reason || "").slice(0, 300)
            }
          : null
      )
    }, 200, cors);
  }
};
