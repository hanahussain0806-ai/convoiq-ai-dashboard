"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { AnalysisResult } from "@/lib/types";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
const C = {
  bg:        "#060910",
  surface:   "#0c1018",
  card:      "#111827",
  cardHover: "#141e2e",
  border:    "rgba(255,255,255,0.06)",
  borderBright: "rgba(255,255,255,0.11)",
  cyan:      "#00e5a0",
  cyanDim:   "rgba(0,229,160,0.12)",
  cyanGlow:  "rgba(0,229,160,0.22)",
  amber:     "#f5c842",
  amberDim:  "rgba(245,200,66,0.12)",
  red:       "#ff4560",
  redDim:    "rgba(255,69,96,0.12)",
  blue:      "#4f8ef7",
  blueDim:   "rgba(79,142,247,0.12)",
  purple:    "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  orange:    "#fb923c",
  orangeDim: "rgba(251,146,60,0.12)",
  t1:        "#e8edf5",
  t2:        "#8892a4",
  t3:        "#4a5568",
  fontDisplay: "'Syne', 'DM Sans', sans-serif",
  fontBody:    "'DM Sans', sans-serif",
  fontMono:    "'DM Mono', 'Fira Mono', monospace",
};

/* ─────────────────────────── HELPERS ─────────────────────────── */
function sentimentColor(s: string) {
  if (s === "Positive") return C.cyan;
  if (s === "Negative") return C.red;
  return C.amber;
}
function sentimentBg(s: string) {
  if (s === "Positive") return C.cyanDim;
  if (s === "Negative") return C.redDim;
  return C.amberDim;
}
function kpiColor(val: number, invert = false) {
  const good = invert ? val < 40 : val >= 65;
  const warn = invert ? val < 65 : val >= 35;
  if (good) return C.cyan;
  if (warn) return C.amber;
  return C.red;
}

/* ─────────────────────────── GAUGE ─────────────────────────── */
function Gauge({ value, color, size = 100 }: { value: number; color: string; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value, 100) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size*0.09} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={size*0.09} strokeLinecap="round"
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeDashoffset={circ * 0.25}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: "stroke-dasharray 1s ease" }}
      />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size*0.22} fontWeight={700} fontFamily={C.fontDisplay}>{value}</text>
    </svg>
  );
}

/* ─────────────────────────── KPI CARD ─────────────────────────── */
function KPICard({
  label, value, sub, icon, color, barValue, barInvert
}: {
  label: string; value: string | number; sub: string;
  icon: string; color: string; barValue?: number; barInvert?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const displayVal = typeof barValue === "number" ? barValue : undefined;
  const barCol = displayVal !== undefined ? kpiColor(displayVal, barInvert) : color;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHover : C.card,
        border: `1px solid ${hov ? C.borderBright : C.border}`,
        borderRadius: 14, padding: "20px 22px",
        transition: "all 0.2s", cursor: "default",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17,
        }}>{icon}</div>
        {displayVal !== undefined && (
          <span style={{
            fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.05em",
            color: barCol, background: `${barCol}15`,
            border: `1px solid ${barCol}25`, borderRadius: 20, padding: "3px 10px"
          }}>
            {barInvert ? (displayVal < 40 ? "Low" : displayVal < 70 ? "Med" : "High")
                       : (displayVal >= 65 ? "Good" : displayVal >= 35 ? "Mid" : "Low")}
          </span>
        )}
      </div>
      <div>
        {/* FIXED: Changed fontDisplay to fontBody to stop numbers from stretching */}
        <div style={{ fontSize: 32, fontWeight: 700, color: C.t1, fontFamily: C.fontBody, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 8, fontFamily: C.fontMono, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      </div>
      {displayVal !== undefined && (
        <div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              width: `${displayVal}%`, height: "100%",
              background: `linear-gradient(90deg, ${barCol}99, ${barCol})`,
              borderRadius: 2, transition: "width 1.2s ease",
            }} />
          </div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 5 }}>{sub}</div>
        </div>
      )}
      {displayVal === undefined && <div style={{ fontSize: 11, color: C.t3 }}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────── SENTIMENT BADGE ─────────────────────────── */
function SentimentBadge({ s }: { s: string }) {
  const col = sentimentColor(s);
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, fontFamily: C.fontMono, letterSpacing: "0.08em",
      color: col, background: `${col}15`, border: `1px solid ${col}25`,
      borderRadius: 4, padding: "2px 8px",
    }}>{s.toUpperCase()}</span>
  );
}

/* ─────────────────────────── CUSTOM TOOLTIPS ─────────────────────────── */
const TimelineTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const col = sentimentColor(d.label);
  return (
    <div style={{ background: "#0d1117", border: `1px solid ${col}30`, borderRadius: 10, padding: "10px 14px", maxWidth: 240 }}>
      <SentimentBadge s={d.label} />
      <p style={{ fontSize: 12, color: C.t2, marginTop: 6, lineHeight: 1.5 }}>{d.sentence?.slice(0, 100)}{d.sentence?.length > 100 ? "…" : ""}</p>
      {d.emotion && <p style={{ fontSize: 11, color: C.purple, marginTop: 4, fontFamily: C.fontMono }}>{d.emotion}</p>}
    </div>
  );
};

const RadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { emotion, value } = payload[0].payload;
  return (
    <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ fontSize: 12, color: C.t1, fontWeight: 600 }}>{emotion}</p>
      <p style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>Intensity: <span style={{ color: C.purple }}>{value}%</span></p>
    </div>
  );
};

/* ─────────────────────────── MAIN DASHBOARD ─────────────────────────── */
export default function DashboardShell() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("convoiq_result");
    if (raw) {
      try { setResult(JSON.parse(raw)); }
      catch { console.error("Failed to parse dashboard data"); }
    }
  }, []);

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p style={{ color: C.t2, fontFamily: C.fontBody }}>No analysis data found.</p>
          <a href="/upload" style={{ color: C.cyan, fontSize: 14, marginTop: 8, display: "block" }}>← Go back to upload</a>
        </div>
      </div>
    );
  }

  // FIXED: Bulletproof Data Adapter. This translates api.ts data directly into the dashboard's format.
  const rawSentences = result.sentence_level_analysis || result.sentences || [];
  const sentences = rawSentences.map((s: any) => ({
    sentence: s.sentence || s.text || "...", // Accounts for API outputting 'text'
    sentiment: s.sentiment || s.label || "Neutral",
    emotion: s.emotion || "Neutral"
  }));

  const rawKpis = result.business_kpis || result.kpis || {};
  const kpis = {
    frustration: rawKpis.customer_frustration_index ?? rawKpis.customerFrustration ?? 0,
    empathy: rawKpis.agent_empathy_score ?? rawKpis.agentEmpathy ?? 0,
    churn_risk_pct: rawKpis.churn_risk_percentage ?? rawKpis.churnRisk ?? 0,
    churn_risk_str: rawKpis.churn_risk ?? (rawKpis.churnRisk > 60 ? "High" : rawKpis.churnRisk > 30 ? "Medium" : "Low"),
    resolution: rawKpis.resolution_probability ?? rawKpis.resolutionProbability ?? 0,
    resolved: rawKpis.issue_resolved ?? (rawKpis.resolutionProbability > 80 ? true : false)
  };

  const overall_sentiment = result.overall_sentiment || result.overallSentiment || "Neutral";
  const emotion_detected = result.emotion_detected || (result.emotions && result.emotions.length > 0 ? result.emotions[0].emotion : "Neutral");
  const summary = result.summary || "Analysis complete.";
  const topKeywords = result.topKeywords || [];
  const callDuration = result.callDuration || 0;

  /* ── Chart data ── */
  const timelineData = sentences.map((s: any, i: number) => ({
    index: i + 1,
    score: s.sentiment === "Positive" ? 1 : s.sentiment === "Negative" ? -1 : 0,
    sentence: s.sentence,
    emotion: s.emotion,
    label: s.sentiment,
  }));

  const EMOTIONS = ["Joy","Trust","Fear","Surprise","Sadness","Disgust","Anger","Anticipation"];
  const emotionCounts: Record<string, number> = {};
  EMOTIONS.forEach(e => (emotionCounts[e] = 0));
  
  sentences.forEach((s: any) => {
    const m = EMOTIONS.find(e => e.toLowerCase() === s.emotion?.toLowerCase());
    if (m) emotionCounts[m]++;
    const top = EMOTIONS.find(e => e.toLowerCase() === emotion_detected?.toLowerCase());
    if (top && emotionCounts[top] === 0) emotionCounts[top] = 2; // Guarantee dominant shows up
  });
  
  const maxE = Math.max(...Object.values(emotionCounts), 1);
  const radarData = EMOTIONS.map(e => ({ emotion: e, value: Math.round((emotionCounts[e] / maxE) * 100) }));

  const totalSentences = sentences.length || 1;
  const posCount = sentences.filter((s: any) => s.sentiment === "Positive").length;
  const negCount = sentences.filter((s: any) => s.sentiment === "Negative").length;
  const neuCount = sentences.filter((s: any) => s.sentiment === "Neutral").length;
  const pieData = [
    { name: "Positive", value: posCount, color: C.cyan },
    { name: "Negative", value: negCount, color: C.red },
    { name: "Neutral",  value: neuCount, color: C.amber },
  ].filter(d => d.value > 0);

  const emotionBarData = Object.entries(emotionCounts)
    .filter(([,v]) => v > 0)
    .sort((a,b) => b[1]-a[1])
    .slice(0,6)
    .map(([k,v]) => ({ name: k, value: Math.round((v/maxE)*100) }));

  const sentimentCol = sentimentColor(overall_sentiment);
  // Guarantee a score out of 100 based on sentiment if API score is missing
  let calcScore = overall_sentiment === "Positive" ? 85 : overall_sentiment === "Negative" ? 15 : 50;
  const sentimentScore = result.overallScore ? Math.round(((result.overallScore) + 1) * 50) : calcScore;

  /* ── KPI normalise (Guarantee 0-100 scale regardless of API out of 10 or 100) ── */
  const frustNorm = kpis.frustration <= 10 ? kpis.frustration * 10 : kpis.frustration;
  const empNorm = kpis.empathy <= 10 ? kpis.empathy * 10 : kpis.empathy;
  const churnNorm = kpis.churn_risk_pct > 0 ? kpis.churn_risk_pct : (kpis.churn_risk_str === "High" ? 75 : kpis.churn_risk_str === "Medium" ? 45 : 20);
  const resProbNorm = kpis.resolution <= 10 ? kpis.resolution * 10 : kpis.resolution;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.t1, fontFamily: C.fontBody }}>
      {/* ── GRID OVERLAY ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,9,16,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" fill={C.cyan} opacity="0.9"/>
            <path d="M10 6L14 8V12L10 14L6 12V8L10 6Z" fill={C.bg}/>
          </svg>
          <span style={{ fontFamily: C.fontDisplay, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>ConvoIQ</span>
          <div style={{ width: 1, height: 18, background: C.border, margin: "0 4px" }} />
          <span style={{ fontSize: 12, color: C.t3, fontFamily: C.fontMono }}>Intelligence Report</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: sentimentBg(overall_sentiment),
            border: `1px solid ${sentimentCol}25`, borderRadius: 20, padding: "5px 14px",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: sentimentCol, boxShadow: `0 0 8px ${sentimentCol}` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: sentimentCol, fontFamily: C.fontMono, letterSpacing: "0.06em" }}>
              {overall_sentiment.toUpperCase()}
            </span>
          </div>
          <a href="/upload" style={{
            fontSize: 12, color: C.t3, fontFamily: C.fontMono, textDecoration: "none",
            padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 8,
          }}>← New Analysis</a>
        </div>
      </header>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1440, margin: "0 auto", padding: "32px 32px 64px" }}>

        {/* ════════ ROW 1: HERO METRICS ════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 16, marginBottom: 20 }}>

          {/* Sentiment Score gauge */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${sentimentCol}, transparent)`, opacity: 0.6 }} />
            <div style={{ fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.1em", color: C.t3, textTransform: "uppercase" }}>Sentiment Score</div>
            <Gauge value={sentimentScore} color={sentimentCol} size={110} />
            <div style={{ fontSize: 12, color: C.t2, textAlign: "center" }}>
              <span style={{ color: sentimentCol, fontWeight: 600 }}>{overall_sentiment}</span> call outcome
            </div>
          </div>

          {/* Emotion Detected */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.1em", color: C.t3, textTransform: "uppercase", marginBottom: 8 }}>Primary Emotion</div>
            <div>
              <div style={{ fontSize: 40, marginBottom: 8 }}>
                {emotion_detected === "Joy" || emotion_detected === "Happy" ? "😊"
                  : emotion_detected === "Anger" || emotion_detected === "Frustrated" ? "😠"
                  : emotion_detected === "Sadness" || emotion_detected === "Disappointed" ? "😔"
                  : emotion_detected === "Fear" || emotion_detected === "Anxious" ? "😰"
                  : emotion_detected === "Surprise" ? "😮"
                  : emotion_detected === "Trust" || emotion_detected === "Satisfied" ? "🤝"
                  : "😐"}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: C.fontDisplay, color: C.t1 }}>{emotion_detected}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>Dominant conversational emotion</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {pieData.map(p => (
                <span key={p.name} style={{ fontSize: 10, fontFamily: C.fontMono, color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}25`, borderRadius: 4, padding: "2px 8px" }}>
                  {p.name} {Math.round((p.value/totalSentences)*100)}%
                </span>
              ))}
            </div>
          </div>

          {/* Call Stats */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.1em", color: C.t3, textTransform: "uppercase" }}>Call Analytics</div>
            {[
              { label: "Sentences Analysed", val: sentences.length, col: C.blue },
              { label: "Resolution Status", val: kpis.resolved ? "Resolved ✓" : "Open ✗", col: kpis.resolved ? C.cyan : C.red },
              { label: "Call Duration", val: callDuration ? `${Math.floor(callDuration/60)}m ${callDuration%60}s` : "—", col: C.t2 },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.t3 }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.col, fontFamily: C.fontMono }}>{item.val}</span>
              </div>
            ))}
            <div style={{ height: 1, background: C.border, margin: "2px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.t3 }}>Churn Risk</span>
              <span style={{
                fontSize: 11, fontWeight: 700, fontFamily: C.fontMono,
                color: kpis.churn_risk_str === "High" ? C.red : kpis.churn_risk_str === "Medium" ? C.amber : C.cyan,
                background: kpis.churn_risk_str === "High" ? C.redDim : kpis.churn_risk_str === "Medium" ? C.amberDim : C.cyanDim,
                border: `1px solid ${kpis.churn_risk_str === "High" ? C.red : kpis.churn_risk_str === "Medium" ? C.amber : C.cyan}25`,
                borderRadius: 6, padding: "3px 10px",
              }}>{kpis.churn_risk_str}</span>
            </div>
          </div>

          {/* AI Summary */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px",
            display: "flex", flexDirection: "column", gap: 12, gridRow: "span 1",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, fontFamily: C.fontMono, letterSpacing: "0.1em", color: C.t3, textTransform: "uppercase" }}>AI Executive Summary</div>
              <span style={{ fontSize: 9, color: C.t3, fontFamily: C.fontMono }}>Llama 3.3 · Groq</span>
            </div>
            <p style={{ fontSize: 13, color: "#bdc6d4", lineHeight: 1.8, flex: 1 }}>{summary}</p>
            {topKeywords && topKeywords.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {topKeywords.slice(0,6).map((kw: string) => (
                  <span key={kw} style={{ fontSize: 10, color: C.t3, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 8px", fontFamily: C.fontMono }}>{kw}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════ ROW 2: KPI GRID (6 cards) ════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 20 }}>
          <KPICard
            label="Customer Frustration"
            value={`${Math.round(frustNorm)}%`}
            sub={`${frustNorm < 40 ? "Low" : frustNorm < 70 ? "Moderate" : "High"} frustration level`}
            icon="😤" color={C.red}
            barValue={Math.round(frustNorm)} barInvert
          />
          <KPICard
            label="Agent Empathy"
            value={`${Math.round(empNorm)}%`}
            sub={`${empNorm >= 65 ? "Strong" : empNorm >= 35 ? "Moderate" : "Weak"} empathy signals`}
            icon="💚" color={C.cyan}
            barValue={Math.round(empNorm)}
          />
          <KPICard
            label="Churn Risk"
            value={`${Math.round(churnNorm)}%`}
            sub="Customer retention signal"
            icon="📉" color={C.orange}
            barValue={Math.round(churnNorm)} barInvert
          />
          <KPICard
            label="Resolution Probability"
            value={`${Math.round(resProbNorm)}%`}
            sub="Issue closure likelihood"
            icon="✅" color={C.blue}
            barValue={Math.round(resProbNorm)}
          />
          <KPICard
            label="Positive Utterances"
            value={posCount}
            sub={`${Math.round((posCount/totalSentences)*100)}% of conversation`}
            icon="📈" color={C.cyan}
            barValue={Math.round((posCount/totalSentences)*100)}
          />
          <KPICard
            label="Interaction Quality"
            value={empNorm >= 65 && kpis.resolved ? "High" : empNorm >= 40 ? "Mid" : "Low"}
            sub="CX quality composite score"
            icon="⭐" color={C.purple}
            barValue={Math.round((empNorm + (kpis.resolved ? 20 : 0) + resProbNorm) / 2.2)}
          />
        </div>

        {/* ════════ ROW 3: TIMELINE + EMOTION RADAR ════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 20 }}>

          {/* Sentiment Timeline */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: C.fontDisplay }}>Sentiment Trajectory</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Sentence-by-sentence emotional arc</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["Positive", C.cyan], ["Neutral", C.amber], ["Negative", C.red]].map(([lbl, col]) => (
                  <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: col as string }} />
                    <span style={{ fontSize: 11, color: C.t3 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.cyan} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.cyan} stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.red} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={C.red} stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="index" tick={{ fontSize: 10, fill: C.t3 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[-1.2, 1.2]} hide />
                  <Tooltip content={<TimelineTooltip />} />
                  <Area
                    type="monotone" dataKey="score"
                    stroke={C.cyan} strokeWidth={2.5} fill="url(#posGrad)"
                    dot={(props: any) => {
                      const col = props.payload.score > 0 ? C.cyan : props.payload.score < 0 ? C.red : C.amber;
                      return <circle key={props.key} cx={props.cx} cy={props.cy} r={3.5} fill={col} stroke={C.card} strokeWidth={1.5} />;
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution bar */}
            <div style={{ marginTop: 16 }}>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", display: "flex" }}>
                <div style={{ flex: posCount, background: C.cyan, opacity: 0.8 }} />
                <div style={{ flex: neuCount, background: C.amber, opacity: 0.7 }} />
                <div style={{ flex: negCount, background: C.red, opacity: 0.8 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {[["Positive", posCount, C.cyan], ["Neutral", neuCount, C.amber], ["Negative", negCount, C.red]].map(([lbl, cnt, col]) => (
                  <span key={lbl as string} style={{ fontSize: 10, color: col as string, fontFamily: C.fontMono }}>
                    {lbl}: {cnt} ({Math.round(((cnt as number)/totalSentences)*100)}%)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Radar */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: C.fontDisplay }}>Emotion Profile</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Plutchik 8-dimension model</div>
            </div>
            {/* Dominant emotion */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: `${C.purple}10`, border: `1px solid ${C.purple}20`, borderRadius: 10, marginBottom: 12,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple, boxShadow: `0 0 8px ${C.purple}` }} />
              <div>
                <div style={{ fontSize: 10, color: C.t3, fontFamily: C.fontMono }}>DOMINANT</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{emotion_detected}</div>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="emotion" tick={{ fill: C.t3, fontSize: 10 }} />
                  <Tooltip content={<RadarTooltip />} />
                  <Radar name="Emotion" dataKey="value" stroke={C.purple} fill={C.purple} fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ════════ ROW 4: EMOTION BAR + TRANSCRIPT ════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, marginBottom: 20 }}>

          {/* Emotion Bar Chart */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: C.fontDisplay, marginBottom: 4 }}>Emotion Distribution</div>
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 16 }}>Frequency of detected emotions</div>
            {emotionBarData.length > 0 ? (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionBarData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: C.t3 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: C.t2 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Intensity"]} contentStyle={{ background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {emotionBarData.map((entry, i) => {
                        const colors = [C.purple, C.blue, C.cyan, C.amber, C.red, C.orange];
                        return <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.85} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: C.t3, fontSize: 13 }}>No emotion data detected</p>
              </div>
            )}
          </div>

          {/* Sentiment Pie */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: C.fontDisplay, marginBottom: 4 }}>Sentiment Breakdown</div>
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 16 }}>Distribution across the conversation</div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 200, height: 200, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.9} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "sentences"]} contentStyle={{ background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                {pieData.map(p => (
                  <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
                        <span style={{ fontSize: 13, color: C.t2 }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: 22, fontWeight: 800, color: p.color, fontFamily: C.fontDisplay }}>
                        {Math.round((p.value / totalSentences) * 100)}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${(p.value/totalSentences)*100}%`, height: "100%", background: p.color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, color: C.t3, fontFamily: C.fontMono }}>{p.value} sentences</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════ ROW 5: NLP TRANSCRIPT ════════ */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1, fontFamily: C.fontDisplay }}>NLP Transcript Analysis</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Sentence-level sentiment & emotion tagging</div>
            </div>
            <span style={{ fontSize: 10, fontFamily: C.fontMono, color: C.t3 }}>{sentences.length} sentences</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
            {sentences.map((s: any, i: number) => {
              const col = sentimentColor(s.sentiment);
              return (
                <div key={i} style={{
                  display: "flex", gap: 14, alignItems: "flex-start",
                  padding: "14px 16px",
                  background: `${col}07`,
                  border: `1px solid ${col}15`,
                  borderLeft: `3px solid ${col}`,
                  borderRadius: "0 10px 10px 0",
                  transition: "background 0.15s",
                }}>
                  <span style={{ fontSize: 10, fontFamily: C.fontMono, color: C.t3, minWidth: 26, paddingTop: 2 }}>#{i+1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "#ccd4e0", lineHeight: 1.65, margin: 0 }}>{s.sentence}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" as const }}>
                      <SentimentBadge s={s.sentiment} />
                      {s.emotion && (
                        <span style={{
                          fontSize: 10, fontFamily: C.fontMono, color: C.purple,
                          background: C.purpleDim, border: `1px solid ${C.purple}25`,
                          borderRadius: 4, padding: "2px 8px",
                        }}>🎭 {s.emotion}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════ FOOTER ════════ */}
        <div style={{ marginTop: 32, textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
          <p style={{ fontSize: 11, color: C.t3, fontFamily: C.fontMono }}>
            ConvoIQ · AI CoE Assessment · Powered by Llama 3.3 via Groq · n8n Orchestration
          </p>
        </div>

      </div>
    </div>
  );
}