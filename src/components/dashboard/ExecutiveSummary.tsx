"use client";

import { AnalysisResult } from "@/lib/types";
import { getSentimentColor } from "@/lib/utils";

interface Props {
  result: AnalysisResult;
}

export function ExecutiveSummary({ result }: Props) {
  const sentimentColor = getSentimentColor(result.overallSentiment);
  const score = Math.round((result.overallScore + 1) * 50); // convert -1..1 to 0..100

  const verdicts = {
    Positive: { icon: "↑", label: "Positive Outcome", desc: "Call resolved with favorable customer experience" },
    Negative: { icon: "↓", label: "Negative Outcome", desc: "Call ended with unresolved issues or poor experience" },
    Neutral:  { icon: "→", label: "Neutral Outcome",  desc: "Mixed or inconclusive conversation dynamics" },
  };
  const verdict = verdicts[result.overallSentiment];

  return (
    <div style={styles.card}>
      {/* Glow accent */}
      <div style={{ ...styles.glowAccent, background: `radial-gradient(ellipse at top left, ${sentimentColor}18 0%, transparent 60%)` }} />

      <div style={styles.top}>
        {/* Left: Verdict */}
        <div style={styles.verdictBlock}>
          <div style={{ ...styles.verdictBadge, background: `${sentimentColor}15`, border: `1px solid ${sentimentColor}30` }}>
            <span style={{ ...styles.verdictIcon, color: sentimentColor }}>{verdict.icon}</span>
            <span style={{ ...styles.verdictLabel, color: sentimentColor }}>
              {result.overallSentiment.toUpperCase()}
            </span>
          </div>
          <h2 style={styles.verdictTitle}>{verdict.label}</h2>
          <p style={styles.verdictDesc}>{verdict.desc}</p>
        </div>

        {/* Right: Score gauge */}
        <div style={styles.gaugeBlock}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background track */}
            <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10"/>
            {/* Score arc */}
            <circle
              cx="70" cy="70" r="56"
              fill="none"
              stroke={sentimentColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 351.86} 351.86`}
              strokeDashoffset="87.96"
              style={{ filter: `drop-shadow(0 0 8px ${sentimentColor}60)` }}
            />
            {/* Center text */}
            <text x="70" y="64" textAnchor="middle" fill={sentimentColor} fontSize="28" fontWeight="700" fontFamily="'Syne', sans-serif">
              {score}
            </text>
            <text x="70" y="82" textAnchor="middle" fill="#8892a4" fontSize="11" fontFamily="'DM Sans', sans-serif">
              SCORE
            </text>
          </svg>
          {result.callDuration && (
            <div style={styles.duration}>
              <span style={styles.durationLabel}>CALL DURATION</span>
              <span style={styles.durationValue}>
                {Math.floor(result.callDuration / 60)}m {result.callDuration % 60}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summaryBlock}>
        <div style={styles.summaryHeader}>
          <span style={styles.summaryLabel}>AI EXECUTIVE SUMMARY</span>
          <span style={styles.poweredBy}>via Llama 3.3 · Groq</span>
        </div>
        <p style={styles.summaryText}>{result.summary}</p>
      </div>

      {/* Keywords */}
      {result.topKeywords.length > 0 && (
        <div style={styles.keywords}>
          {result.topKeywords.slice(0, 8).map((kw) => (
            <span key={kw} style={styles.keyword}>{kw}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "relative",
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "32px",
    overflow: "hidden",
  },
  glowAccent: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  top: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "32px",
    marginBottom: "28px",
    flexWrap: "wrap" as const,
  },
  verdictBlock: {
    flex: 1,
    minWidth: "240px",
  },
  verdictBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
    padding: "6px 14px",
    marginBottom: "16px",
  },
  verdictIcon: {
    fontSize: "18px",
    fontWeight: 700,
  },
  verdictLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    fontFamily: "'DM Mono', monospace",
  },
  verdictTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "26px",
    fontWeight: 800,
    color: "#e8edf5",
    letterSpacing: "-0.02em",
    marginBottom: "8px",
  },
  verdictDesc: {
    fontSize: "14px",
    color: "#8892a4",
    lineHeight: 1.6,
  },
  gaugeBlock: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  duration: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "2px",
  },
  durationLabel: {
    fontSize: "9px",
    letterSpacing: "0.12em",
    color: "#4a5568",
    fontFamily: "'DM Mono', monospace",
  },
  durationValue: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#e8edf5",
    fontFamily: "'DM Mono', monospace",
  },
  summaryBlock: {
    background: "#141b26",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  summaryLabel: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#4a5568",
    fontFamily: "'DM Mono', monospace",
  },
  poweredBy: {
    fontSize: "10px",
    color: "#8892a4",
    fontFamily: "'DM Mono', monospace",
  },
  summaryText: {
    fontSize: "14px",
    color: "#c5cdd9",
    lineHeight: 1.8,
  },
  keywords: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },
  keyword: {
    fontSize: "11px",
    color: "#8892a4",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "4px",
    padding: "4px 10px",
    fontFamily: "'DM Mono', monospace",
  },
};
