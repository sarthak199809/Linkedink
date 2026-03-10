import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { testGeminiConnection } from "@/lib/gemini";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  const apiKeyData = await prisma.apiKey.findFirst({
    where: { userId: session.user.id, provider: "gemini" },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      preferredGenerationModel: true,
      preferredEmbeddingModel: true,
    },
  });

  return (
    <SettingsForm
      userId={session.user.id}
      email={session.user.email}
      existingApiKey={apiKeyData}
      preferences={{
        generationModel: user?.preferredGenerationModel || "gemini-2.5-pro",
        embeddingModel: user?.preferredEmbeddingModel || "gemini-embedding-001",
      }}
    />
  );
}
