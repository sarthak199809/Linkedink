"use client";

import { useState } from "react";
import PromptEditor from "./PromptEditor";

export default function PromptEditorToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
                <span>{isOpen ? "▼" : "▶"}</span>
                <span>Configure AI Analysis Prompt</span>
            </button>

            {isOpen && (
                <PromptEditor />
            )}
        </div>
    );
}
