"use client";

import Link from "next/link";
import { useState } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Footer from "@/components/landing/Footer";

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: "What is Linkedink?",
    a: "Linkedink is an AI-powered tool that helps you create high-performing LinkedIn posts. It reverse-engineers viral posts into reusable writing frameworks, then uses AI to generate new posts that match those proven patterns.",
  },
  {
    q: "How does the framework engine work?",
    a: "Paste any LinkedIn post you admire, and our AI will analyze its structure, tone, hooks, and patterns — turning it into a reusable framework. You can then use that framework to generate new posts on any topic.",
  },
  {
    q: "Do I need my own API key?",
    a: "Yes, Linkedink uses Google's Gemini AI. You'll need your own free API key from Google AI Studio. This keeps the tool free for you and gives you full control over your AI usage.",
  },
  {
    q: "Is my content stored securely?",
    a: "Absolutely. Your posts, frameworks, and API keys are stored securely and are only accessible by your account. We never share your data with third parties.",
  },
  {
    q: "Can I use this for other social media?",
    a: "While Linkedink is optimized for LinkedIn's unique format, the frameworks and generated posts can be adapted for any professional social media platform.",
  },
];

/* ─── Testimonials Data ─── */
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Marketing Lead, TechStart",
    quote:
      "Linkedink turned my content game around. I went from 50 views per post to consistently hitting 5,000+.",
    avatar: "PS",
    color: "bg-blue-500",
  },
  {
    name: "Rahul Menon",
    role: "Founder, SaaSBox",
    quote:
      "The framework engine is genius. I reverse-engineered 10 viral posts and now I have a personal playbook for LinkedIn.",
    avatar: "RM",
    color: "bg-purple-500",
  },
  {
    name: "Anika Das",
    role: "Content Strategist",
    quote:
      "Finally, a tool that gets the nuances of LinkedIn. The AI generates posts that actually sound like me.",
    avatar: "AD",
    color: "bg-orange-500",
  },
];

/* ─── Problem Data ─── */
const problems = [
  {
    icon: "⏰",
    title: "Hours Wasted Writing",
    desc: "You spend 2+ hours crafting a single post, only to get 12 likes from your mom and your college roommate.",
  },
  {
    icon: "🎯",
    title: "No Proven Formula",
    desc: "You see others going viral but have no idea what structure, hook, or tone they're using to get engagement.",
  },
  {
    icon: "🤖",
    title: "Generic AI Output",
    desc: "ChatGPT gives you robotic, corporate-sounding posts that scream \"AI wrote this\" to your audience.",
  },
];

/* ─── Solution Features ─── */
const features = [
  {
    icon: "🔬",
    title: "Framework Engine",
    desc: "Paste any viral LinkedIn post. Our AI dissects its structure, tone, hooks, and patterns into a reusable blueprint.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "⚡",
    title: "AI Generation",
    desc: "Feed in your idea, and Linkedink auto-matches the best framework to generate a post that's authentically you.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "🎯",
    title: "Smart Matching",
    desc: "Vector-based similarity search finds the perfect framework for your topic — with confidence scores you can trust.",
    gradient: "from-orange-500 to-red-500",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* ═══════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold text-body">
                  AI-Powered LinkedIn Tool
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1] mb-6 text-heading">
                Write Posts
                <br />
                That{" "}
                <span className="relative">
                  <span className="relative z-10 text-primary">Actually</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full z-0"
                    height="14"
                    viewBox="0 0 200 14"
                    fill="none"
                  >
                    <path
                      d="M2 10C40 2 100 2 198 10"
                      stroke="#4A90D9"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>{" "}
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                  Hit
                </span>
              </h1>

              <p className="text-lg md:text-xl text-body max-w-lg mb-8 leading-relaxed">
                Reverse-engineer viral LinkedIn frameworks, then let AI generate
                posts that match your voice and proven patterns.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/register"
                  className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-btn hover:shadow-btn-hover flex items-center gap-2"
                >
                  Get Started Free
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-outline text-base px-8 py-3.5 rounded-2xl"
                >
                  See How It Works
                </a>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["PS", "RM", "AD", "SK"].map((initials, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-green-500"][i]
                        }`}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-muted font-medium">
                    Loved by content creators
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Hero Card / Product Preview */}
            <div className="animate-fade-in-up delay-200 relative">
              <div className="relative z-10">
                {/* Floating badge */}
                <div className="absolute -top-4 -left-4 z-20 bg-white rounded-2xl shadow-card-hover px-4 py-2.5 flex items-center gap-2 animate-float">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-heading">92% Match</p>
                    <p className="text-[10px] text-muted">Framework detected</p>
                  </div>
                </div>

                {/* Main preview card */}
                <div className="gradient-hero-card p-1 shadow-2xl animate-pulse-glow">
                  <div className="bg-white rounded-[20px] p-6 space-y-4">
                    {/* Mini header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">Li</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-heading">Your Generated Post</p>
                        <p className="text-xs text-muted">Matched with "Value Story" framework</p>
                      </div>
                    </div>

                    {/* Post preview */}
                    <div className="space-y-2">
                      <div className="h-3 bg-primary/10 rounded-full w-full" />
                      <div className="h-3 bg-primary/10 rounded-full w-11/12" />
                      <div className="h-3 bg-primary/10 rounded-full w-4/5" />
                      <div className="h-3 bg-primary/5 rounded-full w-3/4" />
                      <div className="h-3 bg-primary/5 rounded-full w-5/6" />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-primary">👍 2,847</span>
                        <span className="text-xs font-semibold text-body">💬 134</span>
                        <span className="text-xs font-semibold text-body">🔄 89</span>
                      </div>
                      <span className="text-[10px] px-3 py-1 bg-success/10 text-success font-bold rounded-full">
                        Top 5% engagement
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating stat badge */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-white rounded-2xl shadow-card-hover px-4 py-2.5 flex items-center gap-2 animate-float delay-300">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-heading">10x Faster</p>
                    <p className="text-[10px] text-muted">Than writing manually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2: PROBLEM
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" id="problems">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 font-semibold text-xs rounded-full mb-4 uppercase tracking-wider">
              The Problem
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-heading">
              LinkedIn Content Shouldn&apos;t Be{" "}
              <span className="text-red-400">This Hard</span>
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              You know LinkedIn is a goldmine for your career, but creating
              engaging posts feels impossible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((problem, i) => (
              <div
                key={i}
                className="card p-8 text-center hover:border-red-200 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-heading">
                  {problem.title}
                </h3>
                <p className="text-body text-sm leading-relaxed">
                  {problem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3: SOLUTION / FEATURES
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16" id="how-it-works">
            <span className="inline-block px-4 py-1.5 bg-primary-light text-primary font-semibold text-xs rounded-full mb-4 uppercase tracking-wider">
              The Solution
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-heading">
              Your Personal{" "}
              <span className="text-primary">LinkedIn Playbook</span>
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Linkedink gives you a proven system to create high-performing
              posts, every single time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card p-8 group hover:border-primary/30">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-heading mb-3 text-heading">
                  {feature.title}
                </h3>
                <p className="text-body text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="card overflow-hidden shadow-glow">
              <img
                src="/Linkedink/hero-dashboard.png"
                alt="Linkedink Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4: TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-accent-light text-accent font-semibold text-xs rounded-full mb-4 uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-heading">
              Creators Love{" "}
              <span className="text-primary">Linkedink</span>
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              See what our users are saying about their LinkedIn transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-8 group">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-heading font-medium mb-6 leading-relaxed text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5: FAQ
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-light text-primary font-semibold text-xs rounded-full mb-4 uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-heading">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-primary-light/30 transition-colors"
                >
                  <span className="font-bold text-heading text-[15px]">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-48 pb-5" : "max-h-0"
                    }`}
                >
                  <p className="px-6 text-body text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6: FINAL CTA
          ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl gradient-hero-card p-12 md:p-20 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">
                Ready to Transform Your
                <br />
                LinkedIn Presence?
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
                Join thousands of creators who are writing better LinkedIn posts
                with AI-powered frameworks. Free to get started.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="bg-white text-primary font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
                >
                  Start Writing Better Posts →
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-all text-base"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
