"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: "📊" },
        { name: "Frameworks", href: "/frameworks", icon: "🔬" },
        { name: "Generate", href: "/generate", icon: "⚡" },
        { name: "Settings", href: "/settings", icon: "⚙️" },
    ];

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="group flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-btn group-hover:shadow-btn-hover transition-all overflow-hidden p-1">
                        <img src="/Linkedink/logo.png" alt="Linkedink" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-tight text-heading">
                        Linkedink
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5 ${isActive
                                    ? "bg-primary-light text-primary font-semibold"
                                    : "text-body hover:text-heading hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-xs">{link.icon}</span>
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="ml-4 pl-4 border-l border-border">
                        <LogoutButton />
                    </div>
                </nav>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-2">
                    <LogoutButton />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-xl hover:bg-primary-light transition-colors"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {mobileOpen ? (
                                <><line x1="5" y1="5" x2="15" y2="15" /><line x1="5" y1="15" x2="15" y2="5" /></>
                            ) : (
                                <><line x1="4" y1="6" x2="16" y2="6" /><line x1="4" y1="10" x2="16" y2="10" /><line x1="4" y1="14" x2="16" y2="14" /></>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border animate-fade-in px-6 py-3 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? "bg-primary-light text-primary" : "text-body hover:bg-gray-50"}`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
}
