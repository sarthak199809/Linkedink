import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CopyButton from "@/components/CopyButton";

export default async function PostsPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return null;

    const posts = await prisma.generatedPost.findMany({
        where: { userId: session.user.id },
        include: { framework: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tight">Your Creations</h1>
                <span className="brutal-tag px-4 py-2 font-bold">{posts.length} POSTS</span>
            </div>

            {posts.length === 0 ? (
                <div className="brutal-card p-20 text-center bg-white border-black">
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No posts generated yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="brutal-card bg-white overflow-hidden flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Generated on {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <CopyButton text={post.generatedPost} />
                                </div>

                                <h3 className="text-sm font-bold uppercase mb-4 text-accent bg-black inline-block px-2 py-0.5">
                                    Framework: {post.framework.title}
                                </h3>

                                <div className="whitespace-pre-wrap font-body text-lg leading-relaxed text-gray-800">
                                    {post.generatedPost}
                                </div>
                            </div>

                            <div className="border-t-2 border-black p-4 bg-gray-50 flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Match Score</span>
                                    <div className="w-32 h-2 bg-gray-200 border border-black overflow-hidden">
                                        <div
                                            className="h-full bg-accent"
                                            style={{ width: `${(post.matchScore || 0) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold">{Math.round((post.matchScore || 0) * 100)}%</span>
                                </div>

                                {post.wasEdited && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-black bg-white">
                                        Edited
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
