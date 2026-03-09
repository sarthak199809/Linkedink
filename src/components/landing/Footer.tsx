import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-heading text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden p-1">
                                <img
                                    src="/Linkedink/logo.png"
                                    alt="Linkedink"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold font-heading tracking-tight">
                                Linkedink
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                            Transform your LinkedIn presence with AI-powered post generation.
                            Reverse-engineer viral frameworks and create posts that get
                            results.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-white/80">
                            Product
                        </h4>
                        <ul className="space-y-2.5">
                            <li>
                                <a
                                    href="#features"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-white/80">
                            Get Started
                        </h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-xs">
                        © {new Date().getFullYear()} Linkedink. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-white/40 hover:text-white transition-colors text-xs"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-white/40 hover:text-white transition-colors text-xs"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
