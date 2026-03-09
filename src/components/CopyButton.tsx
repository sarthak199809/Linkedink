"use client";

export default function CopyButton({ text }: { text: string }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert("Copied!");
    };

    return (
        <button
            onClick={handleCopy}
            className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-light flex items-center gap-1 flex-shrink-0"
        >
            📋 Copy
        </button>
    );
}
