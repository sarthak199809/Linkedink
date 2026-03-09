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
        <h1 className="text-3xl font-bold font-heading text-heading">Frameworks</h1>
        <Link href="/frameworks/add" className="btn-primary text-sm flex items-center gap-2">
          <span>+</span> Add Framework
        </Link>
      </div>

      <div className="mb-8">
        <PromptEditorToggle />
      </div>

      {frameworks.length === 0 ? (
        <div className="card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🔬</span>
          </div>
          <h2 className="text-xl font-bold font-heading mb-3 text-heading">No Frameworks Yet</h2>
          <p className="mb-6 text-body max-w-md mx-auto text-sm leading-relaxed">
            Your framework library is empty. Start by reverse-engineering a LinkedIn post to build your writing library.
          </p>
          <Link href="/frameworks/add" className="btn-primary inline-flex items-center gap-2">
            <span>+</span> Add Your First Framework
          </Link>
        </div>
      ) : (
        <FrameworkList frameworks={frameworks} />
      )}
    </div>
  );
}
