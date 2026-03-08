"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Framework {
    id: string;
    title: string;
    summary: string;
    bestFor: string | null;
    tags: string[];
}

interface Props {
    frameworks: Framework[];
}

export default function FrameworkList({ frameworks: initialFrameworks }: Props) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this framework?")) return;

        try {
            const res = await fetch(`/Linkedink/api/frameworks/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete framework");
            }
        } catch {
            alert("Something went wrong");
        }
    };

    return (
        <div className="space-y-6">
            {initialFrameworks.map((framework) => (
                <div key={framework.id} className="brutal-card p-6 transition-transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{framework.title}</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">{framework.summary}</p>
                            {framework.bestFor && (
                                <div className="mb-4">
                                    <span className="font-bold text-sm uppercase text-gray-500 block mb-1">Best for</span>
                                    <p className="text-sm font-medium">{framework.bestFor}</p>
                                </div>
                            )}
                            <div className="flex gap-2 flex-wrap">
                                {framework.tags.map((tag) => (
                                    <span key={tag} className="brutal-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-3">
                            <Link
                                href={`/frameworks/${framework.id}`}
                                className="brutal-btn text-center text-sm px-6"
                            >
                                VIEW
                            </Link>
                            <button
                                onClick={() => handleDelete(framework.id)}
                                className="brutal-btn brutal-btn-danger text-sm px-6"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
