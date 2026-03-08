"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "DASHBOARD", href: "/dashboard" },
        { name: "FRAMEWORKS", href: "/frameworks" },
        { name: "GENERATE", href: "/generate" },
        { name: "SETTINGS", href: "/settings" },
    ];

    return (
        <header className="border-b-[3px] border-black bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="group flex items-center gap-2">
                    <div className="bg-accent border-2 border-black w-10 h-10 flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all overflow-hidden p-1">
                        <img src="/Linkedink/logo.png" alt="Linkedink" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">
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
                                className={`px-4 py-2 font-bold text-sm tracking-tight transition-all hover:bg-gray-50 ${isActive
                                    ? "bg-accent border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -rotate-1"
                                    : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="ml-4 pl-4 border-l-2 border-black/10">
                        <LogoutButton />
                    </div>
                </nav>

                {/* Mobile Menu Icon (Placeholder for now) */}
                <div className="md:hidden">
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
}
