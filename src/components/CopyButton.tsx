"use client";

import { useState } from "react";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={className || "brutal-btn text-xs py-2 px-4 whitespace-nowrap"}
        >
            {copied ? "COPIED!" : "COPY TEXT"}
        </button>
    );
}
