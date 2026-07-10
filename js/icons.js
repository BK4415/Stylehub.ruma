/**
 * STYLE HUB — SVG ICON LIBRARY
 * ------------------------------------------------------------------
 * Centralised inline SVG icons (no icon fonts, no external requests).
 * Usage: import { icon } from "./icons.js"; el.innerHTML = icon("heart");
 * ------------------------------------------------------------------
 */
const ICONS = {
  heart: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  scissors: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m20 4-8.5 8.5M8.1 8.1 20 20M8.1 15.9 12 12"/></svg>`,
  beard: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12l1 6c0 6-4 10-7 10s-7-4-7-10Z"/><path d="M9 10c1 1 1.5 1 3 0M12 10c1.5 1 2 1 3 0"/></svg>`,
  wash: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s5 5.5 5 9.5a5 5 0 0 1-10 0C7 8.5 12 3 12 3Z"/></svg>`,
  face: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8 15c1.2 1.3 2.6 2 4 2s2.8-.7 4-2"/></svg>`,
  combo: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="m20 4-9 9M13 15l7 7"/><path d="M8 16h8"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>`,
  user: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M17 14.5c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C9.3 9 8.8 7.8 8.6 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 3 1.3 3 .9 3.5.8.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Z" fill="none" stroke-width="2"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9a1 1 0 0 1 1-1Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5Z" fill="currentColor" stroke="none"/></svg>`,
  check: `<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5L20 6"/></svg>`,
  x: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.6 6.8L12 17.6l-6.2 3.3 1.6-6.8L2.2 9.5l6.9-.7Z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M9.5 20a2.5 2.5 0 0 0 5 0"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 2.5a8 8 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.9 7.9 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.6 1.5L10 22h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.4 1 2-3.5Z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M7 12h10M10 19h4"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  info: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
  dashboard: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="12" width="8" height="9" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>`
};

export function icon(name, cls = "") {
  const svg = ICONS[name] || ICONS.info;
  if (!cls) return svg;
  return svg.replace("<svg ", `<svg class="${cls}" `);
}

export default ICONS;
