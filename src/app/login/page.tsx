"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic auth — any non-empty credentials work
    await new Promise((r) => setTimeout(r, 600));
    if (email && password) {
      localStorage.setItem("ciq_auth", "1");
      router.push("/upload");
    } else {
      setError("Please enter your credentials.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.gridOverlay} />

      {/* Glow orb */}
      <div style={styles.glowOrb} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" fill="#00e5a0" opacity="0.9"/>
              <path d="M10 6L14 8V12L10 14L6 12V8L10 6Z" fill="#080b10"/>
            </svg>
          </div>
          <span style={styles.logoText}>ConvoIQ</span>
        </div>

        <h1 style={styles.heading}>Sign in to your workspace</h1>
        <p style={styles.subheading}>
          AI-powered conversation intelligence
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@company.com"
              style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#00e5a0'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,160,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              onFocus={(e) => { e.target.style.borderColor = '#00e5a0'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,160,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = '#00f5ac'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = '#00e5a0'; }}
          >
            {loading ? (
              <span style={styles.loadingDots}>Authenticating<span className="dots">...</span></span>
            ) : (
              "Continue →"
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Secured workspace · AI CoE Assessment Platform
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080b10",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  glowOrb: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "400px",
    background: "radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    margin: "24px",
    padding: "40px",
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoMark: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(0,229,160,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(0,229,160,0.2)",
  },
  logoText: {
    fontFamily: "var(--font-display, 'Syne', sans-serif)",
    fontSize: "18px",
    fontWeight: 700,
    color: "#e8edf5",
    letterSpacing: "-0.01em",
  },
  heading: {
    fontFamily: "var(--font-display, 'Syne', sans-serif)",
    fontSize: "22px",
    fontWeight: 700,
    color: "#e8edf5",
    letterSpacing: "-0.02em",
    marginBottom: "8px",
  },
  subheading: {
    fontSize: "13px",
    color: "#8892a4",
    marginBottom: "32px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#8892a4",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  input: {
    background: "#141b26",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#e8edf5",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  error: {
    fontSize: "13px",
    color: "#ff4757",
    background: "rgba(255,71,87,0.08)",
    border: "1px solid rgba(255,71,87,0.2)",
    borderRadius: "6px",
    padding: "10px 14px",
  },
  button: {
    background: "#00e5a0",
    color: "#080b10",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "var(--font-display, 'Syne', sans-serif)",
    cursor: "pointer",
    transition: "background 0.15s",
    marginTop: "4px",
  },
  loadingDots: {
    display: "inline-block",
  },
  footer: {
    textAlign: "center" as const,
    fontSize: "11px",
    color: "#4a5568",
    marginTop: "28px",
    letterSpacing: "0.04em",
  },
};