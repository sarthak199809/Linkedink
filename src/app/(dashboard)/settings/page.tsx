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

  const apiKey = await prisma.apiKey.findFirst({
    where: { userId: session.user.id, provider: "gemini" },
    orderBy: { createdAt: "desc" },
  });

  return <SettingsForm userId={session.user.id} email={session.user.email} existingApiKey={apiKey} />;
}
