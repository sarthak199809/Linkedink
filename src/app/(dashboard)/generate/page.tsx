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
        {/* Match Info */}
        <div className="card p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-heading">Writing Match Confirmed</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="brutal-tag text-[11px]">{result.framework.title}</span>
                <span className="text-xs font-semibold text-muted">
                  {Math.round(result.score * 100)}% Match Confidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Post */}
        <div className="card p-8 relative">
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
              Generated Output
            </span>
          </div>
          <div className="whitespace-pre-wrap font-body text-[15px] leading-relaxed mb-8 text-heading pt-4">
            {result.post}
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
            <button
              onClick={() => {
                handleCopy();
                alert("Copied to clipboard!");
              }}
              className="btn-primary flex items-center gap-2"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={handleGenerate}
              className="btn-outline flex items-center gap-2"
            >
              🔄 Regenerate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-heading mb-8 text-heading">Generate A Post</h1>

      <div className="card p-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
            STEP 1
          </span>
          <h2 className="text-lg font-bold text-heading">What&apos;s the core idea?</h2>
        </div>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="brutal-input min-h-[260px] mb-8 text-[15px] leading-relaxed"
          placeholder="e.g., Working in Tier-2 cities is actually better for long-term wealth than moving to Bangalore..."
        />

        {loading ? (
          <div className="card p-6 bg-primary-light border-primary/20 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">Finding matching framework...</span>
              <span className="animate-pulse text-primary font-medium">{step || "Generating..."}</span>
            </div>
            <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full loading-bar-fast" />
            </div>
          </div>
        ) : error ? (
          <div className="card p-5 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-red-500 text-lg">✕</span>
              <h3 className="text-danger font-bold text-sm">Generation Failed</h3>
            </div>
            <p className="text-danger/80 text-sm mb-3">{error}</p>
            <button onClick={() => setError("")} className="text-xs font-semibold text-primary hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!idea.trim()}
            className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⚡ Match Framework & Generate Post
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
