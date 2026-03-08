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
  existingApiKey: ApiKey | null;
}

export default function SettingsForm({ userId, existingApiKey }: Props) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
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
      <h1 className="text-4xl font-bold mb-10 tracking-tight uppercase">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="brutal-card p-8 bg-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-accent px-2 py-0.5 border border-black text-sm">STEP 1</span>
              GEMINI API CONFIGURATION
            </h2>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Your API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="brutal-input pr-24 font-mono text-sm"
                  placeholder={existingApiKey?.isValid ? "••••••••••••••••••••••••••••" : "Paste your AIzaSy... key here"}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold underline uppercase opacity-50 hover:opacity-100"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              {existingApiKey?.isValid && !apiKey && (
                <p className="text-[10px] mt-2 text-gray-500 font-medium">
                  Using currently saved key. Enter a new one to overwrite.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                disabled={loading || !apiKey.trim()}
                className="brutal-btn min-w-[140px]"
              >
                {loading ? "SAVING..." : "UPDATE KEY"}
              </button>
              <button
                onClick={handleTest}
                disabled={loading}
                className="brutal-btn brutal-btn-accent min-w-[140px]"
              >
                {loading ? "TESTING..." : "TEST CONNECTION"}
              </button>
            </div>

            {status.message && (
              <div className={`mt-8 p-4 border-2 border-black flex items-center gap-3 ${status.type === "error" ? "bg-red-50" : status.type === "success" ? "bg-green-50" : "bg-gray-50"
                }`}>
                <span className="text-xl">
                  {status.type === "success" ? "✓" : status.type === "error" ? "✕" : "⏳"}
                </span>
                <p className={`font-bold text-sm ${status.type === "error" ? "text-danger" : status.type === "success" ? "text-green-700" : "text-gray-700"
                  }`}>
                  {status.message}
                </p>
              </div>
            )}
          </section>

          <section className="brutal-card p-8 bg-white">
            <h2 className="text-xl font-bold mb-6">ACCOUNT PREFERENCES</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Email Address
                </label>
                <p className="font-bold underline">sarthak199809@gmail.com</p>
              </div>
              <div className="pt-4">
                <button className="text-xs font-bold underline text-danger uppercase">
                  Delete Account & Data
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="brutal-card p-6 bg-accent">
            <h3 className="font-bold mb-3 uppercase text-sm">Need a key?</h3>
            <p className="text-sm mb-4 leading-snug">
              You can get a free Gemini API key from the Google AI Studio.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              className="brutal-btn bg-white text-black text-[10px] py-1 px-3 block text-center"
            >
              GET FREE KEY →
            </a>
          </div>

          <div className="brutal-card p-6 bg-white">
            <h3 className="font-bold mb-3 uppercase text-sm">Security</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Your API keys are encrypted at rest and never shared with third parties. We only use them to process your requests to Google Gemini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
