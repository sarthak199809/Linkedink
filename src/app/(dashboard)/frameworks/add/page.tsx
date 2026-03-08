"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  if (step === 2 && result) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">REVIEW BEFORE SAVING</h1>

        <div className="brutal-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">TITLE</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="brutal-input"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">SUMMARY</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="brutal-input min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">BEST FOR</label>
            <input
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
              className="brutal-input"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">TAGS (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="brutal-input"
              placeholder="contrarian, storytelling, career"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">FULL FRAMEWORK</label>
            <pre className="bg-gray-100 p-4 border-2 border-black text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push("/frameworks")}
              className="brutal-btn brutal-btn-danger"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="brutal-btn"
            >
              {loading ? "SAVING..." : "SAVE FRAMEWORK"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 tracking-tight uppercase">Add New Framework</h1>

      <div className="brutal-card p-10 bg-white">
        <h2 className="text-xl font-bold mb-8 uppercase flex items-center gap-2">
          <span className="bg-accent px-2 py-0.5 border border-black text-sm">STEP 1</span>
          Input LinkedIn Source
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setMode("url")}
            className={`brutal-btn flex items-center justify-center gap-2 ${mode === "url" ? "bg-black text-white" : "bg-white text-black border-2 border-black opacity-60"}`}
          >
            <span>🔗</span> PASTE URL
          </button>
          <button
            onClick={() => setMode("text")}
            className={`brutal-btn flex items-center justify-center gap-2 ${mode === "text" ? "bg-black text-white" : "bg-white text-black border-2 border-black opacity-60"}`}
          >
            <span>📝</span> PASTE POST TEXT
          </button>
        </div>

        <div className="mb-10">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            {mode === "url" ? "LinkedIn Post URL" : "LinkedIn Post Content"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="brutal-input min-h-[250px] font-body text-base leading-relaxed mb-6"
            placeholder={
              mode === "url"
                ? "https://www.linkedin.com/posts/..."
                : " अर्जुन ने 2021 में इंदौर शिफ्ट होने का फैसला किया...\n(Paste the full text of the post here)"
            }
          />

          <div className="mb-6">
            <button
              onClick={() => setShowPromptEditor(!showPromptEditor)}
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
            >
              {showPromptEditor ? "▼ Hide Prompt Editor" : "▶ Configure AI Analysis Prompt"}
            </button>

            {showPromptEditor && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Base Prompt (Overrides default for this analysis)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="brutal-input min-h-[200px] text-sm font-mono bg-gray-50"
                  placeholder="Enter custom analysis prompt here..."
                />
                <p className="text-[10px] text-gray-500 mt-2">
                  * Changes here only apply to this specific analysis. To change the global default, go to the Frameworks page.
                </p>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-8 border-4 border-black bg-gray-50 space-y-4">
            <div className="flex items-center justify-between font-bold text-sm uppercase">
              <span>Reverse Engineering in progress</span>
              <span className="animate-pulse">Processing...</span>
            </div>
            <div className="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden">
              <div className="h-full bg-accent loading-bar-fast"></div>
            </div>
            <p className="text-xs text-gray-500 font-medium text-center">
              Our AI is analyzing the structure, hook, and micro-techniques of this post.
            </p>
          </div>
        ) : (
          <button
            onClick={handleReverseEngineer}
            disabled={!input.trim()}
            className="brutal-btn brutal-btn-accent w-full text-lg py-5 shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
          >
            ⚡ REVERSE ENGINEER THIS POST
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
