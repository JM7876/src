'use client';
import React, { useState, useMemo } from 'react';
import { GlassCard, Avatar, SizeBadge, StatusBadge } from '../ui';
import { SEED_PROJECTS, getTeamMember } from '../../data/seed';
import type { ProjectSize } from '../../data/seed';

const SIZE_TABS: (ProjectSize | 'ALL')[] = ['ALL', 'XS', 'S', 'M', 'L'];

export default function Projects({ onOpenCard }: { onOpenCard: (id: string) => void }) {
  const [sizeFilter, setSizeFilter] = useState<ProjectSize | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'created'>('dueDate');

  const filtered = useMemo(() => {
    let items = [...SEED_PROJECTS];
    if (sizeFilter !== 'ALL') items = items.filter(p => p.size === sizeFilter);
    if (statusFilter !== 'all') items = items.filter(p => p.status === statusFilter);
    items.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return items;
  }, [sizeFilter, statusFilter, sortBy]);

  const countBySize = (s: ProjectSize) => SEED_PROJECTS.filter(p => p.size === s).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filter Bar */}
      <GlassCard style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {SIZE_TABS.map(tab => {
            const active = sizeFilter === tab;
            const count = tab === 'ALL' ? SEED_PROJECTS.length : countBySize(tab as ProjectSize);
            return (
              <button key={tab} onClick={() => setSizeFilter(tab)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  background: active ? 'var(--cc-lavender)' : 'transparent',
                  color: active ? '#fff' : 'var(--cc-text-secondary)',
                  transition: 'all 0.15s ease',
                }}>
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255,255,255,0.70)', fontFamily: 'var(--font-body)',
              fontSize: 12, color: 'var(--cc-text-secondary)', cursor: 'pointer',
            }}>
            <option value="all">All Status</option>
            <option value="intake">Intake</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
        </div>
      </GlassCard>

      {/* Data Table */}
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr 130px 60px 60px 120px 110px 85px',
          gap: 12, padding: '12px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
          color: 'var(--cc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          <span>ID</span>
          <span>Title</span>
          <span>Department</span>
          <span>Type</span>
          <span>Size</span>
          <span>Team</span>
          <span>Status</span>
          <span>Due</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{
            padding: 40, textAlign: 'center', fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--cc-text-muted)',
          }}>
            No projects match these filters
          </div>
        ) : filtered.map(project => {
          const isOverdue = new Date(project.dueDate) < new Date() && project.status !== 'approved' && project.status !== 'published';
          return (
            <div key={project.id} onClick={() => onOpenCard(project.id)} style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 130px 60px 60px 120px 110px 85px',
              gap: 12, padding: '14px 20px', alignItems: 'center',
              borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cc-text-muted)',
              }}>
                {project.id}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                color: 'var(--cc-text)', whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {project.title}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-secondary)',
              }}>
                {project.department}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cc-text-muted)',
                textTransform: 'capitalize',
              }}>
                {project.label}
              </span>
              <SizeBadge size={project.size} />
              <div style={{ display: 'flex' }}>
                {project.roles.slice(0, 4).map((r, i) => {
                  const m = getTeamMember(r.member);
                  return m ? (
                    <Avatar key={m.id} initials={m.initials} color={m.color} size={24}
                      style={{ marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff' }} />
                  ) : null;
                })}
                {project.roles.length > 4 && (
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--cc-surface)',
                    border: '2px solid #fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginLeft: -6, fontSize: 10,
                    fontFamily: 'var(--font-mono)', color: 'var(--cc-text-muted)',
                  }}>
                    +{project.roles.length - 4}
                  </div>
                )}
              </div>
              <StatusBadge status={project.status} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: isOverdue ? '#E07070' : 'var(--cc-text-muted)',
              }}>
                {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
}
