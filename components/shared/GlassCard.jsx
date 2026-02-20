/*
 * WOLF FLOW — GlassCard Component
 * Created and Authored by Johnathon Moulds © 2026
 */

"use client";

import { useState } from "react";

export default function GlassCard({
  children,
  active = false,
  accentColor = null,
  onClick = null,
  padding = "16px 18px",
  borderRadius = 16,
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor || "var(--accent)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding,
        borderRadius,
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
        background: active
          ? `linear-gradient(135deg, ${accent}18, ${accent}08)`
          : hovered && onClick
          ? `linear-gradient(135deg, ${accent}08, transparent)`
          : "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        WebkitBackdropFilter: "blur(var(--glass-blur))",
        border: `1px solid ${active ? `${accent}50` : hovered && onClick ? `${accent}20` : "var(--border)"}`,
        boxShadow: active
          ? `0 0 32px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.08)`
          : hovered && onClick
          ? "0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
        transform: hovered && onClick && !active ? "translateY(-2px)" : "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {/* Top edge highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${active ? accent : "rgba(255,255,255,0.06)"}40, transparent)`,
          transition: "background 0.4s ease",
        }}
      />
      {children}
    </div>
  );
}
