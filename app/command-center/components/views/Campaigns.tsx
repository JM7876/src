'use client';
import React from 'react';
import { GlassCard, Avatar, CCProgressBar, SizeBadge } from '../ui';
import { SEED_PROJECTS, getTeamMember } from '../../data/seed';
import { CARD_TEMPLATES } from '../../data/cardTemplates';

export default function Campaigns({ onOpenCard }: { onOpenCard: (id: string) => void }) {
  const campaigns = SEED_PROJECTS.filter(p => p.campaign);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-secondary)',
      }}>
        Multi-week initiatives tracked across the full production lifecycle.
      </p>

      {campaigns.map(project => {
        const template = CARD_TEMPLATES[project.templateKey];
        const phases = template?.campaignConfig?.phases || [];
        const totalWeeks = project.campaign!.totalWeeks;
        const currentWeek = project.campaign!.currentWeek;

        return (
          <GlassCard key={project.id} elevated style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => onOpenCard(project.id)}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <SizeBadge size={project.size} />
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
                  color: 'var(--cc-text)', flex: 1,
                }}>
                  {project.title}
                </h3>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cc-text-muted)',
                }}>
                  Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-secondary)',
              }}>
                Week {currentWeek} of {totalWeeks} - {project.campaign!.currentPhase}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: '20px 24px' }}>
              {/* Phase segments */}
              <div style={{
                display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden',
                background: 'rgba(0,0,0,0.03)', marginBottom: 8,
              }}>
                {phases.map((phase, i) => {
                  const startWeek = Math.min(...phase.weeks);
                  const endWeek = Math.max(...phase.weeks);
                  const widthPct = ((endWeek - startWeek + 1) / totalWeeks) * 100;
                  const isCurrent = currentWeek >= startWeek && currentWeek <= endWeek;
                  const isPast = currentWeek > endWeek;

                  return (
                    <div key={i} style={{
                      width: `${widthPct}%`, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', position: 'relative',
                      background: isCurrent ? phase.color : isPast ? `${phase.color}60` : 'transparent',
                      borderRight: i < phases.length - 1 ? '1px solid rgba(255,255,255,0.30)' : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
                        color: (isCurrent || isPast) ? '#fff' : 'var(--cc-text-muted)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        padding: '0 4px',
                      }}>
                        {phase.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Week markers */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                  <div key={week} style={{
                    width: `${100 / totalWeeks}%`, textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    color: week === currentWeek ? 'var(--cc-text)' : 'var(--cc-text-faint)',
                    fontWeight: week === currentWeek ? 700 : 400,
                  }}>
                    {week}
                  </div>
                ))}
              </div>

              {/* Current week indicator */}
              <div style={{
                position: 'relative', height: 2, background: 'rgba(0,0,0,0.04)',
                borderRadius: 1, marginTop: 4,
              }}>
                <div style={{
                  position: 'absolute', left: `${((currentWeek - 0.5) / totalWeeks) * 100}%`,
                  top: -3, width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--cc-lavender)', border: '2px solid #fff',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }} />
              </div>
            </div>

            {/* Team */}
            <div style={{
              padding: '14px 24px', borderTop: '1px solid rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ display: 'flex' }}>
                {project.roles.map((r, i) => {
                  const m = getTeamMember(r.member);
                  return m ? (
                    <Avatar key={m.id} initials={m.initials} color={m.color} size={28}
                      style={{ marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff' }} />
                  ) : null;
                })}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-muted)',
              }}>
                {project.roles.length} team members
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
