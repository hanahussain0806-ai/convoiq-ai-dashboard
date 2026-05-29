"use client";

import { AnalysisResult } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Brain } from "lucide-react";
import { cn, getSentimentColor } from "@/lib/utils";

function computeHealthScore(result: AnalysisResult): number {
  const { business_kpis: k } = result;
  let score = 50;
  score += k.agent_empathy_score * 2;
  score -= k.customer_frustration_index * 2;
  if (k.issue_resolved) score += 20;
  if (k.churn_risk === "High") score -= 20;
  else if (k.churn_risk === "Medium") score -= 10;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function HealthRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#10B981" : score >= 45 ? "#F59E0B" : "#F43F5E";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} stroke="#1e293b" strokeWidth="8" fill="none" />
        <circle
          cx="48" cy="48" r={r}
          stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-slate-500 text-xs block -mt-1">/ 100</span>
      </div>
    </div>
  );
}

export default function CommandStrip({ result }: { result: AnalysisResult }) {
  const health = computeHealthScore(result);
  const { overall_sentiment, emotion_detected, business_kpis: k } = result;

  const SentimentIcon = overall_sentiment === "Positive" ? TrendingUp
    : overall_sentiment === "Negative" ? TrendingDown : Minus;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Call Health Score */}
      <div className="col-span-2 lg:col-span-1 gradient-border rounded-2xl p-5 flex items-center gap-5 glow-indigo">
        <HealthRing score={health} />
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Call Health Score</p>
          <p className={cn("text-sm font-semibold",
            health >= 70 ? "text-emerald-400" : health >= 45 ? "text-amber-400" : "text-rose-400"
          )}>
            {health >= 70 ? "Healthy" : health >= 45 ? "At Risk" : "Critical"}
          </p>
          <p className="text-slate-600 text-xs mt-0.5">Composite quality index</p>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Overall Sentiment</p>
          <SentimentIcon className={cn("w-4 h-4", getSentimentColor(overall_sentiment))} />
        </div>
        <p className={cn("text-2xl font-bold", getSentimentColor(overall_sentiment))}>
          {overall_sentiment}
        </p>
        <p className="text-slate-600 text-xs">Across full conversation</p>
      </div>

      {/* Dominant Emotion */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Dominant Emotion</p>
          <Brain className="w-4 h-4 text-violet-400" />
        </div>
        <p className="text-2xl font-bold text-white">{emotion_detected}</p>
        <p className="text-slate-600 text-xs">Primary detected state</p>
      </div>

      {/* Churn Risk */}
      <div className={cn(
        "rounded-2xl border p-5 space-y-3",
        k.churn_risk === "High"
          ? "border-rose-500/30 bg-rose-500/5"
          : k.churn_risk === "Medium"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-emerald-500/30 bg-emerald-500/5"
      )}>
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Churn Risk</p>
          {k.churn_risk === "High"
            ? <AlertTriangle className="w-4 h-4 text-rose-400" />
            : <CheckCircle className="w-4 h-4 text-emerald-400" />}
        </div>
        <p className={cn("text-2xl font-bold",
          k.churn_risk === "High" ? "text-rose-400"
          : k.churn_risk === "Medium" ? "text-amber-400"
          : "text-emerald-400"
        )}>
          {k.churn_risk}
        </p>
        <p className="text-slate-600 text-xs">
          Issue {k.issue_resolved ? "resolved ✓" : "unresolved ✗"}
        </p>
      </div>
    </div>
  );
}
