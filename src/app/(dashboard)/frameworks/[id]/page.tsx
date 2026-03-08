import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function FrameworkDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) return null;

    const framework = await prisma.framework.findFirst({
        where: { id: params.id, userId: session.user.id },
    });

    if (!framework) notFound();

    const data = framework.fullData as any;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <Link href="/frameworks" className="inline-block mb-8 brutal-btn bg-white text-black border-2 border-black hover:bg-gray-100 uppercase text-xs font-bold">
                ← Back to Library
            </Link>

            <div className="brutal-card p-10 bg-white mb-10">
                <div className="mb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{framework.title}</h1>
                    <div className="flex gap-2 flex-wrap mb-6">
                        {framework.tags.map((tag: string) => (
                            <span key={tag} className="brutal-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-xl font-bold uppercase mb-3 flex items-center gap-2">
                            <span className="w-2 h-6 bg-accent border border-black inline-block"></span>
                            Summary
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-800 font-medium">{framework.summary}</p>
                    </section>

                    {framework.bestFor && (
                        <section>
                            <h2 className="text-xl font-bold uppercase mb-3 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary border border-black inline-block"></span>
                                Best For
                            </h2>
                            <div className="p-4 bg-accent/10 border-2 border-dashed border-black">
                                <p className="text-md font-bold">{framework.bestFor}</p>
                            </div>
                        </section>
                    )}

                    {/* Core Forensic Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="brutal-card p-6 bg-[#f9f9f9]">
                            <h3 className="text-lg font-bold uppercase mb-4 border-b-2 border-black pb-2">Tone Profile</h3>
                            <div className="flex flex-wrap gap-2">
                                {framework.toneProfile.map((tone: string) => (
                                    <span key={tone} className="px-3 py-1 bg-white border border-black text-xs font-bold uppercase tracking-wider">{tone}</span>
                                ))}
                            </div>
                        </div>

                        <div className="brutal-card p-6 bg-[#f9f9f9]">
                            <h3 className="text-lg font-bold uppercase mb-4 border-b-2 border-black pb-2">Macro Structure</h3>
                            <div className="space-y-4 text-sm">
                                {data.macro_structure?.narrative_type && (
                                    <div className="mb-2">
                                        <span className="font-bold block uppercase text-[10px] text-gray-400">Narrative Type</span>
                                        <span className="font-bold text-accent bg-black px-2 py-0.5">{data.macro_structure.narrative_type}</span>
                                    </div>
                                )}

                                {data.macro_structure?.phases ? (
                                    <div className="space-y-3 mt-4">
                                        {data.macro_structure.phases.map((phase: any, i: number) => (
                                            <div key={i} className="border-l-2 border-black pl-3 py-1">
                                                <span className="font-bold text-xs uppercase">{phase.phase_name}</span>
                                                <p className="text-[11px] text-gray-600 italic mb-1">{phase.phase_purpose}</p>
                                                <p className="text-xs">{phase.what_goes_here}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {data.macro_structure?.opening_hook && (
                                            <div>
                                                <span className="font-bold block uppercase text-[10px] text-gray-500">Opening</span>
                                                <p>{data.macro_structure.opening_hook}</p>
                                            </div>
                                        )}
                                        {data.macro_structure?.body_sections && (
                                            <div>
                                                <span className="font-bold block uppercase text-[10px] text-gray-500">Body</span>
                                                <ul className="list-disc list-inside">
                                                    {data.macro_structure.body_sections.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <section className="brutal-card p-8 bg-black text-white">
                        <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-accent border border-white inline-block"></span>
                            Micro Techniques
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                {data.micro_techniques?.pacing_style && (
                                    <div>
                                        <span className="font-bold block uppercase text-accent mb-1 text-[10px]">Pacing</span>
                                        <p className="text-gray-300">{data.micro_techniques.pacing_style}</p>
                                    </div>
                                )}
                                {data.micro_techniques?.sentence_structure && (
                                    <div>
                                        <span className="font-bold block uppercase text-accent mb-1 text-[10px]">Sentence Structure</span>
                                        <p className="text-gray-300">{data.micro_techniques.sentence_structure}</p>
                                    </div>
                                )}
                                {data.micro_techniques?.word_choice_profile && (
                                    <div>
                                        <span className="font-bold block uppercase text-accent mb-1 text-[10px]">Vocabulary</span>
                                        <p className="text-gray-300">{data.micro_techniques.word_choice_profile}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {data.micro_techniques?.rhetorical_devices && (
                                    <div>
                                        <span className="font-bold block uppercase text-accent mb-1 text-[10px]">Rhetorical Devices</span>
                                        <div className="space-y-2">
                                            {data.micro_techniques.rhetorical_devices.map((device: any, i: number) => (
                                                <div key={i} className="text-xs bg-white/10 p-2 border border-white/20">
                                                    <span className="font-bold block">{device.device}</span>
                                                    <p className="text-white/60 text-[11px]">{device.how_used}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {data.psychological_mechanics && (
                        <section className="brutal-card p-8 bg-[#FFE500]/5 border-accent">
                            <h3 className="text-xl font-bold uppercase mb-6">Psychological Mechanics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(data.psychological_mechanics).map(([key, value]: [string, any]) => (
                                    <div key={key}>
                                        <span className="font-bold block uppercase text-[10px] text-gray-500 mb-1">{key.replace(/_/g, " ")}</span>
                                        <p className="text-sm font-medium leading-snug">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.step_by_step_replication_template && (
                        <section>
                            <h3 className="text-xl font-bold uppercase mb-4">Replication Template</h3>
                            <div className="space-y-2">
                                {data.step_by_step_replication_template.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-start brutal-card p-4 bg-white">
                                        <span className="text-2xl font-black text-accent stroke-black">{i + 1}</span>
                                        <p className="text-sm font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.example_phrases && data.example_phrases.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold uppercase mb-4">Master Phrases</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {data.example_phrases.map((phrase: string, i: number) => (
                                    <div key={i} className="p-4 border-2 border-black bg-white font-mono text-sm italic">
                                        "{phrase}"
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(framework.sourcePostUrl || framework.sourcePostText) && (
                        <section className="pt-10 border-t-2 border-dashed border-black/20">
                            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">Original Reference</h3>
                            <div className="flex flex-wrap gap-4">
                                {framework.sourcePostUrl && (
                                    <a href={framework.sourcePostUrl} target="_blank" className="brutal-btn-accent px-4 py-2 text-xs font-bold uppercase no-underline hover:shadow-none hover:translate-y-0.5">
                                        Source Link ↗
                                    </a>
                                )}
                                {framework.sourcePostText && (
                                    <details className="w-full">
                                        <summary className="text-xs font-bold uppercase text-gray-500 hover:text-black cursor-pointer underline decoration-dotted">View Raw Content</summary>
                                        <div className="mt-4 p-6 bg-gray-50 border-2 border-black text-sm whitespace-pre-wrap leading-relaxed shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                                            {framework.sourcePostText}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
