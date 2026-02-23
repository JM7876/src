'use client';
import React, { useState, useCallback } from 'react';
import { TEAM } from '../data/seed';
import type { TeamMember } from '../data/seed';
import { Avatar } from './ui';

export default function PinGate({ onLogin }: { onLogin: (id: string, pin: string) => boolean }) {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [digits, setDigits] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);

  const handleSelect = useCallback((member: TeamMember) => {
    setSelected(member);
    setDigits([]);
    setShaking(false);
  }, []);

  const handleDigit = useCallback((d: string) => {
    if (!selected) return;
    const next = [...digits, d];
    if (next.length === 4) {
      const pin = next.join('');
      const ok = onLogin(selected.id, pin);
      if (!ok) {
        setShaking(true);
        setTimeout(() => { setShaking(false); setDigits([]); }, 500);
      }
    } else {
      setDigits(next);
    }
  }, [selected, digits, onLogin]);

  const handleDelete = useCallback(() => {
    setDigits(d => d.slice(0, -1));
  }, []);

  const handleBack = useCallback(() => {
    setSelected(null);
    setDigits([]);
    setShaking(false);
  }, []);

  return (
    <div className="cc-background" style={{
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Organic wave SVG background */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', opacity: 0.15 }} viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path d="M0,200 C360,100 720,300 1080,180 C1260,120 1380,220 1440,200 L1440,400 L0,400 Z" fill="var(--cc-lavender)" />
        <path d="M0,260 C300,180 600,320 900,240 C1100,180 1300,280 1440,260 L1440,400 L0,400 Z" fill="var(--cc-periwinkle)" opacity="0.5" />
      </svg>

      {!selected ? (
        /* ── Team Selection Grid ── */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
          animation: 'cc-fadeIn 0.5s ease', position: 'relative', zIndex: 1,
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600,
              color: 'var(--cc-text)', marginBottom: 6,
            }}>
              Wolf Flow
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-secondary)',
            }}>
              Select your profile to continue
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {TEAM.map(member => (
              <button
                key={member.id}
                onClick={() => handleSelect(member)}
                className="cc-glass"
                style={{
                  padding: '28px 24px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12, cursor: 'pointer', border: '1px solid var(--cc-border)',
                  borderRadius: 'var(--radius-lg)', background: 'var(--cc-surface)',
                  transition: 'all 0.2s ease', minWidth: 140,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${member.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--cc-glass-shadow)';
                }}
              >
                <Avatar initials={member.initials} color={member.color} size={52} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
                    color: 'var(--cc-text)',
                  }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cc-text-muted)',
                    marginTop: 2,
                  }}>
                    {member.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── PIN Entry ── */
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
          animation: 'cc-scaleIn 0.3s ease', position: 'relative', zIndex: 1,
        }}>
          <button onClick={handleBack} style={{
            position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text-muted)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {'<'} Back
          </button>

          <Avatar initials={selected.initials} color={selected.color} size={64} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
              color: 'var(--cc-text)',
            }}>
              {selected.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text-muted)',
            }}>
              Enter your PIN
            </div>
          </div>

          {/* PIN dots */}
          <div style={{
            display: 'flex', gap: 12,
            animation: shaking ? 'cc-shake 0.4s ease' : 'none',
          }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${digits.length > i ? selected.color : 'var(--cc-text-faint)'}`,
                background: digits.length > i ? selected.color : 'transparent',
                transition: 'all 0.15s ease',
                transform: digits.length > i ? 'scale(1)' : 'scale(0.85)',
              }} />
            ))}
          </div>

          {/* Keypad */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => (
              <button
                key={key || 'empty'}
                onClick={() => {
                  if (key === 'del') handleDelete();
                  else if (key) handleDigit(key);
                }}
                disabled={!key}
                style={{
                  width: 64, height: 56, borderRadius: 'var(--radius-md)',
                  border: key ? '1px solid var(--cc-border-subtle)' : 'none',
                  background: key ? 'var(--cc-surface)' : 'transparent',
                  cursor: key ? 'pointer' : 'default',
                  fontFamily: key === 'del' ? 'var(--font-body)' : 'var(--font-display)',
                  fontSize: key === 'del' ? 12 : 20, fontWeight: 500,
                  color: 'var(--cc-text)',
                  transition: 'background 0.15s ease',
                  backdropFilter: key ? 'blur(10px)' : 'none',
                }}
                onMouseEnter={e => {
                  if (key) (e.currentTarget as HTMLElement).style.background = 'var(--cc-surface-hover)';
                }}
                onMouseLeave={e => {
                  if (key) (e.currentTarget as HTMLElement).style.background = 'var(--cc-surface)';
                }}
              >
                {key === 'del' ? 'Delete' : key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
