import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWithGemini, getEmbeddings } from "@/lib/gemini";
import { searchFrameworks } from "@/lib/qdrant";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idea } = await req.json();

    const userApiKey = await prisma.apiKey.findFirst({
      where: { userId: session.user.id, isValid: true },
    });

    if (!userApiKey) {
      return NextResponse.json({ error: "No valid API key found. Add one in Settings." }, { status: 400 });
    }

    const embedding = await getEmbeddings(idea, userApiKey.apiKey);

    const searchResults = await searchFrameworks(session.user.id, embedding, 2);

    if (searchResults.length === 0) {
      return NextResponse.json({ error: "No frameworks found. Add some frameworks first!" }, { status: 400 });
    }

    const topResult = searchResults[0];
    const frameworkId = topResult.payload?.framework_id as string;
    const matchScore = topResult.score || 0;

    const framework = await prisma.framework.findUnique({
      where: { id: frameworkId },
    });

    if (!framework) {
      return NextResponse.json({ error: "Framework not found" }, { status: 404 });
    }

    const fullData = framework.fullData as Record<string, unknown>;
    
    const systemPrompt = `You are an expert LinkedIn post writer. Use this framework to write a post:

Framework: ${framework.title}
Summary: ${framework.summary}
Best for: ${framework.bestFor || "various topics"}

Structure:
${JSON.stringify(fullData.macro_structure || {}, null, 2)}

Techniques:
${JSON.stringify(fullData.micro_techniques || {}, null, 2)}

Write a LinkedIn post that follows this framework exactly. Make it engaging, authentic, and within the word count specified.`;

    const userPrompt = `Write a LinkedIn post about this idea: ${idea}

Requirements:
- Use the framework provided above
- Make it compelling and authentic
- Include a strong hook
- End with engagement`;

    const generatedPost = await generateWithGemini(userPrompt, userApiKey.apiKey, systemPrompt);

    const savedPost = await prisma.generatedPost.create({
      data: {
        userId: session.user.id,
        frameworkId: framework.id,
        ideaInput: idea,
        generatedPost: generatedPost,
        matchScore: matchScore,
      },
    });

    return NextResponse.json({
      post: generatedPost,
      framework: { title: framework.title },
      score: matchScore,
      id: savedPost.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate post" }, { status: 500 });
  }
}
