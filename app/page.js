/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Command Center Calendar
   Created and Authored by Johnathon Moulds © 2026
═══════════════════════════════════════════════════════════════════ */

"use client";

import dynamic from "next/dynamic";

// ssr: false required — LiquidGlass uses browser-only canvas/document APIs
const WolfCalendar = dynamic(() => import("./WolfCalendar"), { ssr: false });

export default function Home() {
  console.log("[v0] Home page rendering, loading WolfCalendar...");
  return <WolfCalendar />;
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
