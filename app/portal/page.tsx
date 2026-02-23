// Created and Authored by Johnathon Moulds 2026

'use client';

import dynamic from 'next/dynamic';

// Dynamically import WolfCalendar with no SSR
// (required — calendar uses browser APIs for glass displacement maps)
const WolfCalendar = dynamic(
  () => import('../WolfCalendar'),
  { ssr: false }
);

export default function PortalPage() {
  return <WolfCalendar />;
}

// Created and Authored by Johnathon Moulds 2026
