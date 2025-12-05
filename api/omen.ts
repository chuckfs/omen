import type { VercelRequest, VercelResponse } from "@vercel/node";

const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  throw new Error("Missing HuggingFace API key (HF_API_KEY).");
}

// Replace this with Mistral 7B endpoint:
const HF_MODEL =
  "https://router.huggingface.co/mistralai/Mistral-7B-Instruct-v0.3";

// Helper: Make HF API request
async function queryHuggingFace(prompt: string) {
  const response = await fetch(HF_MODEL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    throw new Error(`HF API error: ${await response.text()}`);
  }

  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { query, location, spiritualPractice } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Missing query field." });
    }

    const spiritLine = spiritualPractice
      ? `The user practices: ${spiritualPractice}. Tailor the cultural or spiritual interpretation toward that background if appropriate.`
      : "";

    const locationLine =
      location && location.latitude && location.longitude
        ? `The user is located at latitude ${location.latitude}, longitude ${location.longitude}. If relevant folklore from this region exists, include it in the indigenous interpretation.`
        : "";

    const fullPrompt = `
You are Omen, a spiritual symbologist. Analyze the symbol:

"${query}"

Return a structured JSON object with EXACTLY these fields:

{
  "name": string,
  "interpretations": {
    "indigenous": string,
    "cultural": string,
    "psychological": string
  },
  "history": string
}

Guidelines:
- Be concise but meaningful.
- Avoid fictional cultures.
- Indigenous interpretation = folklore, spiritual, mythic meanings.
- Cultural interpretation = modern society meaning.
- Psychological interpretation = subconscious, archetypes, Jungian symbolism.
- History = origin + how the symbol evolved.

${spiritLine}
${locationLine}

Respond ONLY with JSON. No prose outside JSON.
`;

    const result = await queryHuggingFace(fullPrompt);

    // Normalize HuggingFace router output formats
    let text = "";

    // Log raw result for debugging in Vercel
    console.log("HF raw result:", result);

    if (Array.isArray(result) && result[0]?.generated_text) {
      text = result[0].generated_text;
    } else if (result.generated_text) {
      text = result.generated_text;
    } else if (typeof result === "string") {
      text = result;
    } else {
      text = JSON.stringify(result);
    }

    // Parse the JSON from the model output
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);

    res.status(200).json({
      info: parsed,
      imageUrl: null, // No image for now
    });
  } catch (err: any) {
    console.error("Backend error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to interpret the omen." });
  }
}
