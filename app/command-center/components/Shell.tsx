'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CoPilot from './CoPilot';
import type { View } from './Sidebar';
import type { TeamMember } from '../data/seed';

export default function Shell({ user, onLogout, children }: {
  user: TeamMember;
  onLogout: () => void;
  children: (view: View, onOpenCard: (id: string) => void) => React.ReactNode;
}) {
  const [activeView, setActiveView] = useState<View>('workspace');
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="cc-background" style={{
      width: '100vw', height: '100vh', display: 'flex', position: 'relative',
    }}>
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        user={user}
        onLogout={onLogout}
      />

      <div style={{
        marginLeft: 56, flex: 1, display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        <TopBar
          activeView={activeView}
          copilotOpen={copilotOpen}
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <main className="cc-scroll" style={{
            flex: 1, overflowY: 'auto', padding: 24, position: 'relative', zIndex: 1,
          }}>
            {children(activeView, () => {})}
          </main>

          {copilotOpen && <CoPilot user={user} />}
        </div>
      </div>
    </div>
  );
}
