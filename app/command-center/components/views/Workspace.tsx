'use client';
import React from 'react';
import { Briefcase, Users, Clock, CheckCircle2 } from 'lucide-react';
import { GlassCard, Avatar, SizeBadge, StatusBadge, CCProgressBar } from '../ui';
import { SEED_PROJECTS, TEAM, getGreeting, getTeamMember } from '../../data/seed';
import type { TeamMember, Project } from '../../data/seed';

export default function Workspace({ user, onOpenCard }: {
  user: TeamMember; onOpenCard: (id: string) => void;
}) {
  const myProjects = SEED_PROJECTS.filter(p =>
    p.roles.some(r => r.member === user.id && r.status !== 'complete')
  );
  const activeTotal = SEED_PROJECTS.filter(p => p.status === 'in_progress' || p.status === 'review').length;
  const dueThisWeek = SEED_PROJECTS.filter(p => {
    const d = new Date(p.dueDate);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;
  const completedMonth = SEED_PROJECTS.filter(p => p.status === 'approved' || p.status === 'published').length;

  const allActivity = SEED_PROJECTS.flatMap(p =>
    (p.activity || []).map(a => ({ ...a, projectId: p.id, projectTitle: p.title }))
  ).slice(0, 15);

  const campaigns = SEED_PROJECTS.filter(p => p.campaign);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <GlassCard elevated style={{
        background: `linear-gradient(135deg, ${user.color}08, ${user.color}04)`,
        borderLeft: `3px solid ${user.color}40`,
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
          color: 'var(--cc-text)', marginBottom: 4,
        }}>
          {getGreeting()}, {user.name}
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-secondary)',
        }}>
          You have {myProjects.length} active project{myProjects.length !== 1 ? 's' : ''} and {dueThisWeek} due this week
        </p>
      </GlassCard>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'My Active', value: myProjects.length, icon: Briefcase, color: user.color },
          { label: 'Team Active', value: activeTotal, icon: Users, color: 'var(--cc-periwinkle)' },
          { label: 'Due This Week', value: dueThisWeek, icon: Clock, color: 'var(--cc-amber)' },
          { label: 'Completed', value: completedMonth, icon: CheckCircle2, color: 'var(--cc-sage)' },
        ].map(stat => (
          <GlassCard key={stat.label} style={{ flex: 1, padding: '20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <stat.icon size={18} style={{ color: stat.color, opacity: 0.7 }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
              color: 'var(--cc-text)', lineHeight: 1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
              color: 'var(--cc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
              marginTop: 4,
            }}>
              {stat.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Two Column: My Work + Activity */}
      <div style={{ display: 'flex', gap: 20 }}>
        {/* My Work */}
        <GlassCard style={{ flex: 6, padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
            color: 'var(--cc-text)',
          }}>
            My Work
          </div>
          <div className="cc-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {myProjects.length === 0 ? (
              <div style={{
                padding: 40, textAlign: 'center', fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--cc-text-muted)',
              }}>
                All clear - no active assignments
              </div>
            ) : myProjects.map(project => {
              const myRole = project.roles.find(r => r.member === user.id);
              const isBaton = project.batonHolder === user.id;
              return (
                <div
                  key={project.id}
                  onClick={() => onOpenCard(project.id)}
                  style={{
                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    borderLeft: isBaton ? `3px solid ${user.color}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <SizeBadge size={project.size} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                      color: 'var(--cc-text)', whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {project.title}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-muted)',
                    }}>
                      {project.department}
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cc-text-muted)',
                    flexShrink: 0,
                  }}>
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard style={{ flex: 4, padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
            color: 'var(--cc-text)',
          }}>
            Recent Activity
          </div>
          <div className="cc-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {allActivity.map((item, i) => {
              const member = getTeamMember(item.member);
              return (
                <div key={i} style={{
                  padding: '12px 20px', display: 'flex', gap: 10,
                  borderBottom: '1px solid rgba(0,0,0,0.02)',
                }}>
                  <Avatar
                    initials={member?.initials || '?'}
                    color={member?.color || '#9CA3AF'}
                    size={24}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
                      lineHeight: 1.4,
                    }}>
                      <span style={{ fontWeight: 600 }}>{member?.name}</span>{' '}
                      {item.text}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cc-text-faint)',
                      marginTop: 2,
                    }}>
                      {item.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Campaigns Row */}
      {campaigns.length > 0 && (
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
            color: 'var(--cc-text)', marginBottom: 12,
          }}>
            Active Campaigns
          </h2>
          <div style={{ display: 'flex', gap: 16 }}>
            {campaigns.map(project => (
              <GlassCard key={project.id} style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => onOpenCard(project.id)}>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                  color: 'var(--cc-text)', marginBottom: 8,
                }}>
                  {project.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-secondary)',
                  marginBottom: 10,
                }}>
                  Week {project.campaign!.currentWeek} of {project.campaign!.totalWeeks} - {project.campaign!.currentPhase}
                </div>
                <CCProgressBar
                  done={project.campaign!.currentWeek}
                  total={project.campaign!.totalWeeks}
                  color="var(--cc-lavender)"
                  height={5}
                />
                <div style={{ display: 'flex', gap: -4, marginTop: 12 }}>
                  {project.roles.map((r) => {
                    const m = getTeamMember(r.member);
                    return m ? (
                      <Avatar key={m.id} initials={m.initials} color={m.color} size={24}
                        style={{ marginLeft: -4, border: '2px solid #fff' }} />
                    ) : null;
                  })}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
