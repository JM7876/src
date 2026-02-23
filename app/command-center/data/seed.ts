/*
 * WOLF FLOW — Command Center Seed Data
 * Created and Authored by Johnathon Moulds © 2026
 */

export const TEAM = [
  { id: 'tracy',     name: 'Tracy',     role: 'Admin / Coordinator',       initials: 'T', color: '#6DAF6D', pin: '0000' },
  { id: 'shawn',     name: 'Shawn',     role: 'Graphic Designer',          initials: 'S', color: '#7CADD9', pin: '0000' },
  { id: 'cat',       name: 'Cat',       role: 'Writer',                    initials: 'C', color: '#E08AAF', pin: '0000' },
  { id: 'audry',     name: 'Audry',     role: 'Communications Specialist', initials: 'A', color: '#E5A070', pin: '0000' },
  { id: 'johnathon', name: 'Johnathon', role: 'Photographer',              initials: 'J', color: '#B4A7D6', pin: '0000' },
  { id: 'narciso',   name: 'Narciso',   role: 'Director',                  initials: 'N', color: '#D4B85A', pin: '0000' },
];

export type TeamMember = typeof TEAM[number];

export const DEPARTMENTS = [
  'Administration', "Chairman's Office", 'Child Welfare', 'Communications',
  'Cultural', 'Education', 'Elders', 'Enrollment', 'Finance', 'Fire Keeper',
  'Health Services', 'Housing', 'Human Resources', 'IT', 'Language',
  'Legal', 'Maintenance', 'Natural Resources', 'Recreation', 'Tribal Council'
];

export type ProjectStatus = 'intake' | 'in_progress' | 'review' | 'approved' | 'published' | 'archived';
export type RoleStatus = 'waiting' | 'upcoming' | 'in_progress' | 'complete';
export type ProjectSize = 'XS' | 'S' | 'M' | 'L';
export type Priority = 'standard' | 'rush' | 'urgent';

export interface Deliverable {
  name: string;
  icon: string;
  iconColor?: string;
  done: boolean;
}

export interface ProjectRole {
  member: string;
  role: string;
  status: RoleStatus;
  progress: [number, number];
  statusLabel?: string;
  deliverables?: Deliverable[];
  checklist?: { text: string; done: boolean }[];
  note?: string;
}

export interface ActivityItem {
  member: string;
  text: string;
  time: string;
}

export interface ChatMessage {
  member: string;
  text: string;
  time: string;
}

export interface Campaign {
  totalWeeks: number;
  currentWeek: number;
  currentPhase: string;
}

export interface Project {
  id: string;
  title: string;
  department: string;
  size: ProjectSize;
  label: string;
  templateKey: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  roles: ProjectRole[];
  batonHolder: string | null;
  activity?: ActivityItem[];
  chat?: ChatMessage[];
  campaign?: Campaign;
}

export const SEED_PROJECTS: Project[] = [
  {
    id: 'WF-2026-0038',
    title: 'Business Card Reprint — Sarah Martinez',
    department: 'Health Services',
    size: 'XS',
    label: 'stationery',
    templateKey: 'stationery-kit',
    status: 'approved',
    priority: 'standard',
    dueDate: '2026-02-25',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [1, 1], checklist: [{ text: 'Verify employee info', done: true }] },
      { member: 'shawn', role: 'Graphic Designer', status: 'complete', progress: [1, 1], deliverables: [
        { name: 'Martinez-BizCard.ai', icon: 'Ai', iconColor: '#FF9A00', done: true }
      ], checklist: [{ text: 'Set employee info', done: true }] },
      { member: 'narciso', role: 'Director', status: 'complete', progress: [1, 1], checklist: [{ text: 'Approve for print', done: true }] },
    ],
    batonHolder: null,
    activity: [
      { member: 'narciso', text: 'Approved business card for print', time: '1 day ago' },
      { member: 'shawn', text: 'Uploaded Martinez-BizCard.ai', time: '2 days ago' },
      { member: 'tracy', text: 'Intake processed', time: 'Feb 20' },
    ],
  },
  {
    id: 'WF-2026-0041',
    title: 'Headshot — New HR Director',
    department: 'Human Resources',
    size: 'XS',
    label: 'photo',
    templateKey: 'studio-hub',
    status: 'in_progress',
    priority: 'rush',
    dueDate: '2026-02-24',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [1, 1], checklist: [{ text: 'Schedule session', done: true }] },
      { member: 'johnathon', role: 'Photographer', status: 'in_progress', progress: [0, 1], statusLabel: 'Shooting Feb 24',
        checklist: [{ text: 'Set up lighting/backdrop', done: false }, { text: 'Shoot session', done: false }, { text: 'Retouch images', done: false }] },
    ],
    batonHolder: 'johnathon',
    activity: [
      { member: 'tracy', text: 'Session scheduled for Feb 24 at 2PM', time: '3h ago' },
      { member: 'tracy', text: 'Intake processed', time: 'Feb 21' },
    ],
  },
  {
    id: 'WF-2026-0039',
    title: 'Language Program Social Media Post',
    department: 'Language',
    size: 'S',
    label: 'social',
    templateKey: 'community-outreach-social',
    status: 'review',
    priority: 'standard',
    dueDate: '2026-02-28',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [2, 2] },
      { member: 'cat', role: 'Writer', status: 'complete', progress: [1, 1], deliverables: [
        { name: 'LangProgram-Caption.docx', icon: 'Wd', iconColor: '#2196F3', done: true }
      ] },
      { member: 'shawn', role: 'Graphic Designer', status: 'complete', progress: [2, 2], deliverables: [
        { name: 'LangProgram-IG.psd', icon: 'Ps', iconColor: '#31A8FF', done: true },
        { name: 'LangProgram-FB.psd', icon: 'Ps', iconColor: '#31A8FF', done: true },
      ] },
      { member: 'narciso', role: 'Director', status: 'in_progress', progress: [0, 1], statusLabel: 'Reviewing' },
    ],
    batonHolder: 'narciso',
    activity: [
      { member: 'narciso', text: 'Review started', time: '1h ago' },
      { member: 'shawn', text: 'Uploaded LangProgram-FB.psd', time: '5h ago' },
      { member: 'cat', text: 'Caption finalized', time: 'Yesterday' },
    ],
  },
  {
    id: 'WF-2026-0040',
    title: 'Elders Luncheon Flyer',
    department: 'Elders',
    size: 'S',
    label: 'flyer',
    templateKey: 'visual-designs',
    status: 'in_progress',
    priority: 'standard',
    dueDate: '2026-03-05',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [2, 2] },
      { member: 'shawn', role: 'Graphic Designer', status: 'in_progress', progress: [1, 2], deliverables: [
        { name: 'EldersLuncheon-Flyer.ai', icon: 'Ai', iconColor: '#FF9A00', done: true },
        { name: 'EldersLuncheon-HalfSheet.ai', icon: 'Ai', iconColor: '#FF9A00', done: false },
      ] },
      { member: 'narciso', role: 'Director', status: 'waiting', progress: [0, 1] },
    ],
    batonHolder: 'shawn',
    activity: [
      { member: 'shawn', text: 'Uploaded first draft flyer', time: '6h ago' },
      { member: 'tracy', text: 'Specs confirmed with Elders dept', time: '1 day ago' },
    ],
  },
  {
    id: 'WF-2026-0042',
    title: 'Spring Health Fair Flyer & Social Campaign',
    department: 'Health Services',
    size: 'M',
    label: 'event',
    templateKey: 'events',
    status: 'in_progress',
    priority: 'rush',
    dueDate: '2026-03-14',
    eventDate: '2026-03-14',
    eventTime: '10:00 AM - 2:00 PM',
    eventLocation: 'Pine Creek Pavilion',
    description: 'Annual Spring Health Fair. Free health screenings, nutrition info, kids activities. Need full campaign: event flyer, social media graphics for FB/IG, day-of photography, post-event recap for website.',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [3, 3],
        checklist: [{ text: 'Confirm event details', done: true }, { text: 'Verify content with department', done: true }, { text: 'Set internal deadlines', done: true }] },
      { member: 'shawn', role: 'Graphic Designer', status: 'in_progress', progress: [2, 3], deliverables: [
        { name: 'HealthFair-Flyer-v3.ai', icon: 'Ai', iconColor: '#FF9A00', done: true },
        { name: 'HealthFair-IG-1080.psd', icon: 'Ps', iconColor: '#31A8FF', done: true },
        { name: 'HealthFair-FB-Cover.psd', icon: 'Ps', iconColor: '#31A8FF', done: false },
      ],
      checklist: [{ text: 'Design event flyer', done: true }, { text: 'Design IG graphic', done: true }, { text: 'Design FB cover', done: false }, { text: 'Export print-ready PDFs', done: false }] },
      { member: 'cat', role: 'Writer', status: 'in_progress', progress: [1, 3],
        checklist: [{ text: 'Write flyer copy', done: true }, { text: 'Write social captions', done: false }, { text: 'Write website listing', done: false }] },
      { member: 'johnathon', role: 'Photographer', status: 'upcoming', progress: [0, 3], statusLabel: 'Upcoming - Mar 14',
        checklist: [{ text: 'Confirm shot list', done: false }, { text: 'Shoot event coverage', done: false }, { text: 'Edit and deliver photos', done: false }] },
      { member: 'audry', role: 'Communications Specialist', status: 'waiting', progress: [0, 5], statusLabel: 'Waiting on Design + Copy' },
      { member: 'narciso', role: 'Director', status: 'waiting', progress: [1, 3],
        checklist: [{ text: 'Review flyer design', done: true }, { text: 'Review social graphics', done: false }, { text: 'Approve for publish', done: false }] },
    ],
    batonHolder: 'shawn',
    activity: [
      { member: 'shawn', text: 'Uploaded HealthFair-IG-1080.psd', time: '2h ago' },
      { member: 'cat', text: 'Started draft copy - event details confirmed', time: '4h ago' },
      { member: 'narciso', text: 'Approved concept direction', time: '2 days ago' },
      { member: 'shawn', text: 'Uploaded HealthFair-Flyer-v3.ai', time: '3 days ago' },
      { member: 'tracy', text: 'Intake processed, roles assigned', time: 'Feb 3' },
    ],
    chat: [
      { member: 'shawn', text: 'Flyer v3 is up - changed the headline font like Narciso suggested', time: 'Today 3:22 PM' },
      { member: 'cat', text: 'Caption is almost done. Do we want to lead with the free screenings or the kids activities?', time: 'Today 2:48 PM' },
      { member: 'tracy', text: 'Free screenings - that\'s what Health Services wants to emphasize', time: 'Today 2:52 PM' },
      { member: 'cat', text: 'Got it, updating now', time: 'Today 2:53 PM' },
      { member: 'narciso', text: 'Flyer looks great Shawn. Approved. Move to social graphics when ready.', time: 'Today 10:15 AM' },
      { member: 'johnathon', text: 'Just confirmed - I\'ll be at Pine Creek at 9:30 for setup shots before the event starts', time: 'Yesterday 4:30 PM' },
    ],
  },
  {
    id: 'WF-2026-0043',
    title: 'Board Meeting Presentation Deck',
    department: 'Tribal Council',
    size: 'M',
    label: 'event',
    templateKey: 'general',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-02-26',
    description: 'Quarterly board meeting deck for Tribal Council. Need updated department stats, financial summary slides, and upcoming initiatives.',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'complete', progress: [2, 2] },
      { member: 'cat', role: 'Writer', status: 'in_progress', progress: [2, 4],
        checklist: [{ text: 'Draft directors message', done: true }, { text: 'Compile department reports', done: true }, { text: 'Write financial summary', done: false }, { text: 'Final proofread', done: false }] },
      { member: 'shawn', role: 'Graphic Designer', status: 'waiting', progress: [0, 3], statusLabel: 'Waiting on Content' },
      { member: 'narciso', role: 'Director', status: 'waiting', progress: [0, 2] },
    ],
    batonHolder: 'cat',
    activity: [
      { member: 'cat', text: 'Department reports compiled', time: '3h ago' },
      { member: 'tracy', text: 'Deadline moved up to Feb 26', time: '1 day ago' },
    ],
  },
  {
    id: 'WF-2026-0035',
    title: 'Quarterly Turtle Press - Spring 2026',
    department: 'Communications',
    size: 'L',
    label: 'publication',
    templateKey: 'turtle-press',
    status: 'in_progress',
    priority: 'standard',
    dueDate: '2026-04-15',
    description: 'Spring edition of the Quarterly Turtle Press newsletter. 8-12 articles covering all departments, community events, and tribal news.',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'in_progress', progress: [4, 8],
        checklist: [{ text: 'Solicit articles from departments', done: true }, { text: 'Track article submissions', done: true }, { text: 'Coordinate photo assignments', done: true }, { text: 'Manage print vendor timeline', done: true }, { text: 'Proof final layout', done: false }, { text: 'Manage distribution', done: false }, { text: 'Send reminders to late departments', done: false }, { text: 'Final delivery coordination', done: false }] },
      { member: 'cat', role: 'Writer / Editor', status: 'in_progress', progress: [3, 8],
        checklist: [{ text: 'Write Comms articles', done: true }, { text: 'Edit Health Services submission', done: true }, { text: 'Edit Education submission', done: true }, { text: 'Edit Cultural submission', done: false }, { text: 'Edit remaining submissions', done: false }, { text: 'Write TOC and editors note', done: false }, { text: 'Proof all articles', done: false }, { text: 'Final proof of layout', done: false }] },
      { member: 'johnathon', role: 'Photographer', status: 'in_progress', progress: [2, 6],
        checklist: [{ text: 'Shoot Health Services feature', done: true }, { text: 'Shoot Education feature', done: true }, { text: 'Shoot cover photo', done: false }, { text: 'Edit delivered images', done: false }, { text: 'Shoot Cultural feature', done: false }, { text: 'Provide captions', done: false }] },
      { member: 'shawn', role: 'Designer / Layout', status: 'waiting', progress: [0, 8], statusLabel: 'Waiting on Articles' },
      { member: 'narciso', role: 'Director', status: 'waiting', progress: [0, 3] },
      { member: 'audry', role: 'Distribution', status: 'waiting', progress: [0, 4] },
    ],
    batonHolder: 'cat',
    campaign: { totalWeeks: 12, currentWeek: 4, currentPhase: 'Writing & Photography' },
    activity: [
      { member: 'cat', text: 'Finished editing Education department article', time: '1h ago' },
      { member: 'johnathon', text: 'Education feature photos delivered', time: 'Yesterday' },
      { member: 'tracy', text: 'Reminder sent to Cultural, Legal, Finance', time: '2 days ago' },
    ],
  },
  {
    id: 'WF-2026-0036',
    title: 'Annual Report 2026',
    department: 'Communications',
    size: 'L',
    label: 'publication',
    templateKey: 'annual-report',
    status: 'in_progress',
    priority: 'standard',
    dueDate: '2026-06-30',
    description: 'Comprehensive annual report covering all tribal government departments, financial summary, and year-in-review.',
    roles: [
      { member: 'tracy', role: 'Admin / Coordinator', status: 'in_progress', progress: [2, 6] },
      { member: 'cat', role: 'Writer / Editor', status: 'in_progress', progress: [1, 10] },
      { member: 'johnathon', role: 'Photographer', status: 'upcoming', progress: [0, 8] },
      { member: 'shawn', role: 'Designer / Layout', status: 'upcoming', progress: [0, 10], statusLabel: 'Starts Week 6' },
      { member: 'narciso', role: 'Director', status: 'waiting', progress: [0, 5] },
      { member: 'audry', role: 'Distribution', status: 'waiting', progress: [0, 4] },
    ],
    batonHolder: 'cat',
    campaign: { totalWeeks: 16, currentWeek: 2, currentPhase: 'Content Collection' },
    activity: [
      { member: 'tracy', text: 'Content request sent to all 20 departments', time: '3 days ago' },
      { member: 'cat', text: 'Started drafting directors message outline', time: '2 days ago' },
    ],
  },
];

export function getTeamMember(id: string) {
  return TEAM.find(m => m.id === id);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
