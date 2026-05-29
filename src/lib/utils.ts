import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SentenceAnalysis } from "./types";

// Utility to merge Tailwind classes cleanly
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color formatting utilities for the Dashboard
export function getSentimentColor(sentiment: string) {
  if (sentiment === "Positive") return "text-emerald-400";
  if (sentiment === "Negative") return "text-rose-400";
  return "text-amber-400";
}

export function getSentimentBg(sentiment: string) {
  if (sentiment === "Positive") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (sentiment === "Negative") return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
}

export function getSentimentBorder(sentiment: string) {
  if (sentiment === "Positive") return "border-l-emerald-500";
  if (sentiment === "Negative") return "border-l-rose-500";
  return "border-l-amber-500";
}

// Data formatter for the Recharts Timeline
export function buildTimelineData(sentences: SentenceAnalysis[]) {
  return sentences.map((s, i) => ({
    index: i + 1,
    score: s.sentiment === "Positive" ? 1 : s.sentiment === "Negative" ? -1 : 0,
    sentence: s.sentence,
    emotion: s.emotion,
    label: s.sentiment
  }));
}