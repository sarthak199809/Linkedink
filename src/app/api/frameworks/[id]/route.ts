import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFrameworkFromQdrant } from "@/lib/qdrant";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const framework = await prisma.framework.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!framework) {
      return NextResponse.json({ error: "Framework not found" }, { status: 404 });
    }

    await prisma.framework.delete({
      where: { id: params.id },
    });

    try {
      await deleteFrameworkFromQdrant(params.id);
    } catch (qErr) {
      console.warn("Failed to delete from Qdrant, but Prisma delete succeeded:", qErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete framework" }, { status: 500 });
  }
}
