"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Lock, Mail, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock auth — any credentials work
    await new Promise((r) => setTimeout(r, 1200));
    if (email && password) {
      localStorage.setItem("convoiq_auth", "true");
      router.push("/upload");
    } else {
      setError("Please enter your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[80px]" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ConvoIQ</span>
        </div>

        {/* Hero content */}
        <div className="relative space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
              AI Centre of Excellence
            </p>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Turn conversations
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                into intelligence.
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-md leading-relaxed">
              Enterprise-grade AI platform for real-time call center analytics,
              emotion detection, and CX intelligence.
            </p>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { icon: Sparkles, label: "AI Accuracy", value: "94.2%", color: "indigo" },
              { icon: Zap,       label: "Avg Analysis", value: "~8s",   color: "violet" },
              { icon: Shield,    label: "Compliance",   value: "SOC 2", color: "cyan" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="gradient-border rounded-xl p-4 bg-white/[0.02] backdrop-blur"
              >
                <Icon className={`w-4 h-4 mb-2 text-${color}-400`} />
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative text-slate-600 text-sm">
          © 2025 ConvoIQ · Enterprise AI Platform
        </div>
      </div>

      {/* ── Right Panel (Login Form) ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-white/[0.01] lg:border-l lg:border-slate-800" />

        <motion.div
          className="w-full max-w-md relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ConvoIQ</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to your analytics workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@enterprise.com"
                  className="w-full bg-slate-900/60 border border-slate-700/60 text-white placeholder-slate-600
                             rounded-xl pl-10 pr-4 py-3 text-sm outline-none
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700/60 text-white placeholder-slate-600
                             rounded-xl pl-10 pr-4 py-3 text-sm outline-none
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                             transition-all duration-200"
                />
              </div>
            </div>

            {error && (
              <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold
                         rounded-xl py-3 text-sm flex items-center justify-center gap-2
                         transition-all duration-200 shadow-lg shadow-indigo-600/25
                         disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
            <p className="text-xs text-slate-500">
              <span className="text-indigo-400 font-medium">Demo mode</span>
              {" "}— enter any email & password to continue
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
