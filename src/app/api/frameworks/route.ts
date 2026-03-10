import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEmbeddings } from "@/lib/gemini";
import { upsertFramework } from "@/lib/qdrant";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, summary, bestFor, tags, fullData, sourcePostUrl, sourcePostText } = await req.json();

    const userApiKey = await prisma.apiKey.findFirst({
      where: { userId: session.user.id, isValid: true },
    });

    if (!userApiKey) {
      return NextResponse.json({ error: "No valid API key found" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferredEmbeddingModel: true }
    });

    const embedText = title + " " + summary + " " + bestFor + " " + (tags || []).join(" ");
    const embedding = await getEmbeddings(embedText, userApiKey.apiKey, user?.preferredEmbeddingModel);

    const framework = await prisma.framework.create({
      data: {
        userId: session.user.id,
        title,
        summary,
        bestFor,
        tags: tags || [],
        toneProfile: fullData?.tone_profile || [],
        fullData,
        sourcePostUrl,
        sourcePostText,
      },
    });

    await upsertFramework(session.user.id, framework.id, embedding, {
      title,
      summary,
      best_for: bestFor,
      tags,
    });

    return NextResponse.json({ id: framework.id });
  } catch (error: any) {
    console.error("[FrameworkSave] Error:", error);
    return NextResponse.json({
      error: "Failed to save framework",
      details: error.message,
      target: error.stack?.includes("prisma") ? "database" : "qdrant"
    }, { status: 500 });
  }
}
