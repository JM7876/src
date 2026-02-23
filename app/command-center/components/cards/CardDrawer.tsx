'use client';
import React, { useState } from 'react';
import { X, MapPin, CalendarDays, Clock as ClockIcon, Send, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { SizeBadge, StatusBadge, PriorityBadge, Avatar, FileTypeBadge, GlassCard } from '../ui';
import { getTeamMember, TEAM } from '../../data/seed';
import { getTemplateTabs, CARD_TEMPLATES } from '../../data/cardTemplates';
import type { Project } from '../../data/seed';
import RoleCard from './RoleCard';

export default function CardDrawer({ project, onClose }: {
  project: Project; onClose: () => void;
}) {
  const tabs = getTemplateTabs(project.templateKey);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const template = CARD_TEMPLATES[project.templateKey];

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)',
        backdropFilter: 'blur(2px)', zIndex: 50,
        animation: 'cc-fadeIn 0.2s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '70vw', maxWidth: 900, zIndex: 51,
        background: 'rgba(245, 240, 250, 0.95)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,0.50)',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column',
        animation: 'cc-slideLeft 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SizeBadge size={project.size} />
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
              color: 'var(--cc-text)', flex: 1,
            }}>
              {project.title}
            </h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: 'rgba(0,0,0,0.04)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--cc-text-muted)',
            }}>
              <X size={16} />
            </button>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text-secondary)',
          }}>
            <span>{project.department}</span>
            <span style={{ opacity: 0.3 }}>{'|'}</span>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: '0 24px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          {tabs.map(tab => {
            const active = activeTab === tab;
            let countBadge = '';
            if (tab === 'Files') {
              const fileCount = project.roles.reduce((sum, r) => sum + (r.deliverables?.length || 0), 0);
              countBadge = ` (${fileCount})`;
            } else if (tab === 'Activity' && project.activity) {
              countBadge = ` (${project.activity.length})`;
            } else if (tab === 'Chat' && project.chat) {
              countBadge = ` (${project.chat.length})`;
            }
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '12px 16px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--cc-text)' : 'var(--cc-text-muted)',
                borderBottom: active ? '2px solid var(--cc-lavender)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}>
                {tab}{countBadge}
              </button>
            );
          })}
        </div>

        {/* Meta Bar */}
        <div style={{
          padding: '10px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cc-text-muted)',
        }}>
          <span>{project.id}</span>
          <span>Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span>{project.department}</span>
          <span style={{ textTransform: 'capitalize' }}>Priority: {project.priority}</span>
        </div>

        {/* Tab Content */}
        <div className="cc-scroll" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {activeTab === 'Overview' && <OverviewTab project={project} />}
          {activeTab === 'Files' && <FilesTab project={project} />}
          {activeTab === 'Activity' && <ActivityTab project={project} />}
          {activeTab === 'Details' && <DetailsTab project={project} />}
          {activeTab === 'Outreach' && <OutreachTab project={project} />}
          {activeTab === 'Chat' && <ChatTab project={project} />}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cc-text-faint)',
        }}>
          <span>{project.id}</span>
          <button style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: 'var(--cc-lavender)', color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
          }}>
            Complete Task
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Tab: Overview ── */
function OverviewTab({ project }: { project: Project }) {
  const template = CARD_TEMPLATES[project.templateKey];
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Left Column */}
      <div style={{ flex: 55, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Description */}
        {project.description && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6,
            color: 'var(--cc-text)',
          }}>
            {project.description}
          </div>
        )}

        {/* Event details */}
        {project.eventDate && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: CalendarDays, text: new Date(project.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
              ...(project.eventTime ? [{ icon: ClockIcon, text: project.eventTime }] : []),
              ...(project.eventLocation ? [{ icon: MapPin, text: project.eventLocation }] : []),
            ].map((chip, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 8, background: 'rgba(0,0,0,0.03)',
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-secondary)',
              }}>
                <chip.icon size={13} />
                {chip.text}
              </div>
            ))}
          </div>
        )}

        {/* Deliverable type chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Array.from(new Set(project.roles.flatMap(r => (r.deliverables || []).map(d => d.icon)))).map(type => (
            <span key={type} style={{
              padding: '4px 10px', borderRadius: 12, fontSize: 11,
              fontFamily: 'var(--font-body)', fontWeight: 500,
              background: 'rgba(0,0,0,0.03)', color: 'var(--cc-text-secondary)',
              textTransform: 'capitalize',
            }}>
              {type}
            </span>
          ))}
          <span style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 11,
            fontFamily: 'var(--font-body)', fontWeight: 500,
            background: 'rgba(0,0,0,0.03)', color: 'var(--cc-text-secondary)',
          }}>
            {project.label}
          </span>
        </div>

        {/* General template: configure card prompt */}
        {template?.requiresManualSetup && (
          <div style={{
            padding: 16, borderRadius: 'var(--radius-md)',
            background: '#E5C07B10', border: '1px solid #E5C07B30',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <AlertTriangle size={18} style={{ color: '#E5C07B', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                color: 'var(--cc-text)', marginBottom: 4,
              }}>
                This card needs configuration
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text-secondary)',
                marginBottom: 10,
              }}>
                The General Request template requires manual role assignment.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(255,255,255,0.70)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text)',
                }}>
                  + Add Role
                </button>
                <button style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(255,255,255,0.70)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--cc-text)',
                }}>
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
            color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            Team Roles
          </div>
          {project.roles.map((role, i) => (
            <RoleCard key={i} role={role} isBatonHolder={project.batonHolder === role.member} />
          ))}
        </div>
      </div>

      {/* Right Column: Activity Feed */}
      <div style={{ flex: 45, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
          color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Activity
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(project.activity || []).map((item, i) => {
            const member = getTeamMember(item.member);
            return (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <Avatar initials={member?.initials || '?'} color={member?.color || '#9CA3AF'} size={24} />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
                  }}>
                    <span style={{ fontWeight: 600 }}>{member?.name}</span>{' - '}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cc-text-faint)' }}>{item.time}</span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text-secondary)',
                    marginTop: 2,
                  }}>
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment input */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center', marginTop: 'auto', paddingTop: 12,
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}>
          <input type="text" placeholder="Write a comment..." style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.70)',
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)', outline: 'none',
          }} />
          <button style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--cc-lavender)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff',
          }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Files ── */
function FilesTab({ project }: { project: Project }) {
  const allFiles = project.roles.flatMap(r =>
    (r.deliverables || []).map(d => ({ ...d, member: r.member }))
  );

  if (allFiles.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-muted)' }}>No files yet</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {allFiles.map((file, i) => {
        const member = getTeamMember(file.member);
        return (
          <div key={i} style={{
            padding: 16, borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: '100%', height: 80, borderRadius: 8, background: 'rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <FileTypeBadge icon={file.icon} style={{ transform: 'scale(1.8)' }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              color: 'var(--cc-text)', whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', marginBottom: 4,
            }}>
              {file.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cc-text-muted)',
              }}>
                {member?.name}
              </span>
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500,
                color: file.done ? '#A8C5A0' : 'var(--cc-text-faint)',
              }}>
                {file.done ? 'Final' : 'Draft'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Tab: Activity ── */
function ActivityTab({ project }: { project: Project }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(project.activity || []).map((item, i) => {
        const member = getTeamMember(item.member);
        return (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Avatar initials={member?.initials || '?'} color={member?.color || '#9CA3AF'} size={28} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  color: 'var(--cc-text)',
                }}>
                  {member?.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cc-text-faint)',
                }}>
                  {item.time}
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text-secondary)',
                marginTop: 4, lineHeight: 1.5,
              }}>
                {item.text}
              </div>
            </div>
          </div>
        );
      })}

      {/* Comment input */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center', paddingTop: 16,
        borderTop: '1px solid rgba(0,0,0,0.04)',
      }}>
        <input type="text" placeholder="Add a comment..." style={{
          flex: 1, padding: '10px 14px', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.70)',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)', outline: 'none',
        }} />
        <button style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--cc-lavender)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff',
        }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Tab: Details ── */
function DetailsTab({ project }: { project: Project }) {
  const template = CARD_TEMPLATES[project.templateKey];
  const details = [
    { label: 'Ticket Number', value: project.id },
    { label: 'Service Type', value: project.templateKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
    { label: 'Department', value: project.department },
    { label: 'Size', value: `${project.size} - ${template?.description || project.label}` },
    { label: 'Status', value: project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) },
    { label: 'Priority', value: project.priority.charAt(0).toUpperCase() + project.priority.slice(1) },
    { label: 'Due Date', value: new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
    ...(project.eventDate ? [{ label: 'Event Date', value: new Date(project.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }] : []),
    ...(project.eventTime ? [{ label: 'Event Time', value: project.eventTime }] : []),
    ...(project.eventLocation ? [{ label: 'Event Location', value: project.eventLocation }] : []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {details.map((d, i) => (
        <div key={i} style={{
          display: 'flex', padding: '12px 0',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <span style={{
            width: 140, flexShrink: 0,
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            color: 'var(--cc-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>
            {d.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text)',
          }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Tab: Outreach ── */
function OutreachTab({ project }: { project: Project }) {
  const [channels, setChannels] = useState({ facebook: true, instagram: true, website: false });
  const directorApproved = project.roles.find(r => r.member === 'narciso')?.status === 'complete';
  const hasCaption = project.roles.some(r => r.member === 'cat' && r.status === 'complete');
  const hasFinalAsset = project.roles.some(r => r.member === 'shawn' && r.deliverables?.some(d => d.done));
  const canPublish = directorApproved && hasCaption && hasFinalAsset;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Caption */}
      <div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
          color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
          marginBottom: 8,
        }}>
          Caption
        </div>
        <textarea style={{
          width: '100%', minHeight: 80, padding: 14, borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.70)',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)',
          resize: 'vertical', outline: 'none',
        }}
        defaultValue={project.description || 'Caption pending from Writer...'}
        />
      </div>

      {/* Channel toggles */}
      <div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
          color: 'var(--cc-text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em',
          marginBottom: 10,
        }}>
          Channels
        </div>
        {[
          { key: 'facebook', label: 'Facebook (NHBP Page)' },
          { key: 'instagram', label: 'Instagram (@nhbp)' },
          { key: 'website', label: 'Website (nhbp.com)' },
        ].map(ch => (
          <div key={ch.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.03)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text)',
            }}>
              {ch.label}
            </span>
            <button
              onClick={() => setChannels(prev => ({ ...prev, [ch.key]: !prev[ch.key as keyof typeof prev] }))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: channels[ch.key as keyof typeof channels] ? 'var(--cc-sage)' : 'var(--cc-text-faint)' }}
            >
              {channels[ch.key as keyof typeof channels] ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>
        ))}
      </div>

      {/* Publish button + checklist */}
      {!canPublish && (
        <div style={{
          padding: 14, borderRadius: 'var(--radius-md)',
          background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            color: 'var(--cc-text-secondary)', marginBottom: 8,
          }}>
            Before publishing:
          </div>
          {[
            { done: hasFinalAsset, text: 'At least one final deliverable' },
            { done: directorApproved, text: 'Director approval' },
            { done: hasCaption, text: 'Caption from Writer' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0',
              fontFamily: 'var(--font-body)', fontSize: 12,
              color: item.done ? '#A8C5A0' : 'var(--cc-text-muted)',
            }}>
              <span>{item.done ? '\u2713' : '\u25CB'}</span>
              {item.text}
            </div>
          ))}
        </div>
      )}

      <button disabled={!canPublish} style={{
        padding: '12px 24px', borderRadius: 10, border: 'none',
        background: canPublish ? 'var(--cc-lavender)' : 'rgba(0,0,0,0.06)',
        color: canPublish ? '#fff' : 'var(--cc-text-faint)',
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
        cursor: canPublish ? 'pointer' : 'not-allowed',
      }}>
        {'Publish to Selected Channels \u2192'}
      </button>
    </div>
  );
}

/* ── Tab: Chat ── */
function ChatTab({ project }: { project: Project }) {
  const messages = project.chat || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 ? (
          <div style={{
            padding: 40, textAlign: 'center', fontFamily: 'var(--font-body)',
            fontSize: 14, color: 'var(--cc-text-muted)',
          }}>
            No messages yet - start the conversation
          </div>
        ) : messages.map((msg, i) => {
          const member = getTeamMember(msg.member);
          return (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <Avatar initials={member?.initials || '?'} color={member?.color || '#9CA3AF'} size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                    color: 'var(--cc-text)',
                  }}>
                    {member?.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cc-text-faint)',
                  }}>
                    {msg.time}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--cc-text)',
                  lineHeight: 1.5, marginTop: 4,
                }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center', paddingTop: 12,
        borderTop: '1px solid rgba(0,0,0,0.04)',
      }}>
        <input type="text" placeholder="Message the team about this card..." style={{
          flex: 1, padding: '10px 14px', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.70)',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--cc-text)', outline: 'none',
        }} />
        <button style={{
          width: 36, height: 36, borderRadius: 10, background: 'var(--cc-lavender)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff',
        }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
