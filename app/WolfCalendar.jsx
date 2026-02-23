'use client';

// ─── Wolf Flow Command Center Calendar ──────────────────────────────────────
// Created and Authored by Johnathon Moulds 2026

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  LiquidGlassPanel,
  SimpleGlassPanel,
  LightGlassPanel,
  LiquidGlassSvgDefs,
  LiquidGlassStyles,
  useLiquidGlass,
} from '../components/LiquidGlass-WOLFFLOW';

// ─── Employee Color Registry ─────────────────────────────────────────────────
const TEAM = [
  { id: 'johnathon', name: 'Johnathon', initials: 'JM', color: '#555BD9', textColor: '#FFFFFF', role: 'Photographer' },
  { id: 'tracy', name: 'Tracy', initials: 'TR', color: '#C41DF2', textColor: '#1A0421', role: 'Admin / Coordinator' },
  { id: 'shawn', name: 'Shawn', initials: 'SH', color: '#FF6B6B', textColor: '#2B0404', role: 'Graphic Designer' },
  { id: 'cat', name: 'Cat', initials: 'CT', color: '#00D4AA', textColor: '#002B22', role: 'Writer' },
  { id: 'audry', name: 'Audry', initials: 'AU', color: '#FFB347', textColor: '#331B00', role: 'Comm. Specialist' },
  { id: 'narciso', name: 'Narciso', initials: 'NA', color: '#FF4D8F', textColor: '#330015', role: 'Director' },
];

// ─── Palette Tokens ──────────────────────────────────────────────────────────
const PALETTES = {
  purple: {
    name: 'Electric Purple',
    night: { t1: '#0C0826', t2: '#1E0E40', t3: '#5241BF', t4: '#C41DF2' },
    day: { t1: '#C41DF2', t2: '#5241BF', t3: '#5A278C', t4: '#1E0E40' },
  },
  blue: {
    name: 'Wolf Flow Blue',
    night: { t1: '#0D1035', t2: '#2540D9', t3: '#555BD9', t4: '#D5D7F2' },
    day: { t1: '#D5D7F2', t2: '#9C9AD9', t3: '#555BD9', t4: '#2540D9' },
  },
};

// ─── Sample Event Data ────────────────────────────────────────────────────────
function buildSampleEvents(weekStart) {
  const d = (dayOffset, hour, min) => {
    const dt = new Date(weekStart);
    dt.setDate(dt.getDate() + dayOffset);
    dt.setHours(hour, min, 0, 0);
    return dt;
  };

  return [
    { id: 1, title: 'Brand Strategy Meeting', start: d(0, 9, 0), end: d(0, 10, 30), type: 'meeting', memberId: 'tracy', attendees: ['tracy', 'johnathon', 'shawn'] },
    { id: 2, title: 'Logo Design Review', start: d(0, 13, 0), end: d(0, 14, 0), type: 'task', memberId: 'shawn', attendees: ['shawn', 'tracy'] },
    { id: 3, title: 'Photography Session', start: d(1, 10, 0), end: d(1, 12, 0), type: 'task', memberId: 'johnathon', attendees: ['johnathon'] },
    { id: 4, title: 'Content Planning', start: d(1, 14, 0), end: d(1, 15, 30), type: 'meeting', memberId: 'cat', attendees: ['cat', 'audry', 'tracy'] },
    { id: 5, title: 'Client Onboarding Call', start: d(2, 9, 0), end: d(2, 10, 0), type: 'meeting', memberId: 'narciso', attendees: ['narciso', 'tracy'] },
    { id: 6, title: 'Social Media Batch', start: d(2, 11, 0), end: d(2, 13, 0), type: 'task', memberId: 'audry', attendees: ['audry'] },
    { id: 7, title: 'Copy Deadline — Blog Post', start: d(3, 10, 0), end: d(3, 11, 0), type: 'deadline', memberId: 'cat', attendees: ['cat'] },
    { id: 8, title: 'Team Sync', start: d(3, 15, 0), end: d(3, 16, 0), type: 'meeting', memberId: 'narciso', attendees: ['narciso', 'johnathon', 'shawn', 'cat', 'audry', 'tracy'] },
    { id: 9, title: 'Campaign Design Sprint', start: d(4, 9, 0), end: d(4, 12, 0), type: 'task', memberId: 'shawn', attendees: ['shawn', 'johnathon'] },
    { id: 10, title: 'Director Review', start: d(4, 14, 0), end: d(4, 15, 0), type: 'meeting', memberId: 'narciso', attendees: ['narciso', 'tracy'] },
    { id: 11, title: 'Photo Editing', start: d(5, 10, 0), end: d(5, 13, 0), type: 'task', memberId: 'johnathon', attendees: ['johnathon'] },
    { id: 12, title: 'Newsletter Deadline', start: d(5, 15, 0), end: d(5, 16, 0), type: 'deadline', memberId: 'cat', attendees: ['cat', 'audry'] },
    { id: 13, title: 'Press Release Draft', start: d(6, 11, 0), end: d(6, 12, 30), type: 'task', memberId: 'audry', attendees: ['audry', 'narciso'] },
  ];
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDayHeader(date, isToday) {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return { dayName: days[date.getDay()], dayNum: date.getDate() };
}

function memberById(id) {
  return TEAM.find(m => m.id === id) || TEAM[0];
}

const TYPE_ICONS = {
  meeting: '◎',
  task: '▣',
  deadline: '◆',
};

// ─── Glass Controller ────────────────────────────────────────────────────────
function GlassController({ nightMode, onToggleNight, palette, onTogglePalette, glassParams, onParamChange }) {
  const [open, setOpen] = useState(false);
  const accentColor = palette === 'purple' ? '#C41DF2' : '#555BD9';

  return (
    <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 1000 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: '4.5rem', left: 0,
          width: '260px', padding: '1.25rem',
          background: nightMode
            ? 'rgba(12,8,38,0.85)'
            : 'rgba(213,215,242,0.85)',
          backdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 32px ${accentColor}30`,
          animation: 'panelFadeIn 0.3s ease',
          color: nightMode ? '#E2E1DD' : '#1E0E40',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.6 }}>
            GLASS CONTROLLER
          </div>

          {/* Day / Night Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => onToggleNight(true)}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: nightMode ? accentColor : 'rgba(255,255,255,0.2)',
                color: nightMode ? '#fff' : '#1E0E40',
                fontSize: '0.72rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >🌙 Night</button>
            <button
              onClick={() => onToggleNight(false)}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: !nightMode ? accentColor : 'rgba(255,255,255,0.2)',
                color: !nightMode ? '#fff' : (nightMode ? '#E2E1DD' : '#1E0E40'),
                fontSize: '0.72rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >☀️ Day</button>
          </div>

          {/* Palette Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => onTogglePalette('purple')}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: palette === 'purple' ? '#C41DF2' : 'rgba(255,255,255,0.15)',
                color: palette === 'purple' ? '#fff' : (nightMode ? '#E2E1DD' : '#1E0E40'),
                fontSize: '0.65rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >⚡ Electric Purple</button>
            <button
              onClick={() => onTogglePalette('blue')}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: palette === 'blue' ? '#555BD9' : 'rgba(255,255,255,0.15)',
                color: palette === 'blue' ? '#fff' : (nightMode ? '#E2E1DD' : '#1E0E40'),
                fontSize: '0.65rem', fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >🐺 Wolf Flow Blue</button>
          </div>

          {/* Sliders */}
          {[
            { key: 'displacementScale', label: 'Displacement', min: 0, max: 150 },
            { key: 'blur', label: 'Blur', min: 0, max: 48 },
            { key: 'frostOpacity', label: 'Opacity', min: 0, max: 0.2, step: 0.005 },
            { key: 'brightness', label: 'Brightness', min: 80, max: 160 },
            { key: 'saturation', label: 'Saturation', min: 80, max: 250 },
            { key: 'bezelFraction', label: 'Bezel', min: 0.05, max: 0.35, step: 0.01 },
          ].map(({ key, label, min, max, step = 1 }) => (
            <div key={key} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.25rem', opacity: 0.7 }}>
                <span>{label}</span>
                <span style={{ color: accentColor, fontWeight: 700 }}>
                  {typeof glassParams[key] === 'number' && glassParams[key] < 1
                    ? glassParams[key].toFixed(3)
                    : Math.round(glassParams[key])}
                </span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={glassParams[key]}
                onChange={e => onParamChange(key, parseFloat(e.target.value))}
                style={{ width: '100%', accentColor }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Controller circle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${accentColor}`,
          background: nightMode ? 'rgba(12,8,38,0.7)' : 'rgba(213,215,242,0.7)',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer', fontSize: '1.2rem',
          boxShadow: `0 0 20px ${accentColor}50`,
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {open ? '✕' : '⚙'}
      </button>
    </div>
  );
}

// ─── Mini Month Calendar ──────────────────────────────────────────────────
function MiniMonthCalendar({ date, nightMode, accentColor, textColor }) {
  const [viewDate, setViewDate] = useState(new Date(date));
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Hardcode the current week logic from the screenshot (Week 19-25) just for visual matching
  const isCurrentWeek = (d) => d >= 19 && d <= 25 && month === date.getMonth();

  return (
    <div style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: textColor }}>
          {monthNames[month]} {year}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', opacity: 0.7 }}>
          <button onClick={() => setViewDate(new Date(year, month - 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.9rem' }}>‹</button>
          <button onClick={() => setViewDate(new Date(year, month + 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.9rem' }}>›</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ fontSize: '0.65rem', opacity: 0.5, color: textColor, paddingBottom: '4px' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const cw = isCurrentWeek(d);
          return (
            <div key={i} style={{
              fontSize: '0.8rem', padding: '4px 0',
              borderRadius: cw ? '8px' : '0',
              background: cw ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: cw ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              color: d ? textColor : 'transparent',
              opacity: d ? (cw ? 1 : 0.6) : 0,
              cursor: d ? 'pointer' : 'default',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              transition: 'all 0.2s'
            }}>
              {d}
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: cw ? 'rgba(255,255,255,0.4)' : 'transparent' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Team Summary Ring ────────────────────────────────────────────────────────
function TeamSummaryRing({ events, nightMode, textColor }) {
  const counts = TEAM.map(m => ({
    ...m,
    count: events.filter(e => e.memberId === m.id).length,
  }));
  const total = events.length || 1;

  const size = 110;
  const r = 42;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ padding: '1.25rem' }}>
      <div style={{ fontWeight: 600, fontSize: '1rem', color: textColor, marginBottom: '0.25rem' }}>
        Class summary
      </div>
      <div style={{ fontSize: '0.75rem', color: textColor, opacity: 0.6, marginBottom: '2rem' }}>
        Week - 19 → 25 Sep 2024
      </div>

      {/* Centered Donut */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', position: 'relative' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 10px rgba(0,200,255,0.3))' }}>
          {counts.map((m, i) => {
            const fraction = m.count / total;
            const dashLen = fraction * circumference;
            const el = (
              <circle key={m.id}
                cx={cx} cy={cx} r={r}
                fill="none" stroke={m.color} strokeWidth={12}
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                style={{ transition: 'all 0.5s ease' }}
              />
            );
            offset += dashLen;
            return el;
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: textColor }}>{total}</div>
          <div style={{ fontSize: '0.65rem', opacity: 0.7, color: textColor }}>Classes</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {counts.filter(m => m.count > 0).slice(0, 3).map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
            <span style={{ fontSize: '0.85rem', color: textColor, fontWeight: 600, width: '24px' }}>{m.count}</span>
            <span style={{ fontSize: '0.8rem', color: textColor, opacity: 0.8 }}>{m.name} class</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', color: textColor }}>Work load</span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255,100,100,0.15)', color: '#FF6B6B', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>Take care</span>
        </div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6, color: textColor, marginBottom: '1.25rem' }}>
          Total 40 classes - 80 hours
        </div>

        <button style={{
          width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(90deg, #FF6B6B 0%, #FFB347 100%)',
          color: '#fff', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em',
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,100,100,0.3)'
        }}>
          CLASSES (80%)
        </button>
      </div>
    </div>
  );
}

// ─── Event Detail Slide-Out Panel ─────────────────────────────────────────────
function EventDetailPanel({ event, nightMode, accentColor, textColor, onClose, onDelete }) {
  if (!event) return null;
  const member = memberById(event.memberId);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      pointerEvents: 'none',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          pointerEvents: 'all',
          animation: 'fadeSlideIn 0.25s ease',
        }}
      />
      {/* Slide-out from right */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '340px',
        background: nightMode ? 'rgba(12,8,38,0.92)' : 'rgba(213,215,242,0.92)',
        backdropFilter: 'blur(32px)',
        borderLeft: `1px solid ${accentColor}40`,
        boxShadow: `-8px 0 40px ${accentColor}20`,
        pointerEvents: 'all',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem',
        color: textColor,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px',
              background: `${member.color}25`, color: member.color,
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}>
              {TYPE_ICONS[event.type]} {event.type.toUpperCase()}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3 }}>{event.title}</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: textColor, fontSize: '1.2rem', opacity: 0.6, padding: '0.25rem',
          }}>✕</button>
        </div>

        {/* Color bar */}
        <div style={{ height: '3px', borderRadius: '2px', background: member.color, marginBottom: '1.5rem', opacity: 0.8 }} />

        {/* Time */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.25rem', letterSpacing: '0.1em' }}>TIME</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {formatTime(event.start)} — {formatTime(event.end)}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>
            {event.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Owner */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.25rem', letterSpacing: '0.1em' }}>OWNER</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: member.textColor,
            }}>{member.initials}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{member.role}</div>
            </div>
          </div>
        </div>

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>ATTENDEES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {event.attendees.map(aid => {
                const m = memberById(aid);
                return (
                  <div key={aid} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, color: m.textColor, flexShrink: 0,
                    }}>{m.initials}</div>
                    <span style={{ fontSize: '0.78rem' }}>{m.name}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5, marginLeft: 'auto' }}>{m.role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            flex: 1, padding: '0.65rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.8rem',
          }}>Edit Event</button>
          <button onClick={() => { onDelete(event.id); onClose(); }} style={{
            padding: '0.65rem 1rem', borderRadius: '12px', border: `1px solid ${accentColor}50`,
            background: 'transparent', cursor: 'pointer', color: textColor, fontSize: '0.8rem',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Event Modal ───────────────────────────────────────────────────────
function CreateEventModal({ nightMode, accentColor, textColor, defaultDate, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [memberId, setMemberId] = useState('johnathon');
  const [type, setType] = useState('meeting');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);

  const handleSave = () => {
    if (!title.trim()) return;
    const start = new Date(defaultDate);
    start.setHours(startHour, 0, 0, 0);
    const end = new Date(defaultDate);
    end.setHours(endHour, 0, 0, 0);
    onSave({ id: Date.now(), title, memberId, type, start, end, attendees: [memberId] });
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '10px', border: `1px solid ${accentColor}40`,
    background: nightMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    color: textColor, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'relative', width: '380px', padding: '2rem',
        background: nightMode ? 'rgba(12,8,38,0.95)' : 'rgba(213,215,242,0.95)',
        backdropFilter: 'blur(32px)',
        borderRadius: '20px',
        border: `1px solid ${accentColor}40`,
        boxShadow: `0 0 60px ${accentColor}30`,
        color: textColor,
        animation: 'panelFadeIn 0.3s ease',
      }}>
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700 }}>Create New Event</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>TITLE</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title..." style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>OWNER</label>
          <select value={memberId} onChange={e => setMemberId(e.target.value)} style={inputStyle}>
            {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>TYPE</label>
          <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>START</label>
            <select value={startHour} onChange={e => setStartHour(+e.target.value)} style={inputStyle}>
              {Array.from({ length: 16 }, (_, i) => i + 6).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>END</label>
            <select value={endHour} onChange={e => setEndHour(+e.target.value)} style={inputStyle}>
              {Array.from({ length: 16 }, (_, i) => i + 7).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '0.7rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.85rem',
          }}>Create Event</button>
          <button onClick={onClose} style={{
            padding: '0.7rem 1rem', borderRadius: '12px', border: `1px solid ${accentColor}50`,
            background: 'transparent', cursor: 'pointer', color: textColor, fontSize: '0.85rem',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, topPx, heightPx, nightMode, textColor, onClick, onDragStart }) {
  const member = memberById(event.memberId);
  const attendeeMembers = event.attendees.slice(0, 3).map(memberById);
  const extra = event.attendees.length - 3;

  // Extract hex color and convert to rgba for tinted backgrounds
  const hexToRgba = (hex, alpha) => {
    if (!hex) return `rgba(255,255,255,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16) || 255;
    const g = parseInt(hex.slice(3, 5), 16) || 255;
    const b = parseInt(hex.slice(5, 7), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const bgTint = hexToRgba(member.color, nightMode ? 0.15 : 0.3);
  const glowShadow = `0 8px 32px ${hexToRgba(member.color, 0.2)}`;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: topPx + 2,
        left: 2,
        right: 2,
        height: Math.max(heightPx - 4, 28),
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 2,
        background: bgTint,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        borderTop: `2px solid ${member.color}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)`,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s',
        padding: '0.6rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.3), ${glowShadow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)`; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
        {/* Left side icon type */}
        <span style={{ fontSize: '0.75rem', opacity: 0.8, color: textColor }}>{TYPE_ICONS[event.type]}</span>

        {/* Right side avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {attendeeMembers.map((m, i) => (
            <div key={i} style={{
              width: '18px', height: '18px', borderRadius: '50%',
              background: m.color, border: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.45rem', color: m.textColor, fontWeight: 700, flexShrink: 0,
              marginLeft: i > 0 ? '-6px' : 0,
              zIndex: 10 - i
            }}>{m.initials[0]}</div>
          ))}
          {extra > 0 && (
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.45rem', color: textColor, fontWeight: 700, marginLeft: '-6px',
            }}>+{extra}</div>
          )}
        </div>
      </div>

      {heightPx > 50 && (
        <div style={{ marginTop: '0.4rem' }}>
          <div style={{
            fontSize: '0.8rem', fontWeight: 600, color: textColor, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: heightPx < 80 ? 1 : 2, WebkitBoxOrient: 'vertical'
          }}>
            {event.title}
          </div>
          {heightPx > 70 && (
            <div style={{ fontSize: '0.65rem', opacity: 0.7, color: textColor, marginTop: '4px' }}>
              {formatTime(event.start)} - {formatTime(event.end)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Week Grid ────────────────────────────────────────────────────────────────
const HOUR_START = 7;
const HOUR_END = 18;
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => i + HOUR_START);
const SLOT_H = 80; // px per hour

function WeekGrid({ weekDays, events, nightMode, textColor, accentColor, onEventClick, onCellClick, onEventDrop }) {
  const today = new Date();
  const dragRef = useRef(null);

  const eventsForDay = (day) =>
    events.filter(e => e.start.toDateString() === day.toDateString());

  const eventStyle = (e) => {
    const startMin = (e.start.getHours() - HOUR_START) * 60 + e.start.getMinutes();
    const endMin = (e.end.getHours() - HOUR_START) * 60 + e.end.getMinutes();
    return {
      topPx: (startMin / 60) * SLOT_H,
      heightPx: Math.max(((endMin - startMin) / 60) * SLOT_H, 28),
    };
  };

  const isToday = (d) => d.toDateString() === today.toDateString();

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'auto', padding: '1rem', paddingRight: '2rem' }}>
      {/* Time gutter */}
      <div style={{ width: '80px', flexShrink: 0, paddingRight: '1rem', position: 'relative' }}>
        <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', borderBottom: `1px solid ${textColor}15` }}>
          <span style={{ fontSize: '0.65rem', opacity: 0.6, color: textColor, letterSpacing: '0.05em' }}>GMT+07</span>
        </div>
        <div>
          {HOURS.map(h => (
            <div key={h} style={{
              height: SLOT_H, display: 'flex', alignItems: 'flex-start',
              justifyContent: 'flex-end', paddingRight: '12px', paddingTop: '8px',
              fontSize: '0.65rem', opacity: 0.5, color: textColor, borderRight: `1px solid ${textColor}15`
            }}>{formatHour(h)}</div>
          ))}
        </div>
      </div>

      {/* Day columns */}
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {weekDays.map((day, di) => {
          const dayEvents = eventsForDay(day);
          const { dayName, dayNum } = formatDayHeader(day);

          return (
            <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {/* Day header */}
              <div style={{
                height: '70px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                borderBottom: `1px solid ${textColor}15`, marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '0.35rem 1.25rem', borderRadius: '14px',
                  background: isToday(day) ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: isToday(day) ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', opacity: 0.5, color: textColor, marginBottom: '2px' }}>{dayName}</div>
                  <div style={{
                    fontSize: '1.2rem', fontWeight: isToday(day) ? 700 : 500,
                    color: textColor,
                  }}>{dayNum}</div>
                </div>
              </div>

              {/* Cell column */}
              <div
                style={{ flex: 1, position: 'relative', borderLeft: di > 0 ? `1px solid ${textColor}08` : 'none' }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  if (!dragRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const hour = Math.floor(y / SLOT_H) + HOUR_START;
                  onEventDrop(dragRef.current, day, hour);
                  dragRef.current = null;
                }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const hour = Math.floor(y / SLOT_H) + HOUR_START;
                  onCellClick(day, hour);
                }}
              >
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} style={{
                    position: 'absolute', top: (h - HOUR_START) * SLOT_H,
                    left: 0, right: 0, height: 1,
                    background: `${textColor}05`,
                    pointerEvents: 'none',
                  }} />
                ))}

                {/* Events */}
                {dayEvents.map(e => {
                  const { topPx, heightPx } = eventStyle(e);
                  return (
                    <EventCard
                      key={e.id}
                      event={e}
                      topPx={topPx}
                      heightPx={heightPx}
                      nightMode={nightMode}
                      textColor={textColor}
                      onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                      onDragStart={() => { dragRef.current = e; }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
export default function WolfCalendar() {
  const [nightMode, setNightMode] = useState(true);
  const [palette, setPalette] = useState('purple');
  const [view, setView] = useState('week'); // week | month | day
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [events, setEvents] = useState(() => buildSampleEvents(getWeekStart(new Date())));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createDate, setCreateDate] = useState(new Date());
  const [createHour, setCreateHour] = useState(9);

  // Side toggle for the "all in one" solid calendar look
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const [glassParams, setGlassParams] = useState({
    displacementScale: 70,
    aberration: 1.5,
    bezelFraction: 0.12,
    blur: 32,
    brightness: 110,
    saturation: 160,
    frostOpacity: 0.04,
  });

  const { svgDefsRef, registerPanel, rebuild } = useLiquidGlass(glassParams);

  useEffect(() => {
    console.log("[v0] WolfCalendar mounted, nightMode:", nightMode, "palette:", palette);
  }, []);

  const colors = PALETTES[palette][nightMode ? 'night' : 'day'];
  const accentColor = palette === 'purple' ? colors.t4 : colors.t3;
  const textColor = nightMode ? '#E2E1DD' : colors.t4;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleParamChange = useCallback((key, val) => {
    // Immediate state update for visual slider dragging
    setGlassParams(p => ({ ...p, [key]: val }));
  }, []);

  // Debounced effect for triggering the heavy LiquidGlass rebuild
  useEffect(() => {
    const timer = setTimeout(() => {
      rebuild(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [glassParams, rebuild]);

  const handleEventDrop = useCallback((event, newDay, newHour) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== event.id) return e;
      const dur = e.end - e.start;
      const newStart = new Date(newDay);
      newStart.setHours(newHour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + dur);
      return { ...e, start: newStart, end: newEnd };
    }));
  }, []);

  const handleCreateEvent = useCallback((ev) => {
    setEvents(prev => [...prev, ev]);
  }, []);

  const handleDeleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleCellClick = useCallback((day, hour) => {
    setCreateDate(day);
    setCreateHour(hour);
    setShowCreate(true);
  }, []);

  const bgImage = nightMode ? '/bg-night.png' : '/bg-day.png';

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
    }}>
      <LiquidGlassStyles />
      <LiquidGlassSvgDefs svgDefsRef={svgDefsRef} />

      {/* ── Background wave image ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'opacity 0.6s ease',
      }} />

      {/* ── Color tint overlay (reduced to let background shine) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: nightMode
          ? `linear-gradient(135deg, ${colors.t1}15 0%, ${colors.t2}0A 100%)`
          : `linear-gradient(135deg, ${colors.t1}15 0%, ${colors.t2}0A 100%)`,
        transition: 'background 0.6s ease',
      }} />

      {/* ── Main layout ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100vh', padding: '2rem', gap: '2rem' }}>

        {/* ── Left icon sidebar ── */}
        <div style={{
          width: '52px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '1.5rem',
          paddingTop: '3rem',
        }}>
          {['i', '✏️', '📄', '📅', '📝', '💬', '♥', '📂', '🔄', '🕒'].map((icon, i) => (
            <button key={i} onClick={() => i === 3 ? setShowRightSidebar(v => !v) : null} style={{
              width: '42px', height: '42px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
              background: i === 3 ? `rgba(255,255,255,0.12)` : 'transparent',
              cursor: 'pointer', fontSize: i === 0 ? '1.2rem' : '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === 3 ? `0 4px 12px rgba(0,0,0,0.1)` : 'none',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.2s',
              color: textColor, opacity: i === 3 ? 1 : 0.6,
            }}>{icon === 'i' ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `1px solid ${textColor}`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>i</div> : icon}</button>
          ))}
        </div>

        {/* ── Center calendar area (Solid Glass) ── */}
        <LiquidGlassPanel
          registerRef={registerPanel}
          radius={32}
          style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}
        >
          <WeekGrid
            weekDays={weekDays}
            events={events}
            nightMode={nightMode}
            textColor={textColor}
            accentColor={accentColor}
            onEventClick={setSelectedEvent}
            onCellClick={handleCellClick}
            onEventDrop={handleEventDrop}
          />
        </LiquidGlassPanel>

        {/* ── Right side toggle panels ── */}
        {showRightSidebar && (
          <div style={{
            width: '320px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: '2rem',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Mini month calendar */}
            <LiquidGlassPanel registerRef={registerPanel} radius={32} style={{ flexShrink: 0, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}>
              <MiniMonthCalendar
                date={weekDays[3]}
                nightMode={nightMode}
                accentColor={accentColor}
                textColor={textColor}
              />
            </LiquidGlassPanel>

            {/* Team summary (Class Summary) */}
            <LiquidGlassPanel registerRef={registerPanel} radius={32} style={{ flex: 1, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}>
              <TeamSummaryRing
                events={events.filter(e => {
                  const ws = weekStart;
                  const we = new Date(ws); we.setDate(we.getDate() + 7);
                  return e.start >= ws && e.start < we;
                })}
                nightMode={nightMode}
                textColor={textColor}
              />
            </LiquidGlassPanel>
          </div>
        )}
      </div>

      {/* ── Event detail slide-out ── */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          nightMode={nightMode}
          accentColor={accentColor}
          textColor={textColor}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* ── Create event modal ── */}
      {showCreate && (
        <CreateEventModal
          nightMode={nightMode}
          accentColor={accentColor}
          textColor={textColor}
          defaultDate={createDate}
          defaultHour={createHour}
          onSave={handleCreateEvent}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* ── Glass Controller ── */}
      <GlassController
        nightMode={nightMode}
        palette={palette}
        onTogglePalette={setPalette}
        glassParams={glassParams}
        onParamChange={handleParamChange}
        onToggleNight={(v) => setNightMode(v)}
      />

      {/* ── Animations ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.02); }
        }
        @keyframes panelFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInRight {
          from { transform: translateX(20%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${accentColor}40; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// Created and Authored by Johnathon Moulds 2026
