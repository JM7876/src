/*
 * WOLF FLOW — Portal Background (Shell Teachings)
 * Created and Authored by Johnathon Moulds © 2026
 */

"use client";

export default function PortalBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Medicine wheel rings + directional pulls */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle 380px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,var(--ring-outer-opacity)) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 280px at 50% 48%, rgba(20,169,162,0.0) 44.5%, rgba(20,169,162,var(--ring-mid-opacity)) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 180px at 50% 48%, rgba(20,169,162,0.0) 43.5%, rgba(20,169,162,var(--ring-inner-opacity)) 45.5%, rgba(20,169,162,0.0) 47%),
            radial-gradient(circle 70px at 50% 48%, rgba(20,169,162,var(--center-glow-opacity)) 0%, transparent 100%),
            radial-gradient(ellipse 200px 500px at 50% 0%, var(--north-pull) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 100% 48%, var(--east-pull) 0%, transparent 70%),
            radial-gradient(ellipse 200px 500px at 50% 100%, var(--south-pull) 0%, transparent 70%),
            radial-gradient(ellipse 500px 200px at 0% 48%, var(--west-pull) 0%, transparent 70%)
          `,
        }}
      />
      {/* SVG overlay — cross lines, sun rays, grandfather circles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cline x1='400' y1='0' x2='400' y2='800' stroke='rgba(20,169,162,0.055)' stroke-width='0.6'/%3E%3Cline x1='0' y1='400' x2='800' y2='400' stroke='rgba(20,169,162,0.055)' stroke-width='0.6'/%3E%3Cline x1='400' y1='400' x2='258' y2='215' stroke='rgba(20,169,162,0.06)' stroke-width='0.5'/%3E%3Cline x1='400' y1='400' x2='542' y2='215' stroke='rgba(20,169,162,0.06)' stroke-width='0.5'/%3E%3Cline x1='400' y1='400' x2='542' y2='585' stroke='rgba(20,169,162,0.06)' stroke-width='0.5'/%3E%3Cline x1='400' y1='400' x2='258' y2='585' stroke='rgba(20,169,162,0.06)' stroke-width='0.5'/%3E%3Ccircle cx='400' cy='400' r='14' fill='none' stroke='rgba(20,169,162,0.06)' stroke-width='0.5'/%3E%3Ccircle cx='400' cy='400' r='7' fill='rgba(20,169,162,0.12)'/%3E%3Ccircle cx='400' cy='255' r='7' fill='rgba(20,169,162,0.1)'/%3E%3Ccircle cx='525' cy='328' r='7' fill='rgba(20,169,162,0.1)'/%3E%3Ccircle cx='525' cy='472' r='7' fill='rgba(200,80,130,0.1)'/%3E%3Ccircle cx='400' cy='545' r='7' fill='rgba(20,169,162,0.1)'/%3E%3Ccircle cx='275' cy='472' r='7' fill='rgba(200,80,130,0.1)'/%3E%3Ccircle cx='275' cy='328' r='7' fill='rgba(20,169,162,0.1)'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
