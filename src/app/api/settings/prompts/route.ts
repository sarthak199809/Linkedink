import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_REVERSE_ENGINEER_PROMPT } from "@/lib/gemini";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const activePrompt = await prisma.reverseEngineerPrompt.findFirst({
            where: { isActive: true },
            orderBy: { version: "desc" },
        });

        return NextResponse.json({
            prompt: activePrompt?.promptText || DEFAULT_REVERSE_ENGINEER_PROMPT,
            isCustom: !!activePrompt
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch prompt" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { promptText, reset } = await req.json();

        if (reset) {
            await prisma.reverseEngineerPrompt.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
            return NextResponse.json({ success: true, prompt: DEFAULT_REVERSE_ENGINEER_PROMPT });
        }

        if (!promptText) {
            return NextResponse.json({ error: "Prompt text is required" }, { status: 400 });
        }

        // Set other prompts to inactive
        await prisma.reverseEngineerPrompt.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });

        const latest = await prisma.reverseEngineerPrompt.findFirst({
            orderBy: { version: "desc" },
        });

        const newPrompt = await prisma.reverseEngineerPrompt.create({
            data: {
                promptText,
                isActive: true,
                version: (latest?.version || 0) + 1,
            },
        });

        return NextResponse.json({ success: true, prompt: newPrompt.promptText });
    } catch (error) {
        console.error("Prompt update error:", error);
        return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
    }
}
