"use client";

import { SentenceAnalysis } from "@/lib/types";
import { buildTimelineData } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 max-w-[220px] shadow-xl">
      <p className="text-slate-400 text-xs mb-1">Utterance #{d.index}</p>
      <p className="text-white text-xs font-medium leading-relaxed">{d.sentence}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-semibold ${d.label === "Positive" ? "text-emerald-400" : d.label === "Negative" ? "text-rose-400" : "text-amber-400"}`}>
          {d.label}
        </span>
        <span className="text-slate-600 text-xs">· {d.emotion}</span>
      </div>
    </div>
  );
};

export default function SentimentTimeline({ sentences }: { sentences: SentenceAnalysis[] }) {
  const data = buildTimelineData(sentences);

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 h-full">
      <div className="mb-5">
        <h3 className="text-white font-semibold">Sentiment Timeline</h3>
        <p className="text-slate-500 text-sm mt-0.5">Emotional arc across conversation utterances</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="index" stroke="#475569" tick={{ fontSize: 11 }} label={{ value: "Utterance", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 11 }} />
          <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={[-1.5, 1.5]} ticks={[-1, 0, 1]}
            tickFormatter={(v) => v === 1 ? "+" : v === -1 ? "−" : "○"} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#334155" strokeDasharray="4 4" />
          <Area
            type="monotone" dataKey="score"
            stroke="#6366f1" strokeWidth={2}
            fill="url(#sentGrad)"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const color = payload.label === "Positive" ? "#10B981"
                : payload.label === "Negative" ? "#F43F5E" : "#F59E0B";
              return <circle key={`dot-${payload.index}`} cx={cx} cy={cy} r={4} fill={color} stroke="#080D1A" strokeWidth={2} />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 justify-center">
        {[["#10B981","Positive"],["#F59E0B","Neutral"],["#F43F5E","Negative"]].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-500 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}