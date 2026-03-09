"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddFrameworkPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"url" | "text">("url");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [tags, setTags] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  useEffect(() => {
    // Fetch active prompt on load
    fetch("/Linkedink/api/settings/prompts")
      .then(res => res.json())
      .then(data => {
        if (data.prompt) setCustomPrompt(data.prompt);
      })
      .catch(err => console.error("Failed to fetch prompt:", err));
  }, []);

  const handleReverseEngineer = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setStep(1);

    try {
      const res = await fetch("/Linkedink/api/frameworks/reverse-engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode, promptText: customPrompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.framework);
        setTitle(data.framework.title || "");
        setSummary(data.framework.summary || "");
        setBestFor(data.framework.best_for || "");
        setTags(data.framework.tags?.join(", ") || "");
        setStep(2);
      } else {
        alert(data.error || "Failed to reverse engineer");
      }
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;

    setLoading(true);

    try {
      const res = await fetch("/Linkedink/api/frameworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          bestFor,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          fullData: result,
          sourcePostUrl: mode === "url" ? input : null,
          sourcePostText: mode === "text" ? input : null,
        }),
      });

      if (res.ok) {
        router.push("/frameworks");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong while saving");
    }

    setLoading(false);
  };

  if (step === 2 && result) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-heading">Review Analysis</h1>
          <p className="text-body mt-1">Review and refine the extracted framework before saving.</p>
        </div>

        <div className="card p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-muted uppercase tracking-wider mb-2">Framework Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="brutal-input"
                placeholder="e.g., Contrarian Storytelling"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted uppercase tracking-wider mb-2">Tags (comma separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="brutal-input"
                placeholder="storytelling, growth, careers"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted uppercase tracking-wider mb-2">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="brutal-input min-h-[100px]"
              placeholder="What makes this post style effective?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted uppercase tracking-wider mb-2">Best For</label>
            <input
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
              className="brutal-input"
              placeholder="e.g., Personal brand building"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted uppercase tracking-wider mb-2">Extracted Framework Data</label>
            <div className="bg-gray-50 rounded-xl p-4 border border-border text-xs font-mono overflow-auto max-h-64 leading-relaxed text-body">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary min-w-[160px]"
            >
              {loading ? "Saving..." : "Save to Library"}
            </button>
            <button
              onClick={() => setStep(0)}
              className="btn-outline"
            >
              Back to Input
            </button>
            <button
              onClick={() => router.push("/frameworks")}
              className="text-sm font-semibold text-danger px-4 hover:underline"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-heading text-heading">Add New Framework</h1>
        <p className="text-body mt-2">Scale your writing by reverse-engineering high-performing content.</p>
      </div>

      <div className="card p-8 bg-white">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[10px] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
            STEP 1
          </span>
          <h2 className="text-lg font-bold text-heading">Input LinkedIn Source</h2>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode("url")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === "url" ? "bg-primary text-white shadow-btn" : "bg-gray-50 text-body border border-border hover:bg-white"}`}
          >
            <span>🔗</span> Paste URL
          </button>
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === "text" ? "bg-primary text-white shadow-btn" : "bg-gray-50 text-body border border-border hover:bg-white"}`}
          >
            <span>📝</span> Paste Text
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            {mode === "url" ? "LinkedIn Post URL" : "LinkedIn Post Content"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="brutal-input min-h-[250px] font-body text-[15px] leading-relaxed mb-6"
            placeholder={
              mode === "url"
                ? "https://www.linkedin.com/posts/..."
                : "Paste the full text of the post here..."
            }
          />

          <div>
            <button
              onClick={() => setShowPromptEditor(!showPromptEditor)}
              className="text-xs font-bold text-primary flex items-center gap-2 hover:underline tracking-wider uppercase"
            >
              {showPromptEditor ? "▼ Hide Prompt Editor" : "▶ Configure AI Analysis Prompt"}
            </button>

            {showPromptEditor && (
              <div className="mt-4 animate-fade-in">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Base Prompt (Overrides default for this analysis)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="brutal-input min-h-[200px] text-sm font-mono bg-gray-50"
                  placeholder="Enter custom analysis prompt here..."
                />
                <p className="text-[10px] text-muted mt-2">
                  * Changes here only apply to this specific analysis.
                </p>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="card p-8 bg-primary-light border-primary/20 space-y-4">
            <div className="flex items-center justify-between font-bold text-primary text-sm uppercase">
              <span>Deeply analyzing patterns...</span>
              <span className="animate-pulse">Processing</span>
            </div>
            <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full loading-bar-fast"></div>
            </div>
            <p className="text-xs text-primary/70 font-medium text-center italic">
              Our AI is dissecting the hook, structure, and psychological triggers.
            </p>
          </div>
        ) : (
          <button
            onClick={handleReverseEngineer}
            disabled={!input.trim()}
            className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hover"
          >
            ⚡ Match Patterns & Extract Framework
          </button>
        )}
      </div>

      <style jsx global>{`
        .loading-bar-fast {
          animation: slide 2s linear infinite;
          width: 40%;
        }
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
