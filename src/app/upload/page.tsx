"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { analyzeConversation } from "@/lib/api";

const SAMPLE_TEXT = `Agent: Thank you for calling ConvoIQ support, how can I help you today?
Customer: I've been waiting on hold for 45 minutes! This is completely unacceptable.
Agent: I sincerely apologize for the wait time. I completely understand your frustration.
Customer: My internet has been down for two days and nobody has helped me.
Agent: I am very sorry to hear that. I see your account has a connectivity issue.
Customer: This is the worst service I have ever received, I want to cancel my subscription right now.`;

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "reading" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const processFile = useCallback((f: File) => {
    if (!f.name.endsWith(".txt")) {
      setError("Please upload a .txt conversation file.");
      return;
    }
    setFile(f);
    setStatus("reading");
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setStatus("idle");
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) { setError("No text to analyze."); return; }
    setStatus("analyzing");
    setError("");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 88));
    }, 400);

    try {
      const result = await analyzeConversation(text);
      clearInterval(interval);
      setProgress(100);
      sessionStorage.setItem("convoiq_result", JSON.stringify(result));
      setStatus("done");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err) {
      clearInterval(interval);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Analysis failed. Check your n8n backend.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.gridOverlay} />

      <header style={styles.header}>
        <div style={styles.logo}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" fill="#00e5a0" opacity="0.9"/>
            <path d="M10 6L14 8V12L10 14L6 12V8L10 6Z" fill="#080b10"/>
          </svg>
          <span style={styles.logoText}>ConvoIQ</span>
        </div>
        <div style={styles.badge}>AI CoE Assessment</div>
      </header>

      <main style={styles.main}>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Upload Conversation</h1>
          <p style={styles.subtitle}>
            Drop a .txt transcript to begin AI-powered sentiment analysis via Llama 3.3 on Groq
          </p>
        </div>

        <div style={styles.pipeline}>
          {["File Upload", "→", "n8n Webhook", "→", "Llama 3.3 / Groq", "→", "Dashboard"].map((step, i) => (
            <span key={i} style={step === "→" ? styles.pipelineArrow : styles.pipelineStep}>
              {step}
            </span>
          ))}
        </div>

        <div
          style={{
            ...styles.dropZone,
            ...(dragging ? styles.dropZoneActive : {}),
            ...(file ? styles.dropZoneHasFile : {}),
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            onChange={onFileChange}
            style={{ display: "none" }}
          />

          {file ? (
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="rgba(0,229,160,0.2)" stroke="#00e5a0" strokeWidth="1.5"/>
                  <path d="M14 2V8H20" stroke="#00e5a0" strokeWidth="1.5"/>
                  <path d="M9 13H15M9 17H13" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={styles.fileName}>{file.name}</div>
                <div style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB · Ready to analyze</div>
              </div>
              <button style={styles.clearBtn} onClick={(e) => { e.stopPropagation(); setFile(null); setText(""); }}>
                ✕
              </button>
            </div>
          ) : (
            <div style={styles.dropContent}>
              <div style={styles.uploadIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 21H19" stroke="#8892a4" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3 15V17C3 19.2 4.8 21 7 21H17C19.2 21 21 19.2 21 17V15" stroke="#8892a4" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={styles.dropLabel}>
                {dragging ? "Release to upload" : "Drop your .txt conversation file here"}
              </p>
              <p style={styles.dropSub}>or click to browse · supports plain text transcripts</p>
            </div>
          )}
        </div>

        {text && (
          <div style={styles.preview}>
            <div style={styles.previewHeader}>
              <span style={styles.previewLabel}>TRANSCRIPT PREVIEW</span>
              <span style={styles.previewCount}>{text.split('\n').filter(Boolean).length} lines · {text.split(' ').length} words</span>
            </div>
            <pre style={styles.previewText}>{text.slice(0, 600)}{text.length > 600 ? "\n…" : ""}</pre>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <span style={{ color: "#ff4757", marginRight: "8px" }}>⚠</span>
            {error}
          </div>
        )}

        {/* --- ADDED: Dual Button Layout --- */}
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button
            onClick={() => { setText(SAMPLE_TEXT); setFile(null); setError(""); }}
            disabled={status === "analyzing"}
            style={{
              ...styles.analyzeBtn,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8892a4",
              flex: "0 0 auto",
              width: "auto",
              padding: "16px 24px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#e8edf5"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8892a4"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            Load Sample
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!text || status === "analyzing"}
            style={{
              ...styles.analyzeBtn,
              flex: "1",
              opacity: (!text || status === "analyzing") ? 0.5 : 1,
              cursor: (!text || status === "analyzing") ? "not-allowed" : "pointer",
            }}
          >
            {status === "analyzing" ? (
              <div style={styles.analyzingContent}>
                <div style={styles.spinner} />
                <span>Analyzing with Llama 3.3...</span>
              </div>
            ) : (
              "Run Sentiment Analysis →"
            )}
          </button>
        </div>
        {/* -------------------------------- */}

        {status === "analyzing" && (
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080b10", position: "relative" },
  gridOverlay: { position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,11,16,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoText: { fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "#e8edf5" },
  badge: { fontSize: "11px", fontWeight: 500, color: "#00e5a0", background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.2)", borderRadius: "20px", padding: "4px 12px", letterSpacing: "0.04em" },
  main: { maxWidth: "680px", margin: "0 auto", padding: "60px 24px", display: "flex", flexDirection: "column", gap: "24px" },
  titleBlock: { textAlign: "center" },
  title: { fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, color: "#e8edf5", letterSpacing: "-0.03em", marginBottom: "12px" },
  subtitle: { fontSize: "15px", color: "#8892a4", lineHeight: 1.6 },
  pipeline: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" as const },
  pipelineStep: { fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#00e5a0", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: "4px", padding: "4px 10px" },
  pipelineArrow: { color: "#4a5568", fontSize: "14px" },
  dropZone: { border: "2px dashed rgba(255,255,255,0.08)", borderRadius: "16px", padding: "48px 32px", textAlign: "center" as const, cursor: "pointer", transition: "all 0.2s ease", background: "#0d1117" },
  dropZoneActive: { borderColor: "#00e5a0", background: "rgba(0,229,160,0.04)", boxShadow: "0 0 32px rgba(0,229,160,0.1)" },
  dropZoneHasFile: { borderStyle: "solid", borderColor: "rgba(0,229,160,0.3)", background: "rgba(0,229,160,0.04)" },
  fileInfo: { display: "flex", alignItems: "center", gap: "16px", textAlign: "left" as const },
  fileIcon: { flexShrink: 0 },
  fileName: { fontSize: "15px", fontWeight: 600, color: "#e8edf5", fontFamily: "'DM Mono', monospace" },
  fileSize: { fontSize: "12px", color: "#00e5a0", marginTop: "4px" },
  clearBtn: { marginLeft: "auto", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "16px", padding: "4px 8px", borderRadius: "4px" },
  dropContent: {},
  uploadIcon: { marginBottom: "16px", display: "flex", justifyContent: "center" },
  dropLabel: { fontSize: "16px", fontWeight: 500, color: "#e8edf5", marginBottom: "8px" },
  dropSub: { fontSize: "13px", color: "#4a5568" },
  preview: { background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" },
  previewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  previewLabel: { fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", color: "#4a5568", fontFamily: "'DM Mono', monospace" },
  previewCount: { fontSize: "11px", color: "#8892a4", fontFamily: "'DM Mono', monospace" },
  previewText: { padding: "16px", fontSize: "12px", fontFamily: "'DM Mono', monospace", color: "#8892a4", lineHeight: 1.8, overflowX: "auto" as const, whiteSpace: "pre-wrap" as const, maxHeight: "200px", overflowY: "auto" as const },
  errorBox: { background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.2)", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#ff6b78" },
  analyzeBtn: { background: "#00e5a0", color: "#080b10", border: "none", borderRadius: "10px", padding: "16px", fontSize: "15px", fontWeight: 700, fontFamily: "'Syne', sans-serif", width: "100%", transition: "all 0.15s", letterSpacing: "0.01em" },
  analyzingContent: { display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" },
  spinner: { width: "18px", height: "18px", border: "2px solid rgba(8,11,16,0.3)", borderTopColor: "#080b10", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  progressTrack: { height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" },
  progressBar: { height: "100%", background: "linear-gradient(90deg, #00e5a0, #4f8ef7)", borderRadius: "2px", transition: "width 0.4s ease" },
};