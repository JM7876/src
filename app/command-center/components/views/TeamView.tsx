'use client';
import React from 'react';
import { GlassCard, Avatar, CCProgressBar, StatusBadge } from '../ui';
import { TEAM, SEED_PROJECTS } from '../../data/seed';

export default function TeamView() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {TEAM.map(member => {
        const memberProjects = SEED_PROJECTS.filter(p =>
          p.roles.some(r => r.member === member.id)
        );
        const activeCount = memberProjects.filter(p =>
          p.status === 'in_progress' || p.status === 'review'
        ).length;
        const batonCount = SEED_PROJECTS.filter(p => p.batonHolder === member.id).length;
        const statusBreakdown = {
          in_progress: 0, waiting: 0, complete: 0,
        };
        memberProjects.forEach(p => {
          const role = p.roles.find(r => r.member === member.id);
          if (role) {
            if (role.status === 'in_progress') statusBreakdown.in_progress++;
            else if (role.status === 'waiting' || role.status === 'upcoming') statusBreakdown.waiting++;
            else if (role.status === 'complete') statusBreakdown.complete++;
          }
        });
        const totalRoles = statusBreakdown.in_progress + statusBreakdown.waiting + statusBreakdown.complete;
        const capacityPct = totalRoles > 0
          ? Math.min(100, (statusBreakdown.in_progress / Math.max(totalRoles, 3)) * 100)
          : 0;
        const capacityLabel = capacityPct < 30 ? 'Light' : capacityPct < 70 ? 'Moderate' : 'Heavy';
        const capacityColor = capacityPct < 30 ? '#A8C5A0' : capacityPct < 70 ? '#E5C07B' : '#E07070';

        return (
          <GlassCard key={member.id} elevated style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Avatar initials={member.initials} color={member.color} size={48} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
                  color: 'var(--cc-text)',
                }}>
                  {member.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-muted)',
                }}>
                  {member.role}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
                }}>
                  {activeCount} active
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-muted)',
                }}>
                  Holding {batonCount} baton{batonCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Status pills */}
              <div style={{ display: 'flex', gap: 6 }}>
                {statusBreakdown.in_progress > 0 && (
                  <StatusBadge status="in_progress" style={{ fontSize: 10, padding: '2px 8px' }} />
                )}
                {statusBreakdown.waiting > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                    borderRadius: 12, fontSize: 10, fontFamily: 'var(--font-body)', fontWeight: 500,
                    background: '#9CA3AF18', color: '#9CA3AF',
                  }}>
                    {statusBreakdown.waiting} waiting
                  </span>
                )}
                {statusBreakdown.complete > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                    borderRadius: 12, fontSize: 10, fontFamily: 'var(--font-body)', fontWeight: 500,
                    background: '#A8C5A018', color: '#A8C5A0',
                  }}>
                    {statusBreakdown.complete} done
                  </span>
                )}
              </div>

              {/* Capacity bar */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 4,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cc-text-muted)',
                  }}>
                    Capacity
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
                    color: capacityColor,
                  }}>
                    {capacityLabel}
                  </span>
                </div>
                <CCProgressBar done={capacityPct} total={100} color={capacityColor} height={5} />
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
