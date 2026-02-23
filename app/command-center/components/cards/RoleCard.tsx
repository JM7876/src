'use client';
import React from 'react';
import { CheckCircle2, Zap, Clock, Calendar } from 'lucide-react';
import { Avatar, CCProgressBar, FileTypeBadge } from '../ui';
import { getTeamMember } from '../../data/seed';
import type { ProjectRole } from '../../data/seed';

const STATUS_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  complete:    { icon: CheckCircle2, color: '#A8C5A0' },
  in_progress: { icon: Zap, color: '#E5C07B' },
  waiting:     { icon: Clock, color: '#9CA3AF' },
  upcoming:    { icon: Calendar, color: '#7C9DD9' },
};

export default function RoleCard({ role, isBatonHolder }: {
  role: ProjectRole; isBatonHolder: boolean;
}) {
  const member = getTeamMember(role.member);
  if (!member) return null;

  const statusInfo = STATUS_ICONS[role.status] || STATUS_ICONS.waiting;
  const Icon = statusInfo.icon;
  const totalChecklist = role.checklist?.length || 0;
  const doneChecklist = role.checklist?.filter(c => c.done).length || 0;
  const totalDeliverables = role.deliverables?.length || 0;
  const doneDeliverables = role.deliverables?.filter(d => d.done).length || 0;
  const totalItems = totalChecklist + totalDeliverables;
  const doneItems = doneChecklist + doneDeliverables;

  return (
    <div style={{
      padding: 16, borderRadius: 'var(--radius-md)',
      background: isBatonHolder ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)',
      border: `1px solid ${isBatonHolder ? `${member.color}40` : 'rgba(0,0,0,0.04)'}`,
      borderLeft: isBatonHolder ? `3px solid ${member.color}` : '3px solid transparent',
      boxShadow: isBatonHolder ? `0 4px 16px ${member.color}12` : 'none',
      transition: 'all 0.2s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
      }}>
        <Avatar initials={member.initials} color={member.color} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              color: 'var(--cc-text)',
            }}>
              {member.name}
            </span>
            <Icon size={14} style={{ color: statusInfo.color }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cc-text-muted)',
              marginLeft: 'auto',
            }}>
              {doneItems}/{totalItems}
            </span>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cc-text-muted)',
          }}>
            {role.role}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <CCProgressBar done={doneItems} total={totalItems} color={member.color} height={4}
        style={{ marginBottom: 10 }} />

      {/* Status label */}
      {role.statusLabel && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-secondary)',
          marginBottom: 8, fontStyle: 'italic',
        }}>
          {role.statusLabel}
        </div>
      )}

      {/* Checklist */}
      {role.checklist && role.checklist.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
            color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            Checklist
          </div>
          {role.checklist.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0',
              fontFamily: 'var(--font-body)', fontSize: 12,
              color: item.done ? 'var(--cc-text-muted)' : 'var(--cc-text)',
              textDecoration: item.done ? 'line-through' : 'none',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 3,
                border: `1.5px solid ${item.done ? '#A8C5A0' : 'var(--cc-text-faint)'}`,
                background: item.done ? '#A8C5A018' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: '#A8C5A0', flexShrink: 0,
              }}>
                {item.done && '\u2713'}
              </div>
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Deliverables */}
      {role.deliverables && role.deliverables.length > 0 && (
        <div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
            color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: 6,
          }}>
            Deliverables
          </div>
          {role.deliverables.map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0',
              fontFamily: 'var(--font-body)', fontSize: 12,
              color: d.done ? 'var(--cc-text-secondary)' : 'var(--cc-text)',
            }}>
              <FileTypeBadge icon={d.icon} />
              <span style={{
                flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {d.name}
              </span>
              <span style={{ color: d.done ? '#A8C5A0' : 'var(--cc-text-faint)', fontSize: 13 }}>
                {d.done ? '\u2713' : '\u25CB'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      {role.note && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 12, fontStyle: 'italic',
          color: 'var(--cc-text-muted)', marginTop: 8, paddingTop: 8,
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}>
          {role.note}
        </div>
      )}
    </div>
  );
}
