'use client';
import React from 'react';

/* ── Avatar ── */
export function Avatar({ initials, color, size = 32, style = {} }: {
  initials: string; color: string; size?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600,
      fontSize: size * 0.4, flexShrink: 0, ...style,
    }}>
      {initials}
    </div>
  );
}

/* ── Size Badge ── */
const SIZE_COLORS: Record<string, string> = {
  XS: '#7C9DD9', S: '#A8C5A0', M: '#E5C07B', L: '#E08AAF',
};
export function SizeBadge({ size, style = {} }: { size: string; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '2px 8px', borderRadius: 6, fontSize: 11,
      fontFamily: 'var(--font-mono)', fontWeight: 500,
      background: `${SIZE_COLORS[size] || '#B4A7D6'}22`,
      color: SIZE_COLORS[size] || '#B4A7D6',
      border: `1px solid ${SIZE_COLORS[size] || '#B4A7D6'}33`, ...style,
    }}>
      {size}
    </span>
  );
}

/* ── Status Badge ── */
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  intake:      { label: 'Intake',      color: '#7C9DD9' },
  in_progress: { label: 'In Progress', color: '#E5C07B' },
  review:      { label: 'Review',      color: '#B4A7D6' },
  approved:    { label: 'Approved',    color: '#A8C5A0' },
  published:   { label: 'Published',   color: '#6DB5A0' },
  archived:    { label: 'Archived',    color: '#9CA3AF' },
  waiting:     { label: 'Waiting',     color: '#9CA3AF' },
  upcoming:    { label: 'Upcoming',    color: '#7C9DD9' },
  complete:    { label: 'Complete',    color: '#A8C5A0' },
};
export function StatusBadge({ status, style = {} }: { status: string; style?: React.CSSProperties }) {
  const s = STATUS_MAP[status] || { label: status, color: '#9CA3AF' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
      borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500,
      background: `${s.color}18`, color: s.color,
      border: `1px solid ${s.color}25`, ...style,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
      {s.label}
    </span>
  );
}

/* ── Progress Bar ── */
export function CCProgressBar({ done, total, color = '#7C9DD9', height = 4, style = {} }: {
  done: number; total: number; color?: string; height?: number; style?: React.CSSProperties;
}) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div style={{ width: '100%', height, borderRadius: height, background: 'rgba(0,0,0,0.06)', overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', borderRadius: height, background: color, transition: 'width 0.4s ease' }} />
    </div>
  );
}

/* ── File Type Badge ── */
const FILE_COLORS: Record<string, string> = {
  Ai: '#FF9A00', Ps: '#31A8FF', Id: '#FF3366', Lr: '#ADD5EC',
  Wd: '#2196F3', Xl: '#4CAF50', Pp: '#E53935', PDF: '#E53935', IMG: '#26A69A',
};
export function FileTypeBadge({ icon, style = {} }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 18, borderRadius: 3, fontSize: 9,
      fontFamily: 'var(--font-mono)', fontWeight: 500,
      background: FILE_COLORS[icon] || '#9CA3AF', color: '#fff', ...style,
    }}>
      {icon}
    </span>
  );
}

/* ── Glass Card ── */
export function GlassCard({ children, elevated = false, style = {}, className = '', onClick, ...props }: {
  children: React.ReactNode; elevated?: boolean; style?: React.CSSProperties;
  className?: string; onClick?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={elevated ? 'cc-glass-elevated' : 'cc-glass'}
      style={{ padding: 20, ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Priority Badge ── */
const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  standard: { label: 'Standard', color: '#7C9DD9' },
  rush: { label: 'Rush', color: '#E5C07B' },
  urgent: { label: 'Urgent', color: '#E07070' },
};
export function PriorityBadge({ priority, style = {} }: { priority: string; style?: React.CSSProperties }) {
  const p = PRIORITY_MAP[priority] || PRIORITY_MAP.standard;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
      borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500,
      background: `${p.color}15`, color: p.color, ...style,
    }}>
      {p.label}
    </span>
  );
}
