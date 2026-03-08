import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  const [frameworkCount, postCount, recentPosts] = await Promise.all([
    prisma.framework.count({ where: { userId: session.user.id } }),
    prisma.generatedPost.count({ where: { userId: session.user.id } }),
    prisma.generatedPost.findMany({
      where: { userId: session.user.id },
      include: { framework: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const hasApiKey = await prisma.apiKey.findFirst({
    where: { userId: session.user.id, isValid: true },
  });

  return (
    <div>
      {!hasApiKey && (
        <div className="brutal-card p-6 mb-10 bg-accent border-black">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-bold uppercase">Action Required</h2>
          </div>
          <p className="mb-6 font-medium">
            Your Gemini API key is missing or invalid. Please add it in settings to enable AI features.
          </p>
          <Link href="/settings" className="brutal-btn inline-block">
            CONFIGURE API KEY
          </Link>
        </div>
      )}

      {frameworkCount === 0 ? (
        <div className="brutal-card p-20 text-center flex flex-col items-center justify-center bg-white border-black">
          <div className="text-8xl mb-8 opacity-20 select-none">░</div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">Your library is empty</h2>
          <p className="mb-10 text-gray-600 max-w-sm font-medium leading-relaxed">
            Start your journey by adding a LinkedIn post to reverse-engineer into a reusable writing framework.
          </p>
          <Link href="/frameworks/add" className="brutal-btn brutal-btn-accent shadow-xl hover:scale-105 transition-transform">
            + ADD YOUR FIRST FRAMEWORK
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="brutal-card p-8 hover:-translate-x-1 hover:-translate-y-1 transition-transform cursor-default">
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Library Size</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-bold tracking-tighter">{frameworkCount}</p>
                <span className="font-bold text-gray-400">FRAMEWORKS</span>
              </div>
            </div>
            <div className="brutal-card p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-default">
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Output Total</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-6xl font-bold tracking-tighter">{postCount}</p>
                <span className="font-bold text-gray-400">POSTS</span>
              </div>
            </div>
          </div>

          {recentPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Recent Creations</h2>
                <Link href="/posts" className="text-sm font-bold underline hover:text-gray-600">VIEW ALL</Link>
              </div>
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="brutal-card p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-medium flex-1 line-clamp-2 pr-4">{post.generatedPost}</p>
                      <CopyButton text={post.generatedPost} />
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <span className="brutal-tag text-[10px] bg-white">
                        {post.framework.title}
                      </span>
                      {post.matchScore && (
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                          Match: {Math.round(post.matchScore * 100)}%
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 font-medium ml-auto">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
