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
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-heading">
          Welcome back 👋
        </h1>
        <p className="text-body mt-1">Here&apos;s your content overview</p>
      </div>

      {!hasApiKey && (
        <div className="card p-6 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-heading">Setup Required</h2>
              <p className="text-sm text-body">Add your Gemini API key to enable AI features.</p>
            </div>
          </div>
          <Link href="/settings" className="btn-accent inline-flex items-center gap-2 text-sm mt-2">
            Configure API Key
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h8M8 4l3 3-3 3" /></svg>
          </Link>
        </div>
      )}

      {frameworkCount === 0 ? (
        <div className="card p-16 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3 text-heading">Your library is empty</h2>
          <p className="mb-8 text-body max-w-sm leading-relaxed">
            Start your journey by adding a LinkedIn post to reverse-engineer into a reusable writing framework.
          </p>
          <Link href="/frameworks/add" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
            <span>+</span> Add Your First Framework
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card p-6 hover:shadow-card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <span className="text-xl">🔬</span>
                </div>
                <span className="text-sm font-semibold text-body uppercase tracking-wider">Library Size</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-heading tracking-tight">{frameworkCount}</p>
                <span className="font-semibold text-muted text-sm">frameworks</span>
              </div>
            </div>
            <div className="card p-6 hover:shadow-card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <span className="text-sm font-semibold text-body uppercase tracking-wider">Output Total</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-heading tracking-tight">{postCount}</p>
                <span className="font-semibold text-muted text-sm">posts</span>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold font-heading text-heading">Recent Creations</h2>
                <Link href="/posts" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="card p-5 hover:shadow-card-hover group">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-medium text-heading flex-1 line-clamp-2 pr-4 leading-relaxed">{post.generatedPost}</p>
                      <CopyButton text={post.generatedPost} />
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-border">
                      <span className="brutal-tag text-[10px]">
                        {post.framework.title}
                      </span>
                      {post.matchScore && (
                        <span className="text-xs font-semibold text-muted">
                          {Math.round(post.matchScore * 100)}% match
                        </span>
                      )}
                      <span className="text-[10px] text-muted font-medium ml-auto">
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
