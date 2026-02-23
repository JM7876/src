'use client';
import React, { useState } from 'react';
import { Home, ClipboardList, Calendar, Users, LogOut } from 'lucide-react';
import { Avatar } from './ui';
import type { TeamMember } from '../data/seed';

export type View = 'workspace' | 'projects' | 'campaigns' | 'team';

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id: 'workspace', icon: Home, label: 'Workspace' },
  { id: 'projects', icon: ClipboardList, label: 'Projects' },
  { id: 'campaigns', icon: Calendar, label: 'Campaigns' },
  { id: 'team', icon: Users, label: 'Team' },
];

export default function Sidebar({ activeView, onViewChange, user, onLogout }: {
  activeView: View;
  onViewChange: (v: View) => void;
  user: TeamMember;
  onLogout: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav style={{
      width: 56, height: '100vh', position: 'fixed', left: 0, top: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 16, paddingBottom: 16, gap: 4, zIndex: 20,
      background: 'rgba(255,255,255,0.50)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.60)',
    }}>
      {/* Logo */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        background: 'linear-gradient(135deg, var(--cc-lavender), var(--cc-periwinkle))',
        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: '#fff',
      }}>
        WF
      </div>

      {/* Nav Icons */}
      {NAV_ITEMS.map(item => {
        const active = activeView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={item.label}
            style={{
              width: 40, height: 40, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              background: active ? `${user.color}18` : 'transparent',
              color: active ? user.color : 'var(--cc-text-muted)',
              transition: 'all 0.2s ease', position: 'relative',
            }}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            {active && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: 20, borderRadius: '0 3px 3px 0', background: user.color,
              }} />
            )}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      {/* User avatar + dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <Avatar initials={user.initials} color={user.color} size={32} />
        </button>

        {showMenu && (
          <div className="cc-glass-elevated" style={{
            position: 'absolute', bottom: '100%', left: 56, marginBottom: 8,
            padding: 8, borderRadius: 'var(--radius-md)', minWidth: 140,
            animation: 'cc-scaleIn 0.15s ease',
          }}>
            <div style={{
              padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: 600, color: 'var(--cc-text)', borderBottom: '1px solid rgba(0,0,0,0.06)',
              marginBottom: 4,
            }}>
              {user.name}
            </div>
            <button onClick={() => { setShowMenu(false); onLogout(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--cc-text-secondary)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
