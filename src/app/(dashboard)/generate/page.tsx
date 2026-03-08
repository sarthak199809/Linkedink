"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState<{
    post: string;
    framework: { title: string };
    score: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    setError("");
    setStep("Generating...");
    setResult(null);

    try {
      const res = await fetch("/Linkedink/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to generate post");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
    setStep("");
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.post);
    }
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="brutal-card p-8 mb-8 bg-white border-black">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl text-green-600">✓</span>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Writing Match Confirmed</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="brutal-tag bg-accent">{result.framework.title}</span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {Math.round(result.score * 100)}% Match Confidence
            </span>
          </div>
        </div>

        <div className="brutal-card p-10 bg-white border-black shadow-2xl relative">
          <div className="absolute top-[-15px] left-8 bg-black text-white px-4 py-1 text-xs font-bold uppercase tracking-widest">
            Generated Output
          </div>
          <div className="whitespace-pre-wrap font-body text-lg leading-relaxed mb-10 text-gray-800">
            {result.post}
          </div>

          <div className="flex flex-wrap gap-4 pt-8 border-t-2 border-dashed border-gray-200">
            <button
              onClick={() => {
                handleCopy();
                alert("Copied to clipboard!");
              }}
              className="brutal-btn min-w-[200px]"
            >
              COPY TO CLIPBOARD
            </button>
            <button
              onClick={handleGenerate}
              className="brutal-btn brutal-btn-accent min-w-[200px]"
            >
              REGENERATE VERSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 tracking-tight uppercase">Generate A Post</h1>

      <div className="brutal-card p-10 bg-white">
        <h2 className="text-xl font-bold mb-6 uppercase flex items-center gap-2">
          <span className="bg-accent px-2 py-0.5 border border-black text-sm">STEP 1</span>
          What's the core idea?
        </h2>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="brutal-input min-h-[300px] mb-10 font-body text-lg leading-relaxed"
          placeholder="e.g., Working in Tier-2 cities is actually better for long-term wealth than moving to Bangalore..."
        />

        {loading ? (
          <div className="p-8 border-4 border-black bg-gray-50 space-y-4">
            <div className="flex items-center justify-between font-bold text-sm uppercase">
              <span>Finding matching framework...</span>
              <span className="animate-pulse">{step || "Generating..."}</span>
            </div>
            <div className="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden">
              <div className="h-full bg-accent loading-bar-fast"></div>
            </div>
          </div>
        ) : error ? (
          <div className="brutal-card p-6 bg-red-50 border-danger mb-8 group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-danger text-xl font-bold">✕</span>
              <h3 className="text-danger font-bold uppercase">Generation Failed</h3>
            </div>
            <p className="text-danger/80 font-medium text-sm">{error}</p>
            <button onClick={() => setError("")} className="mt-4 text-xs font-bold underline uppercase">Try Again</button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!idea.trim()}
            className="brutal-btn brutal-btn-accent w-full text-lg py-5 shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
          >
            ⚡ MATCH FRAMEWORK & GENERATE POST
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
