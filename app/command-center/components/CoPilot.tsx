'use client';
import React from 'react';
import { Send } from 'lucide-react';
import { Avatar } from './ui';
import { TEAM } from '../data/seed';
import type { TeamMember } from '../data/seed';

const DEMO_MESSAGES = [
  { role: 'user' as const, member: 'shawn', text: "What's at risk this week?" },
  { role: 'bot' as const, member: null, text: "Two items: 'Language Program Social Media Post' is in review with Narciso - due Feb 28. 'Board Meeting Presentation Deck' is urgent with Cat holding the baton - due Feb 26. Recommend checking in with Cat on the deck." },
  { role: 'user' as const, member: 'shawn', text: "Who has capacity for a new flyer request?" },
  { role: 'bot' as const, member: null, text: "Shawn has 2 active projects (Elders Luncheon Flyer + Health Fair). Cat has 3 active. Based on due dates, Shawn could take it after the Elders flyer is delivered Mar 5." },
];

export default function CoPilot({ user }: { user: TeamMember }) {
  return (
    <div style={{
      width: 320, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255,255,255,0.50)',
      animation: 'cc-slideLeft 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)',
        fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
        color: 'var(--cc-text)', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: 'linear-gradient(135deg, var(--cc-lavender), var(--cc-periwinkle))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff',
        }}>
          WF
        </div>
        Co-Pilot
      </div>

      {/* Messages */}
      <div className="cc-scroll" style={{
        flex: 1, overflowY: 'auto', padding: 16, display: 'flex',
        flexDirection: 'column', gap: 16,
      }}>
        {DEMO_MESSAGES.map((msg, i) => {
          const member = msg.member ? TEAM.find(m => m.id === msg.member) : null;
          return (
            <div key={i} style={{
              display: 'flex', gap: 10,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              animation: `cc-slideUp 0.3s ease ${i * 0.1}s both`,
            }}>
              {msg.role === 'bot' ? (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--cc-lavender), var(--cc-periwinkle))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#fff',
                }}>
                  WF
                </div>
              ) : (
                <Avatar initials={member?.initials || user.initials} color={member?.color || user.color} size={28} />
              )}
              <div style={{
                padding: '10px 14px', borderRadius: 14,
                background: msg.role === 'user' ? `${user.color}12` : 'rgba(255,255,255,0.70)',
                border: `1px solid ${msg.role === 'user' ? `${user.color}20` : 'rgba(0,0,0,0.04)'}`,
                maxWidth: '80%',
                fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.5,
                color: 'var(--cc-text)',
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{
        padding: 16, borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Ask Wolf Flow anything..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.70)',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
            outline: 'none',
          }}
        />
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--cc-lavender)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
