"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-btn group-hover:shadow-btn-hover transition-all overflow-hidden p-1">
                        <img
                            src="/Linkedink/logo.png"
                            alt="Linkedink"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-tight text-heading">
                        Linkedink
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <a href="#features" className="btn-ghost text-sm">
                        Features
                    </a>
                    <a href="#how-it-works" className="btn-ghost text-sm">
                        How It Works
                    </a>
                    <a href="#testimonials" className="btn-ghost text-sm">
                        Testimonials
                    </a>
                    <a href="#faq" className="btn-ghost text-sm">
                        FAQ
                    </a>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login" className="btn-ghost text-sm">
                        Log In
                    </Link>
                    <Link href="/register" className="btn-primary text-sm">
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-xl hover:bg-primary-light transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        {mobileOpen ? (
                            <>
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="6" y1="18" x2="18" y2="6" />
                            </>
                        ) : (
                            <>
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="20" y2="17" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border animate-fade-in">
                    <div className="px-6 py-4 space-y-2">
                        <a
                            href="#features"
                            className="block py-2 text-sm font-medium text-body hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="block py-2 text-sm font-medium text-body hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            How It Works
                        </a>
                        <a
                            href="#testimonials"
                            className="block py-2 text-sm font-medium text-body hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            Testimonials
                        </a>
                        <a
                            href="#faq"
                            className="block py-2 text-sm font-medium text-body hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                        >
                            FAQ
                        </a>
                        <div className="flex gap-3 pt-3 border-t border-border">
                            <Link href="/login" className="btn-outline text-sm flex-1 text-center">
                                Log In
                            </Link>
                            <Link href="/register" className="btn-primary text-sm flex-1 text-center">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
