import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getEmbeddings(text: string, apiKey: string, modelName: string = "gemini-embedding-001"): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.embedContent(text);
  const embedding = result.embedding;

  return embedding.values;
}

export async function generateWithGemini(
  prompt: string,
  apiKey: string,
  systemInstruction?: string,
  modelName: string = "gemini-2.5-pro"
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName
  });

  const fullPrompt = systemInstruction
    ? systemInstruction + "\n\n" + prompt
    : prompt;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;

  return response.text();
}

export async function testGeminiConnection(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContent("Hello");
    return result.response.text().length > 0;
  } catch (error) {
    console.error("Gemini test failed:", error);
    return false;
  }
}

export const DEFAULT_REVERSE_ENGINEER_PROMPT = `You are an expert at analyzing LinkedIn posts to extract their underlying writing frameworks.

Analyze the following LinkedIn post and extract a JSON framework. 

IMPORTANT: Return ONLY valid JSON. Do not include markdown code blocks (no \`\`\`json).

The JSON must follow this exact structure:
{
  "title": "Short catchy name for this framework",
  "summary": "2-3 sentence description of what makes this post work",
  "best_for": "What type of ideas/messages this framework is best for",
  "tags": ["relevant", "tags"],
  "tone_profile": ["professional", "storytelling"],
  "macro_structure": {
    "opening_hook": "How the post starts",
    "body_sections": ["section 1 details", "section 2 details"],
    "closing": "How it ends"
  },
  "micro_techniques": {
    "word_count_range": "e.g., 800-1200",
    "sentence_style": "short/long/mixed",
    "punctuation_patterns": "em-dashes, bullets, etc",
    "emotional_hooks": ["hook1", "hook2"]
  },
  "example_phrases": ["phrase1", "phrase2"]
}`;
