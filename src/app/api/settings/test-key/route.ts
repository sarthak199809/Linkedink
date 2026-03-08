import { NextResponse } from "next/server";
import { testGeminiConnection } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 400 });
    }

    const isValid = await testGeminiConnection(apiKey);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    return NextResponse.json({ error: "Failed to test connection" }, { status: 500 });
  }
}
