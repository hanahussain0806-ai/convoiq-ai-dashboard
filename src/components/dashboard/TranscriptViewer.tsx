"use client";

import { useState } from "react";
import { SentenceAnalysis } from "@/lib/types";
import { cn, getSentimentBg, getSentimentBorder } from "@/lib/utils";
import { FileText, Filter, ChevronDown } from "lucide-react";

type Filter = "All" | "Positive" | "Negative" | "Neutral";

const FILTERS: Filter[] = ["All", "Positive", "Negative", "Neutral"];

const EMOTION_COLORS: Record<string, string> = {
  Anger: "text-rose-400 bg-rose-500/10",
  Joy: "text-amber-400 bg-amber-500/10",
  Trust: "text-emerald-400 bg-emerald-500/10",
  Fear: "text-violet-400 bg-violet-500/10",
  Sadness: "text-slate-400 bg-slate-500/10",
  Surprise: "text-sky-400 bg-sky-500/10",
  Disgust: "text-green-400 bg-green-500/10",
  Anticipation: "text-orange-400 bg-orange-500/10",
  Frustrated: "text-rose-400 bg-rose-500/10",
  Neutral: "text-slate-400 bg-slate-500/10",
  Happy: "text-amber-400 bg-amber-500/10",
  Satisfied: "text-emerald-400 bg-emerald-500/10",
};

function guessRole(index: number): "Agent" | "Customer" {
  // Alternating heuristic — Agent starts
  return index % 2 === 0 ? "Agent" : "Customer";
}

export default function TranscriptViewer({ sentences }: { sentences: SentenceAnalysis[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = sentences.filter(
    (s) => filter === "All" || s.sentiment === filter
  );

  const counts = {
    Positive: sentences.filter((s) => s.sentiment === "Positive").length,
    Negative: sentences.filter((s) => s.sentiment === "Negative").length,
    Neutral:  sentences.filter((s) => s.sentiment === "Neutral").length,
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Sentence-Level Analysis
          </h3>
          <p className="text-slate-500 text-sm mt-0.5">
            {sentences.length} utterances analyzed
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200",
                filter === f
                  ? f === "All"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : f === "Positive"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : f === "Negative"
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-400"
                  : "border-slate-700/60 text-slate-500 hover:text-slate-300 hover:border-slate-600"
              )}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1.5 opacity-60">{counts[f]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript rows */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No utterances match this filter</p>
          </div>
        ) : (
          filtered.map((s, i) => {
            const originalIndex = sentences.indexOf(s);
            const role = guessRole(originalIndex);
            const isExpanded = expanded === originalIndex;
            const emotionClass = EMOTION_COLORS[s.emotion] ?? "text-slate-400 bg-slate-500/10";

            return (
              <div
                key={originalIndex}
                onClick={() => setExpanded(isExpanded ? null : originalIndex)}
                className={cn(
                  "group flex gap-3 p-4 rounded-xl border-l-2 bg-slate-800/30 hover:bg-slate-800/50",
                  "border border-slate-700/40 cursor-pointer transition-all duration-200",
                  getSentimentBorder(s.sentiment),
                  isExpanded && "bg-slate-800/60 border-slate-600/60"
                )}
              >
                {/* Index + Role */}
                <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                  <span className="text-slate-600 text-xs font-mono w-6 text-center">
                    {String(originalIndex + 1).padStart(2, "0")}
                  </span>
                  <div className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    role === "Agent"
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-violet-500/15 text-violet-400"
                  )}>
                    {role === "Agent" ? "AGT" : "CST"}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm leading-relaxed text-slate-300 transition-all",
                    !isExpanded && "line-clamp-1"
                  )}>
                    {s.sentence}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Sentiment badge */}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-md border font-medium",
                      getSentimentBg(s.sentiment)
                    )}>
                      {s.sentiment}
                    </span>

                    {/* Emotion badge */}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-md font-medium",
                      emotionClass
                    )}>
                      {s.emotion}
                    </span>
                  </div>
                </div>

                {/* Expand icon */}
                <ChevronDown className={cn(
                  "w-4 h-4 text-slate-600 shrink-0 mt-1 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )} />
              </div>
            );
          })
        )}
      </div>
      {/* Footer summary bar */}
      <div className="mt-4 pt-4 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-500">
        <span>Showing {filtered.length} of {sentences.length} utterances</span>
        <span>ConvoIQ Analysis Engine</span>
      </div>
    </div>
  );
}
