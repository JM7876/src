/*
 * WOLF FLOW — BottomNav Component
 * Created and Authored by Johnathon Moulds © 2026
 */

"use client";

export default function BottomNav({ onBack, onNext, backDisabled, nextDisabled, nextLabel = "Next" }) {
  const btnStyle = (disabled) => ({
    background: "none",
    border: "none",
    fontSize: 13,
    fontWeight: 400,
    fontFamily: "var(--font-primary)",
    color: disabled ? "var(--text-muted)" : "var(--text-secondary)",
    cursor: disabled ? "default" : "pointer",
    padding: "10px 16px",
    transition: "color 0.3s ease",
    letterSpacing: "0.02em",
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        background: "rgba(10,14,20,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <button onClick={onBack} disabled={backDisabled} style={btnStyle(backDisabled)}>
        ← Back
      </button>
      <span style={{ fontSize: 20, opacity: 0.3 }}>🐢</span>
      <button onClick={onNext} disabled={nextDisabled} style={btnStyle(nextDisabled)}>
        {nextLabel} →
      </button>
    </div>
  );
}
