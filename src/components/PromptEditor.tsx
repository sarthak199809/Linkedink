"use client";

import { useState, useEffect } from "react";

export default function PromptEditor() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPrompt();
    }, []);

    const fetchPrompt = async () => {
        try {
            const res = await fetch("/Linkedink/api/settings/prompts");
            const data = await res.json();
            if (res.ok) {
                setPrompt(data.prompt);
            }
        } catch (err) {
            console.error("Failed to fetch prompt", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/Linkedink/api/settings/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptText: prompt }),
            });
            if (res.ok) {
                setMessage("Prompt updated successfully!");
            } else {
                setMessage("Failed to update prompt.");
            }
        } catch (err) {
            setMessage("System error.");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm("Are you sure you want to reset to default?")) return;
        setSaving(true);
        try {
            const res = await fetch("/Linkedink/api/settings/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reset: true }),
            });
            const data = await res.json();
            if (res.ok) {
                setPrompt(data.prompt);
                setMessage("Reset to default!");
            }
        } catch (err) {
            setMessage("Failed to reset.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 brutal-card">Loading prompt editor...</div>;

    return (
        <div className="brutal-card p-6 bg-white animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">AI Analysis Base Prompt</h3>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">
                        Customize how LinkedIn posts are reverse-engineered
                    </p>
                </div>
                <button
                    onClick={handleReset}
                    className="text-[10px] font-bold underline uppercase opacity-50 hover:opacity-100"
                >
                    Reset to Default
                </button>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="brutal-input min-h-[400px] font-mono text-sm leading-relaxed mb-6 bg-gray-50"
                spellCheck={false}
            />

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="brutal-btn brutal-btn-accent min-w-[160px]"
                >
                    {saving ? "SAVING..." : "SAVE CUSTOM PROMPT"}
                </button>
                {message && (
                    <span className={`text-sm font-bold uppercase tracking-tight ${message.includes("Failed") ? "text-danger" : "text-green-600"}`}>
                        {message}
                    </span>
                )}
            </div>

            <div className="mt-8 p-4 bg-accent/10 border-2 border-black border-dashed">
                <h4 className="font-bold text-xs uppercase mb-2">Editor Tips:</h4>
                <ul className="text-[11px] space-y-1 list-disc pl-4 font-medium text-gray-600">
                    <li>The prompt should instructions the LLM to return valid JSON.</li>
                    <li>Do not remove the JSON structure requirements unless you update the parsing logic.</li>
                    <li>You can ask the AI to pay more attention to specific aspects like "Hook length" or "Call to actions".</li>
                </ul>
            </div>
        </div>
    );
}
