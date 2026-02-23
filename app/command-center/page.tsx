'use client';
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import PinGate from './components/PinGate';
import Shell from './components/Shell';
import Workspace from './components/views/Workspace';
import Projects from './components/views/Projects';
import Campaigns from './components/views/Campaigns';
import TeamView from './components/views/TeamView';
import CardDrawer from './components/cards/CardDrawer';
import { SEED_PROJECTS } from './data/seed';
import type { View } from './components/Sidebar';

export default function CommandCenterPage() {
  const { user, login, logout } = useAuth();
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const openProject = openCardId ? SEED_PROJECTS.find(p => p.id === openCardId) : null;

  if (!user) {
    return <PinGate onLogin={login} />;
  }

  return (
    <>
      <Shell user={user} onLogout={logout}>
        {(view: View) => {
          switch (view) {
            case 'workspace':
              return <Workspace user={user} onOpenCard={setOpenCardId} />;
            case 'projects':
              return <Projects onOpenCard={setOpenCardId} />;
            case 'campaigns':
              return <Campaigns onOpenCard={setOpenCardId} />;
            case 'team':
              return <TeamView />;
            default:
              return null;
          }
        }}
      </Shell>

      {openProject && (
        <CardDrawer
          project={openProject}
          onClose={() => setOpenCardId(null)}
        />
      )}
    </>
  );
}
