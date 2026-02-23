/*
 * WOLF FLOW — Card Templates Registry
 * Created and Authored by Johnathon Moulds © 2026
 */

export interface CardTemplate {
  size: string;
  label: string;
  defaultPriority: string;
  description: string;
  tabs: string[];
  rushByDefault?: boolean;
  requiresManualSetup?: boolean;
  isCampaign?: boolean;
  campaignConfig?: {
    totalWeeks: number;
    phases: { name: string; weeks: number[]; color: string; leads: string[] }[];
  };
}

export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  'stationery-kit': {
    size: 'XS', label: 'stationery', defaultPriority: 'standard',
    description: 'Business cards, letterhead, envelopes, name badges, name plates',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Chat'],
  },
  'studio-hub': {
    size: 'XS', label: 'photo', defaultPriority: 'standard',
    description: 'Professional headshot booking and delivery',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Chat'],
  },
  'diy-builder': {
    size: 'XS', label: 'social', defaultPriority: 'standard',
    description: 'Department-created social content with Comms review',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Outreach', 'Chat'],
  },
  'visual-designs': {
    size: 'S', label: 'flyer', defaultPriority: 'standard',
    description: 'Flyers, posters, banners, signage, infographics',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Outreach', 'Chat'],
  },
  'community-outreach-social': {
    size: 'S', label: 'social', defaultPriority: 'standard',
    description: 'Social media graphics and copy for Facebook/Instagram/website',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Outreach', 'Chat'],
  },
  'community-outreach-alert': {
    size: 'S', label: 'alert', defaultPriority: 'urgent',
    description: 'Urgent alert - emergency closure, weather, public safety',
    tabs: ['Overview', 'Activity', 'Details', 'Outreach', 'Chat'],
    rushByDefault: true,
  },
  'events': {
    size: 'M', label: 'event', defaultPriority: 'rush',
    description: 'Community events requiring flyer + social + photography + post-event coverage',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Outreach', 'Chat'],
  },
  'general': {
    size: 'M', label: 'general', defaultPriority: 'standard',
    description: 'Catch-all for requests that don\'t fit other service types',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Outreach', 'Chat'],
    requiresManualSetup: true,
  },
  'turtle-press': {
    size: 'L', label: 'publication', defaultPriority: 'standard',
    description: 'Quarterly Turtle Press newsletter - 12-week production cycle',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Chat'],
    isCampaign: true,
    campaignConfig: {
      totalWeeks: 12,
      phases: [
        { name: 'Content Collection', weeks: [1, 2, 3, 4], color: '#E08AAF', leads: ['tracy', 'cat'] },
        { name: 'Writing & Photography', weeks: [3, 4, 5, 6], color: '#B4A7D6', leads: ['cat', 'johnathon'] },
        { name: 'Design & Layout', weeks: [6, 7, 8, 9], color: '#7CADD9', leads: ['shawn'] },
        { name: 'Director Review', weeks: [9, 10], color: '#D4B85A', leads: ['narciso'] },
        { name: 'Print Production', weeks: [10, 11], color: '#E5A070', leads: ['tracy'] },
        { name: 'Distribution', weeks: [11, 12], color: '#6DAF6D', leads: ['audry', 'tracy'] },
      ],
    },
  },
  'annual-report': {
    size: 'L', label: 'publication', defaultPriority: 'standard',
    description: 'Annual Report - 16-week production cycle',
    tabs: ['Overview', 'Files', 'Activity', 'Details', 'Chat'],
    isCampaign: true,
    campaignConfig: {
      totalWeeks: 16,
      phases: [
        { name: 'Content Collection', weeks: [1, 2, 3, 4, 5], color: '#E08AAF', leads: ['tracy', 'cat'] },
        { name: 'Writing & Photography', weeks: [4, 5, 6, 7, 8], color: '#B4A7D6', leads: ['cat', 'johnathon'] },
        { name: 'Design & Layout', weeks: [8, 9, 10, 11, 12], color: '#7CADD9', leads: ['shawn'] },
        { name: 'Director Review', weeks: [12, 13], color: '#D4B85A', leads: ['narciso'] },
        { name: 'Print Production', weeks: [13, 14, 15], color: '#E5A070', leads: ['tracy'] },
        { name: 'Distribution', weeks: [15, 16], color: '#6DAF6D', leads: ['audry', 'tracy'] },
      ],
    },
  },
};

export function getTemplateTabs(templateKey: string): string[] {
  return CARD_TEMPLATES[templateKey]?.tabs ?? ['Overview', 'Files', 'Activity', 'Details', 'Chat'];
}
