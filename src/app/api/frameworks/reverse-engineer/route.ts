import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWithGemini, DEFAULT_REVERSE_ENGINEER_PROMPT } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { input, mode, promptText } = body;

    // Support both old {input, mode} and new {url, text} formats if needed
    const finalInput = input || body.text || body.url;

    if (!finalInput) {
      return NextResponse.json({ error: "Input data (URL or Text) is required" }, { status: 400 });
    }

    const userApiKey = await prisma.apiKey.findFirst({
      where: { userId: session.user.id, isValid: true },
    });

    if (!userApiKey) {
      return NextResponse.json({ error: "No valid API key found. Add one in Settings." }, { status: 400 });
    }

    let activePromptContent = promptText;

    if (!activePromptContent) {
      const savedPrompt = await prisma.reverseEngineerPrompt.findFirst({
        where: { isActive: true },
        orderBy: { version: "desc" },
      });
      activePromptContent = savedPrompt?.promptText || DEFAULT_REVERSE_ENGINEER_PROMPT;
      console.log(`[ReverseEngineer] Using ${savedPrompt ? 'saved' : 'default'} prompt`);
    } else {
      console.log(`[ReverseEngineer] Using manually provided prompt override`);
    }

    const result = await generateWithGemini(finalInput, userApiKey.apiKey, activePromptContent);

    let framework;
    try {
      // 1. Extract potential JSON block (first '{' to last '}')
      const start = result.indexOf('{');
      const end = result.lastIndexOf('}');

      if (start === -1 || end === -1 || end < start) {
        throw new Error("No JSON object found in AI response");
      }

      let jsonString = result.substring(start, end + 1);

      // 2. Clean the string
      // Remove trailing commas before closing braces/brackets
      jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');

      // Remove potential comments (// or /* */) if the AI added them
      jsonString = jsonString.replace(/\/\/.*/g, '');
      jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');

      // 3. Attempt parse
      framework = JSON.parse(jsonString);
    } catch (err) {
      console.error("[ReverseEngineer] Parsing failed. Error:", err, "Raw result snippet:", result.slice(0, 500));
      return NextResponse.json({
        error: "Failed to parse the writing framework. The AI response was malformed.",
        details: err instanceof Error ? err.message : String(err),
        debug: result.length > 500 ? result.slice(0, 500) + "..." : result
      }, { status: 500 });
    }

    return NextResponse.json({ framework });
  } catch (error) {
    console.error("[ReverseEngineer] Fatal route error:", error);
    return NextResponse.json({
      error: "A server error occurred during analysis",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
