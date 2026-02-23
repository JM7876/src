'use client';
import React from 'react';
import { Search, Bell, MessageCircle } from 'lucide-react';
import type { View } from './Sidebar';

const VIEW_LABELS: Record<View, string> = {
  workspace: 'Workspace',
  projects: 'Projects',
  campaigns: 'Campaigns',
  team: 'Team',
};

export default function TopBar({ activeView, copilotOpen, onToggleCopilot }: {
  activeView: View;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
}) {
  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', gap: 16,
      paddingLeft: 24, paddingRight: 16,
      background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.50)',
    }}>
      {/* Breadcrumb */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
        color: 'var(--cc-text)', flexShrink: 0,
      }}>
        {VIEW_LABELS[activeView]}
      </div>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 420, margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 14px', height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.60)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        <Search size={15} style={{ color: 'var(--cc-text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search projects, team, files..."
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
          }}
        />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cc-text-faint)',
          background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 4,
        }}>
          {'Cmd+K'}
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 10, border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', position: 'relative',
          color: 'var(--cc-text-secondary)',
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 7, height: 7,
            borderRadius: '50%', background: '#E07070',
          }} />
        </button>

        <button
          onClick={onToggleCopilot}
          style={{
            width: 36, height: 36, borderRadius: 10, border: 'none',
            background: copilotOpen ? 'var(--cc-lavender)22' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: copilotOpen ? 'var(--cc-lavender)' : 'var(--cc-text-secondary)',
          }}
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </header>
  );
}
