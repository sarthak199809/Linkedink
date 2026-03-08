import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FrameworkList from "@/components/FrameworkList";
import PromptEditorToggle from "@/components/PromptEditorToggle";

export default async function FrameworksPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  const frameworks = await prisma.framework.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-bold tracking-tight uppercase">Frameworks</h1>
        <Link href="/frameworks/add" className="brutal-btn brutal-btn-accent">
          + ADD NEW FRAMEWORK
        </Link>
      </div>

      <div className="mb-10">
        <PromptEditorToggle />
      </div>

      {frameworks.length === 0 ? (
        <div className="brutal-card p-16 text-center bg-white">
          <div className="text-7xl mb-6 opacity-20 select-none">░</div>
          <h2 className="text-2xl font-bold mb-4 uppercase">No Frameworks Yet</h2>
          <p className="mb-8 text-gray-600 max-w-md mx-auto font-medium">
            Your framework library is empty. Start by reverse-engineering a LinkedIn post to build your writing library.
          </p>
          <Link href="/frameworks/add" className="brutal-btn">
            + ADD YOUR FIRST FRAMEWORK
          </Link>
        </div>
      ) : (
        <FrameworkList frameworks={frameworks} />
      )}
    </div>
  );
}
