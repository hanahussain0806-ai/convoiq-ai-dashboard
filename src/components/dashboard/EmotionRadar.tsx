"use client";

import { SentenceAnalysis } from "@/lib/types";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

const EMOTIONS = ["Joy", "Trust", "Fear", "Surprise", "Sadness", "Disgust", "Anger", "Anticipation"];

const EMOTION_COLORS: Record<string, string> = {
  Joy: "#FBBF24", Trust: "#34D399", Fear: "#A78BFA", Surprise: "#60A5FA",
  Sadness: "#6B7280", Disgust: "#86EFAC", Anger: "#F87171", Anticipation: "#FB923C",
  Frustrated: "#F87171", Neutral: "#6B7280", Happy: "#FBBF24", Anxious: "#A78BFA",
  Satisfied: "#34D399", Confused: "#60A5FA", Disappointed: "#6B7280", Hopeful: "#FB923C",
};

function buildRadarData(emotion: string, sentences: SentenceAnalysis[]) {
  const counts: Record<string, number> = {};
  EMOTIONS.forEach((e) => (counts[e] = 0));

  sentences.forEach((s) => {
    const matched = EMOTIONS.find(
      (e) => e.toLowerCase() === s.emotion?.toLowerCase()
    );
    if (matched) counts[matched]++;
  });

  // Seed dominant emotion from top-level if not in sentences
  const topEmotion = EMOTIONS.find(
    (e) => e.toLowerCase() === emotion?.toLowerCase()
  );
  if (topEmotion && counts[topEmotion] === 0) counts[topEmotion] = 2;

  const max = Math.max(...Object.values(counts), 1);
  return EMOTIONS.map((e) => ({
    emotion: e,
    value: Math.round((counts[e] / max) * 100),
    raw: counts[e],
  }));
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { emotion, value, raw } = payload[0].payload;
  const color = EMOTION_COLORS[emotion] ?? "#6366f1";
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-white text-xs font-semibold">{emotion}</span>
      </div>
      <p className="text-slate-400 text-xs mt-1">
        Intensity: <span className="text-white font-medium">{value}%</span>
        {raw > 0 && <span className="ml-1">({raw} utterance{raw !== 1 ? "s" : ""})</span>}
      </p>
    </div>
  );
};

export default function EmotionRadar({
  emotion,
  sentences,
}: {
  emotion: string;
  sentences: SentenceAnalysis[];
}) {
  const data = buildRadarData(emotion, sentences);
  const dominantColor = EMOTION_COLORS[emotion] ?? "#6366f1";

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold">Emotion Profile</h3>
        <p className="text-slate-500 text-sm mt-0.5">8-dimension Plutchik emotion model</p>
      </div>

      {/* Dominant emotion badge */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${dominantColor}20`, border: `1px solid ${dominantColor}40` }}
        >
          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: dominantColor }} />
        </div>
        <div>
          <p className="text-slate-500 text-xs">Dominant Emotion</p>
          <p className="text-white font-semibold text-sm">{emotion}</p>
        </div>
        <div
          className="ml-auto text-xs font-medium px-2 py-1 rounded-lg"
          style={{ backgroundColor: `${dominantColor}15`, color: dominantColor }}
        >
          Primary
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis
              dataKey="emotion"
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Emotion"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
