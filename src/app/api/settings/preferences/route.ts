import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                preferredGenerationModel: true,
                preferredEmbeddingModel: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { preferredGenerationModel, preferredEmbeddingModel } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                preferredGenerationModel,
                preferredEmbeddingModel,
            },
        });

        return NextResponse.json({
            success: true,
            preferences: {
                preferredGenerationModel: updatedUser.preferredGenerationModel,
                preferredEmbeddingModel: updatedUser.preferredEmbeddingModel,
            },
        });
    } catch (error) {
        console.error("Preferences update error:", error);
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }
}
