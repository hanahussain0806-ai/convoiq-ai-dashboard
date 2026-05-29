"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Upload, FileText, X, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { analyzeConversation } from "@/lib/api";

const SAMPLE_TRANSCRIPT = `Agent: Thank you for calling support, how can I help you today?
Customer: I've been waiting on hold for 45 minutes! This is completely unacceptable.
Agent: I sincerely apologize for the wait time. I completely understand your frustration.
Customer: My internet has been down for two days and nobody has fixed it!
Agent: I'm so sorry to hear that. Let me pull up your account and escalate this immediately.
Customer: I'm seriously considering cancelling my subscription at this point.
Agent: I completely understand. Let me see what I can do to make this right for you today.
Customer: Fine. But this needs to be resolved today.
Agent: Absolutely. I'm marking this as priority and scheduling a technician for today between 2-4 PM.
Customer: Okay, that's better. Thank you.
Agent: Thank you for your patience. Is there anything else I can help you with?
Customer: No, that's it for now. I hope this actually gets fixed.`;

const STEPS = [
  "Parsing transcript structure...",
  "Detecting speaker roles...",
  "Running sentiment analysis...",
  "Computing emotion profile...",
  "Calculating business KPIs...",
  "Generating executive summary...",
  "Finalizing intelligence report...",
];

export default function DropZone() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const readFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target?.result as string);
    reader.readAsText(f);
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".txt")) readFile(f);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) readFile(f);
  };

  const loadSample = () => {
    const blob = new Blob([SAMPLE_TRANSCRIPT], { type: "text/plain" });
    const f = new File([blob], "sample-call-transcript.txt", { type: "text/plain" });
    readFile(f);
  };

  const runAnalysis = async (text: string) => {
    setLoading(true);
    setStepIndex(0);
    setProgress(0);
    setError("");

    // Animate progress steps
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
      setProgress((p) => Math.min(p + 100 / STEPS.length, 90));
    }, 900);

    try {
      const result = await analyzeConversation(text);
      clearInterval(interval);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 500));
      sessionStorage.setItem("convoiq_result", JSON.stringify(result));
      router.push("/dashboard");
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError(err instanceof Error ? err.message : "Analysis failed. Check your backend connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex flex-col">
      {/* Topbar */}
      <header className="border-b border-slate-800/60 px-8 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white">ConvoIQ</span>
        <span className="ml-2 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
          AI CoE
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl font-bold text-white">New Analysis</h1>
            <p className="text-slate-500">Upload a call transcript to generate AI-powered conversation intelligence</p>
          </motion.div>

          {/* Drop zone */}
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => !file && fileRef.current?.click()}
                  className={`
                    relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${dragging
                      ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                      : file
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-slate-700/60 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-900/40"
                    }
                    p-12 text-center
                  `}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{file.name}</p>
                          <p className="text-slate-500 text-sm mt-1">
                            {(file.size / 1024).toFixed(1)} KB · {fileContent.split("\n").length} lines detected
                          </p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 text-left max-h-32 overflow-y-auto">
                          <p className="text-slate-400 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                            {fileContent.slice(0, 300)}{fileContent.length > 300 ? "..." : ""}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); setFileContent(""); }}
                          className="text-slate-500 hover:text-rose-400 text-sm flex items-center gap-1 mx-auto transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Remove file
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${dragging ? "bg-indigo-500/20 border-indigo-500/40" : "bg-slate-800/60 border-slate-700/40"} border`}>
                          <Upload className={`w-7 h-7 transition-colors ${dragging ? "text-indigo-400" : "text-slate-500"}`} />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {dragging ? "Drop it here" : "Drag & drop your transcript"}
                          </p>
                          <p className="text-slate-500 text-sm mt-1">Supports .txt files · Max 10MB</p>
                        </div>
                        <p className="text-slate-600 text-xs">or click to browse</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Action row */}
                <div className="flex gap-3">
                  <button
                    onClick={loadSample}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/60
                               text-slate-400 hover:text-white hover:border-slate-600 text-sm
                               transition-all duration-200 bg-slate-900/40"
                  >
                    <FileText className="w-4 h-4" />
                    Try sample transcript
                  </button>
                  <button
                    onClick={() => fileContent && runAnalysis(fileContent)}
                    disabled={!fileContent}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                               bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm
                               transition-all duration-200 shadow-lg shadow-indigo-600/25
                               disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Conversation
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && (
                  <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                    ⚠ {error}
                  </p>
                )}
              </motion.div>
            ) : (
              /* ── Analysis Progress Screen ── */
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-10 space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                    <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Analyzing conversation...</h3>
                  <p className="text-slate-500 text-sm">AI is processing your transcript</p>
                </div>
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Processing</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                {/* Step list */}
                <div className="space-y-3">
                  {STEPS.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        i < stepIndex ? "text-emerald-400" :
                        i === stepIndex ? "text-white" :
                        "text-slate-600"
                      }`}
                    >
                      {i < stepIndex ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : i === stepIndex ? (
                        <svg className="animate-spin w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
