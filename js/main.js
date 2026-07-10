/**
 * STYLE HUB — MAIN (shared across every public page)
 * ------------------------------------------------------------------
 * Handles: sticky navbar, mobile menu, dark/light theme + persistence,
 * back-to-top, button ripple, scroll-reveal animation, toast system,
 * and loading CMS-driven site chrome (announcement bar, footer,
 * contact details, opening hours) from Firestore/demo settings.
 * ------------------------------------------------------------------
 */
import { fetchSettings, fetchCollection } from "./firebase.js";
import { icon } from "./icons.js";

export const qs = (sel, ctx = document) => ctx.querySelector(sel);
export const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const THEME_KEY = "stylehub_theme";

/* ---------------------------------------------------------------- THEME */
export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(preferred);

  qsa(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  qsa(".theme-toggle").forEach(btn => {
    btn.innerHTML = icon(theme === "light" ? "moon" : "sun", "icon");
    btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  });
}

/* ---------------------------------------------------------------- NAVBAR */
export function initNavbar() {
  const nav = qs(".navbar");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = qs(".nav-burger");
  const panel = qs(".mobile-panel");
  if (burger && panel) {
    burger.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      burger.classList.toggle("is-active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    qsa("a", panel).forEach(a => a.addEventListener("click", () => {
      panel.classList.remove("is-open");
      burger.classList.remove("is-active");
      document.body.style.overflow = "";
    }));
  }
}

/* ---------------------------------------------------------------- BACK TO TOP */
export function initBackToTop() {
  const btn = qs(".back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------------------------------------------------------------- RIPPLE */
export function initRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  });
}

/* ---------------------------------------------------------------- SCROLL REVEAL */
export function initReveal() {
  const targets = qsa("[data-reveal], [data-reveal-group]");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  targets.forEach(t => io.observe(t));
}

/* ---------------------------------------------------------------- TOASTS */
function toastStack() {
  let stack = qs(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.setAttribute("aria-live", "polite");
    document.body.appendChild(stack);
  }
  return stack;
}

export function toast(message, type = "info", duration = 4200) {
  const stack = toastStack();
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  const iconName = type === "success" ? "check" : type === "error" ? "x" : "info";
  el.innerHTML = `${icon(iconName, "icon")}<p>${message}</p><button class="toast-close" aria-label="Dismiss">${icon("x")}</button>`;
  stack.appendChild(el);
  const remove = () => { el.style.opacity = "0"; setTimeout(() => el.remove(), 200); };
  el.querySelector(".toast-close").addEventListener("click", remove);
  setTimeout(remove, duration);
}

/* ---------------------------------------------------------------- FORMATTERS */
export function formatPrice(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function formatDuration(min) {
  const m = Number(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function renderStars(rating, max = 5) {
  let out = "";
  for (let i = 1; i <= max; i++) {
    out += `<span style="opacity:${i <= Math.round(rating) ? 1 : 0.25}">${icon("star")}</span>`;
  }
  return out;
}

export function debounce(fn, wait = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ---------------------------------------------------------------- CMS SITE CHROME */
let cachedSettings = null;

export async function getSettings() {
  if (cachedSettings) return cachedSettings;
  cachedSettings = await fetchSettings();
  return cachedSettings;
}

export async function loadSiteChrome() {
  const settings = await getSettings();

  // CMS-driven accent color — falls back to the brand default if unset.
  if (settings.themeAccent) {
    document.documentElement.style.setProperty("--accent", settings.themeAccent);
  }

  // Announcement bar
  const bar = qs("[data-announcement]");
  if (bar) {
    if (settings.announcementEnabled && settings.announcement) {
      bar.textContent = settings.announcement;
      bar.hidden = false;
    } else {
      bar.hidden = true;
    }
  }

  // Footer / contact fill-ins (any element with data-field="phone" etc.)
  const fieldMap = {
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    tagline: settings.tagline,
    salonName: settings.salonName
  };
  Object.entries(fieldMap).forEach(([key, val]) => {
    qsa(`[data-field="${key}"]`).forEach(el => { if (val) el.textContent = val; });
  });
  qsa("[data-field='phone-href']").forEach(el => el.href = `tel:${(settings.phone || "").replace(/\s+/g, "")}`);
  qsa("[data-field='whatsapp-href']").forEach(el => el.href = `https://wa.me/${settings.whatsapp}`);
  qsa("[data-field='email-href']").forEach(el => el.href = `mailto:${settings.email}`);
  qsa("[data-field='maps-embed']").forEach(el => { if (el.tagName === "IFRAME") el.src = settings.mapsEmbedUrl; });

  // Socials
  const socialMap = { instagram: settings.socials?.instagram, facebook: settings.socials?.facebook, youtube: settings.socials?.youtube, whatsapp: settings.socials?.whatsapp };
  qsa("[data-social]").forEach(a => {
    const key = a.getAttribute("data-social");
    if (socialMap[key]) a.href = socialMap[key];
  });

  // Opening hours table
  const hoursTarget = qs("[data-hours]");
  if (hoursTarget && Array.isArray(settings.openingHours)) {
    hoursTarget.innerHTML = settings.openingHours.map(h => `
      <li class="flex-between">
        <span>${h.day}</span>
        <span class="${h.closed ? "muted" : ""}">${h.closed ? "Closed" : `${to12h(h.open)} – ${to12h(h.close)}`}</span>
      </li>`).join("");
  }

  // Disclaimer text
  qsa("[data-field='disclaimer']").forEach(el => { el.textContent = settings.disclaimerText; });

  document.title = document.title.replace("Style Hub", settings.salonName || "Style Hub");

  return settings;
}

export function to12h(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/* ---------------------------------------------------------------- FAVORITES (guest / localStorage layer) */
const FAV_KEY = "stylehub_demo_favorites";

export function getFavoriteIds() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
}

export function toggleFavorite(id) {
  const list = getFavoriteIds();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1); else list.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
  return list.includes(id);
}

export function isFavorite(id) {
  return getFavoriteIds().includes(id);
}

/** Event delegation so favorite buttons work even on cards rendered after page load. */
export function initFavoriteButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav-toggle]");
    if (!btn) return;
    const id = btn.getAttribute("data-fav-toggle");
    const nowFav = toggleFavorite(id);
    btn.classList.toggle("is-active", nowFav);
    btn.setAttribute("aria-pressed", String(nowFav));
    btn.setAttribute("aria-label", nowFav ? "Remove from favorites" : "Add to favorites");
    toast(nowFav ? "Added to favorites" : "Removed from favorites", "success", 2200);
    document.dispatchEvent(new CustomEvent("stylehub:favorites-changed", { detail: { id, isFavorite: nowFav } }));
  });
}

/* ---------------------------------------------------------------- BOOTSTRAP */
function setFooterYear() {
  qsa("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
}

/** Fills in the handful of icons every page shares, so pages don't repeat this wiring. */
function initCommonIcons() {
  const favBtn = qs("#nav-fav-btn");
  if (favBtn) favBtn.innerHTML = icon("heart", "icon");
  const backTop = qs(".back-to-top");
  if (backTop) backTop.innerHTML = icon("arrowUp");
  const searchIcon = qs("#search-icon");
  if (searchIcon) searchIcon.innerHTML = icon("search");
  const filterIcon = qs("#filter-icon");
  if (filterIcon) filterIcon.innerHTML = icon("filter");
  qsa("[data-icon]").forEach(el => { el.innerHTML = icon(el.getAttribute("data-icon")); });
}

export async function initLayout() {
  initTheme();
  initNavbar();
  initBackToTop();
  initRipple();
  initFavoriteButtons();
  initCommonIcons();
  setFooterYear();
  registerServiceWorker();
  await loadSiteChrome();
  initReveal(); // after chrome loads, so late content still gets observed
}

/** Registers the offline-shell service worker. Safe no-op if unsupported. */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => { /* offline support just won't be available */ });
    });
  }
}

document.addEventListener("DOMContentLoaded", initLayout);

export { fetchCollection };
