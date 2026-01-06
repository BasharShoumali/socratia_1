import { askGemini } from "./gemini.client.js";

console.log("[AI] Socratic service loaded");

/* =========================
   SOCRATIC SESSION
========================= */
export async function runSocraticSession({
  fileBuffer,
  mimeType,
  chatHistory = [],
}) {
  console.log("[AI] Running Socratic session");

  if (!fileBuffer || !mimeType) {
    throw new Error("Missing file data");
  }

  const systemPrompt = `
You are a Socratic tutor.

PRIMARY GOAL:
- Help the user understand the document through guided questioning ONLY.

STYLE CONSTRAINTS (STRICT):
- Respond in ONE question only.
- Use at most 1–2 very short sentences.
- Be precise and specific; avoid broad or vague questions.
- No introductions, no summaries, no filler, no encouragement phrases.

BEHAVIOR RULES (NON-NEGOTIABLE):
- You NEVER explain concepts.
- You NEVER provide answers.
- You NEVER summarize any part of the document.
- You ONLY ask questions.
- Every response must be a question.

DOCUMENT USAGE:
- The document is PRIVATE.
- Use it ONLY internally to guide your questions.
`;

  const reply = await askGemini({
    prompt: systemPrompt,
    fileBuffer,
    mimeType,
    messages: chatHistory,
  });

  if (!reply) {
    throw new Error("Gemini returned empty response");
  }

  return reply;
}

/* =========================
   COMPARISON SESSION
========================= */
export async function runComparisonSession({ files, chatHistory }) {
  const systemPrompt = `
You are Socrates.
You are comparing TWO academic papers.

Rules:
- Never summarize immediately
- Ask guiding questions
- Focus on differences, not similarities first
- Force evidence-based reasoning
- Ask "Compared to what?" often

Paper A: ${files[0].name}
Paper B: ${files[1].name}
`;

  const reply = await askGemini({
    prompt: systemPrompt,
    files: files.map((f) => ({
      buffer: f.buffer,
      mimeType: f.mimeType,
    })),
    messages: chatHistory,
  });

  if (!reply) {
    throw new Error("Gemini returned empty response");
  }

  return reply;
}
