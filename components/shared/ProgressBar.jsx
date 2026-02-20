/*
 * WOLF FLOW — ProgressBar Component
 * Created and Authored by Johnathon Moulds © 2026
 */

"use client";

export default function ProgressBar({ label, current, total, accentColor }) {
  const accent = accentColor || "var(--accent)";
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{
          fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.2em",
        }}>
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div style={{
        height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          borderRadius: 2,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          transition: "width 0.6s ease, background 0.6s ease",
        }} />
      </div>
    </div>
  );
}
