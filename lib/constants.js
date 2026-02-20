/*
 * WOLF FLOW — Constants
 * Created and Authored by Johnathon Moulds © 2026
 */

export const TEAM = {
  tracy:   { name: "Tracy",   role: "Admin",    color: "#c9a84c", emoji: "📋" },
  shawn:   { name: "Shawn",   role: "Design",   color: "#40b5ad", emoji: "🎨" },
  audry:   { name: "Audry",   role: "CommSpec",  color: "#d85f8a", emoji: "📢" },
  cat:     { name: "Cat",     role: "Writer",   color: "#4ade80", emoji: "✍️" },
  johnathon: { name: "Johnathon", role: "Photo", color: "#f59e0b", emoji: "📷" },
  narciso: { name: "Narciso", role: "Director", color: "#6b2737", emoji: "🦅" },
};

export const DEPARTMENTS = [
  { id: "admin", name: "Administration", emoji: "🏛️" },
  { id: "bkede", name: "Bkedé O Mshiké", emoji: "🐢" },
  { id: "comms", name: "Communications", emoji: "📰" },
  { id: "culture", name: "Culture", emoji: "🪶" },
  { id: "enviro", name: "Environmental", emoji: "🌍" },
  { id: "finance", name: "Finance", emoji: "💰" },
  { id: "gaming", name: "Gaming Commission", emoji: "🎰" },
  { id: "records", name: "Government Records", emoji: "🗃️" },
  { id: "health", name: "Health & Human Services", emoji: "🥼" },
  { id: "housing", name: "Housing", emoji: "🏡" },
  { id: "hr", name: "Human Resources", emoji: "💼" },
  { id: "it", name: "IT", emoji: "🧑‍💻" },
  { id: "legal", name: "Legal", emoji: "👩‍💼" },
  { id: "membership", name: "Membership Services", emoji: "⛹️" },
  { id: "planning", name: "Planning", emoji: "📊" },
  { id: "public_works", name: "Public Works", emoji: "🚏" },
  { id: "social_svcs", name: "Social Services", emoji: "🧑‍🧑‍🧒" },
  { id: "thpo", name: "THPO", emoji: "🏺" },
  { id: "council", name: "Tribal Council", emoji: "🗳️" },
  { id: "court", name: "Tribal Court", emoji: "⚖️" },
  { id: "police", name: "Tribal Police", emoji: "👮" },
];

export const PALETTES = [
  {
    id: 1, name: "Earth & Water",
    colors: ["#2d6a4f", "#40916c", "#74c69d", "#b7e4c7", "#1b4332"],
    accent: "#40916c",
  },
  {
    id: 2, name: "Sunset Warmth",
    colors: ["#9d0208", "#dc2f02", "#e85d04", "#f48c06", "#ffba08"],
    accent: "#e85d04",
  },
  {
    id: 3, name: "Deep Sky",
    colors: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"],
    accent: "#00b4d8",
  },
  {
    id: 4, name: "Prairie Gold",
    colors: ["#606c38", "#283618", "#fefae0", "#dda15e", "#bc6c25"],
    accent: "#dda15e",
  },
];

export const TYPE_PRESETS = [
  { id: 1, name: "Bold Authority", font: "var(--font-josefin)", weight: 700, transform: "uppercase", spacing: "0.12em" },
  { id: 2, name: "Elegant Flow", font: "var(--font-playfair)", weight: 400, transform: "none", spacing: "0.02em" },
  { id: 3, name: "Modern Clean", font: "var(--font-josefin)", weight: 300, transform: "none", spacing: "0.08em" },
  { id: 4, name: "Warm Story", font: "Georgia, serif", weight: 400, transform: "none", spacing: "0.01em", italic: true },
];

export const CLANS = [
  { id: "crane",  name: "Crane Clan",  title: "Voice of the People", energy: "Measured, dignified, deliberate", icon: "🪶", glowColor: "#d4a843" },
  { id: "loon",   name: "Loon Clan",   title: "Heart of Representation", energy: "Humble, centered, reflective", icon: "🌊", glowColor: "#2d8a8a" },
  { id: "bear",   name: "Bear Clan",   title: "Guardians & Upholders", energy: "Strong, grounded, unwavering", icon: "🐻", glowColor: "#8a3a2f" },
  { id: "fish",   name: "Fish Clan",   title: "Keepers of Memory", energy: "Wise, deep, preserving", icon: "🐟", glowColor: "#6b8fad" },
  { id: "marten", name: "Marten Clan", title: "Hunters & Providers", energy: "Skillful, quick, resourceful", icon: "🌿", glowColor: "#c47a3a" },
  { id: "deer",   name: "Deer Clan",   title: "Keepers of Peace", energy: "Gentle, healing, balanced", icon: "🦌", glowColor: "#6a9a5b" },
  { id: "eagle",  name: "Eagle Clan",  title: "Spiritual Stewards & Healers", energy: "Sacred, visionary, transcendent", icon: "🦅", glowColor: "#d4c87a" },
  { id: "wolf",   name: "Wolf Clan",   title: "Courage & Strategy", energy: "Strategic, watchful, courageous", icon: "🐺", glowColor: "#6a5acd" },
  { id: "none",   name: "No Clan Element", title: "Clean Design", energy: "Minimal, open, universal", icon: "🔥", glowColor: "#a0906a" },
];

export const SERVICES = [
  { id: "vd",      name: "Visual Design",   emoji: "🎨", desc: "Flyers, posters, graphics, branding", href: "/portal/vd", active: true },
  { id: "photo",   name: "Photography",     emoji: "📷", desc: "Event coverage, headshots, products", href: "/portal/photo", active: false },
  { id: "social",  name: "Social Media",    emoji: "📱", desc: "Posts, stories, campaigns", href: "/portal/social", active: false },
  { id: "web",     name: "Website",         emoji: "🌐", desc: "Page updates, new content, edits", href: "/portal/web", active: false },
  { id: "writing", name: "Writing",         emoji: "✍️", desc: "Blog posts, articles, newsletters", href: "/portal/writing", active: false },
  { id: "qtp",     name: "QTP",             emoji: "📰", desc: "Quarterly publication content", href: "/portal/qtp", active: false },
  { id: "events",  name: "Events",          emoji: "🗓️", desc: "Event support and promotion", href: "/portal/events", active: false },
  { id: "video",   name: "Video",           emoji: "🎬", desc: "Video production and editing", href: "/portal/video", active: false },
];
