"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApiKey {
  id: string;
  isValid: boolean;
  testedAt: Date | null;
  apiKey?: string;
}

interface Props {
  userId: string;
  email?: string | null;
  existingApiKey: ApiKey | null;
  preferences: {
    generationModel: string;
    embeddingModel: string;
  };
}

const GENERATION_MODELS = [
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Best Quality)" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Fast & Modern)" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash-latest", name: "Gemini 1.5 Flash (Reliable)" },
  { id: "gemini-pro-latest", name: "Gemini Pro (Legacy)" },
];

const EMBEDDING_MODELS = [
  { id: "gemini-embedding-001", name: "Gemini Embedding 001 (Recommended)" },
  { id: "text-embedding-004", name: "Text Embedding 004 (Experimental)" },
];

export default function SettingsForm({ userId, email, existingApiKey, preferences }: Props) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [generationModel, setGenerationModel] = useState(preferences.generationModel);
  const [embeddingModel, setEmbeddingModel] = useState(preferences.embeddingModel);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "testing" | "";
    message: string;
  }>({
    type: existingApiKey?.isValid ? "success" : "",
    message: existingApiKey?.isValid
      ? `Connected (Last tested ${existingApiKey.testedAt ? new Date(existingApiKey.testedAt).toLocaleDateString() : 'recently'})`
      : "",
  });

  const handleTest = async () => {
    const keyToTest = apiKey.trim() || existingApiKey?.apiKey;

    if (!keyToTest) {
      setStatus({ type: "error", message: "Please enter an API key or use existing one" });
      return;
    }

    setLoading(true);
    setStatus({ type: "testing", message: "Verifying connection with Gemini..." });

    try {
      const res = await fetch("/Linkedink/api/settings/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: keyToTest }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setStatus({
          type: "success",
          message: "Connection successful!",
        });
      } else {
        setStatus({ type: "error", message: data.error || "Invalid API key" });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to connect to Gemini API" });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStatus({ type: "error", message: "Please enter a new API key to save" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/Linkedink/api/settings/save-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), userId }),
      });

      if (res.ok) {
        router.refresh();
        setApiKey("");
        setStatus({ type: "success", message: "API key updated and verified!" });
      } else {
        const data = await res.json();
        setStatus({ type: "error", message: data.error || "Failed to save" });
      }
    } catch {
      setStatus({ type: "error", message: "System error while saving key" });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-heading mb-8 text-heading">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                STEP 1
              </span>
              <h2 className="text-lg font-bold text-heading">Gemini API Configuration</h2>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Your API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="brutal-input pr-20 font-mono text-sm"
                  placeholder={existingApiKey?.isValid ? "••••••••••••••••••••••••••••" : "Paste your AIzaSy... key here"}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              {existingApiKey?.isValid && !apiKey && (
                <p className="text-[11px] mt-2 text-muted">
                  Using currently saved key. Enter a new one to overwrite.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={loading || !apiKey.trim()}
                className="btn-primary disabled:opacity-40"
              >
                {loading ? "Saving..." : "Update Key"}
              </button>
              <button
                onClick={handleTest}
                disabled={loading}
                className="btn-outline"
              >
                {loading ? "Testing..." : "Test Connection"}
              </button>
            </div>

            {status.message && (
              <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${status.type === "error" ? "bg-red-50 border border-red-200" :
                status.type === "success" ? "bg-green-50 border border-green-200" :
                  "bg-primary-light border border-primary/20"
                }`}>
                <span className="text-lg">
                  {status.type === "success" ? "✓" : status.type === "error" ? "✕" : "⏳"}
                </span>
                <p className={`font-semibold text-sm ${status.type === "error" ? "text-danger" :
                  status.type === "success" ? "text-green-700" :
                    "text-primary"
                  }`}>
                  {status.message}
                </p>
              </div>
            )}
          </section>

          <section className="card p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                STEP 2
              </span>
              <h2 className="text-lg font-bold text-heading">Model Selection</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Content Generation Model
                </label>
                <select
                  value={generationModel}
                  onChange={(e) => setGenerationModel(e.target.value)}
                  className="brutal-input text-sm"
                >
                  {GENERATION_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <p className="text-[10px] mt-2 text-muted leading-relaxed">
                  Used for post generation and analysis. Pro models provide better quality.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Embedding Model
                </label>
                <select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="brutal-input text-sm"
                >
                  {EMBEDDING_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <p className="text-[10px] mt-2 text-muted leading-relaxed italic">
                  Note: Changing this will reset your vector database next time you save a framework.
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                setSavingPrefs(true);
                try {
                  const res = await fetch("/Linkedink/api/settings/preferences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      preferredGenerationModel: generationModel,
                      preferredEmbeddingModel: embeddingModel,
                    }),
                  });
                  if (res.ok) {
                    setStatus({ type: "success", message: "Model preferences saved!" });
                    router.refresh();
                  } else {
                    setStatus({ type: "error", message: "Failed to save model preferences" });
                  }
                } catch {
                  setStatus({ type: "error", message: "System error saving preferences" });
                }
                setSavingPrefs(false);
              }}
              disabled={savingPrefs || (generationModel === preferences.generationModel && embeddingModel === preferences.embeddingModel)}
              className="btn-primary disabled:opacity-40"
            >
              {savingPrefs ? "Saving..." : "Save Preferences"}
            </button>
          </section>

          <section className="card p-8">
            <h2 className="text-lg font-bold mb-5 text-heading">Account Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <p className="font-semibold text-heading">{email || `${userId}@user`}</p>
              </div>
              <div className="pt-3 border-t border-border">
                <button className="text-xs font-semibold text-danger hover:text-red-700 transition-colors">
                  Delete Account & Data
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <div className="card p-6 bg-gradient-to-br from-primary-light to-blue-50 border-primary/20">
            <h3 className="font-bold mb-2 text-sm text-heading">Need a key?</h3>
            <p className="text-xs text-body mb-4 leading-relaxed">
              You can get a free Gemini API key from the Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              className="btn-primary text-xs py-2 px-4 block text-center"
            >
              Get Free Key →
            </a>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-2 text-sm text-heading">🔒 Security</h3>
            <p className="text-[11px] text-body leading-relaxed">
              Your API keys are encrypted at rest and never shared with third parties. We only use them to process your requests to Google Gemini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
