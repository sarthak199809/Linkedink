import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testGeminiConnection } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { apiKey, userId } = await req.json();

    if (!apiKey || !userId) {
      return NextResponse.json({ error: "API key and user ID required" }, { status: 400 });
    }

    // Validate before saving
    const isValid = await testGeminiConnection(apiKey);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key. Connection test failed." }, { status: 400 });
    }

    // Find existing key for this user and provider
    const existingKey = await prisma.apiKey.findFirst({
      where: { userId, provider: "gemini" }
    });

    if (existingKey) {
      await prisma.apiKey.update({
        where: { id: existingKey.id },
        data: {
          apiKey,
          isValid: true,
          testedAt: new Date(),
        }
      });
    } else {
      await prisma.apiKey.create({
        data: {
          userId,
          provider: "gemini",
          apiKey,
          isValid: true,
          testedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save key error:", error);
    return NextResponse.json({ error: "Failed to save API key" }, { status: 500 });
  }
}
