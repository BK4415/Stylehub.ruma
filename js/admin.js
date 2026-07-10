/**
 * STYLE HUB — ADMIN PANEL LOGIC
 * ------------------------------------------------------------------
 * Shared logic for every page under /admin. Each admin HTML page
 * imports only the init function it needs from here, so this file
 * stays the single source of truth for admin data operations while
 * each page keeps its own markup (same pattern as the public site).
 *
 * AUTH NOTE (Phase 1): Login uses Firebase Auth when connected, or a
 * demo admin session (sessionStorage) when Firebase isn't configured.
 * Full Role-Based Access Control (Super Admin / Admin / Staff) reading
 * a `role` field from the "users" collection is a Phase 2 upgrade —
 * the guard below is intentionally written so that upgrade only
 * touches `requireAdminAuth()`, nothing else.
 * ------------------------------------------------------------------
 */
import {
  fetchCollection, addItem, updateItem, deleteItem,
  adminSignIn, adminSignOut, onAdminAuthChange, isFirebaseReady, initFirebase
} from "./firebase.js";
import { toast, qs, qsa, formatPrice, formatDuration, to12h } from "./main.js";
import { icon } from "./icons.js";

const DEMO_SESSION_KEY = "stylehub_admin_demo";
const DEMO_EMAIL_KEY = "stylehub_admin_demo_email";

/* ------------------------------------------------------------------ AUTH */
export async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = qs("#admin-email").value.trim();
  const password = qs("#admin-password").value;
  const btn = qs("#login-submit");
  const errorEl = qs("#login-error");
  errorEl.textContent = "";
  btn.disabled = true;
  btn.querySelector("span").innerHTML = `<span class="spinner"></span>`;

  const result = await adminSignIn(email, password);

  btn.disabled = false;
  btn.querySelector("span").textContent = "Sign In";

  if (result.ok) {
    if (result.demo) {
      sessionStorage.setItem(DEMO_SESSION_KEY, "1");
      sessionStorage.setItem(DEMO_EMAIL_KEY, email);
    }
    window.location.href = "index.html";
  } else {
    errorEl.textContent = result.error || "Invalid email or password.";
  }
}

/** Call at the top of every protected admin page. Redirects if not signed in. */
export async function requireAdminAuth() {
  await initFirebase();
  if (sessionStorage.getItem(DEMO_SESSION_KEY)) {
    setAdminIdentity(sessionStorage.getItem(DEMO_EMAIL_KEY) || "admin@stylehub.demo");
    return true;
  }
  if (!isFirebaseReady()) {
    window.location.href = "login.html";
    return false;
  }
  return new Promise((resolve) => {
    onAdminAuthChange((user) => {
      if (user) {
        setAdminIdentity(user.email);
        resolve(true);
      } else {
        window.location.href = "login.html";
        resolve(false);
      }
    });
  });
}

function setAdminIdentity(email) {
  qsa("[data-admin-email]").forEach(el => { el.textContent = email; });
  qsa("[data-admin-initial]").forEach(el => { el.textContent = (email || "A")[0].toUpperCase(); });
}

export async function handleLogout() {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
  sessionStorage.removeItem(DEMO_EMAIL_KEY);
  await adminSignOut();
  window.location.href = "login.html";
}

export function wireLogoutButtons() {
  qsa("[data-logout]").forEach(btn => btn.addEventListener("click", handleLogout));
}

export function wireAdminIcons() {
  qsa("[data-icon]").forEach(el => { el.innerHTML = icon(el.getAttribute("data-icon")); });
}

/* ------------------------------------------------------------------ DASHBOARD */
export async function initDashboard() {
  const [bookings, haircuts, services, barbers] = await Promise.all([
    fetchCollection("bookings", { includeHidden: true }),
    fetchCollection("haircuts", { includeHidden: true }),
    fetchCollection("services", { includeHidden: true }),
    fetchCollection("barbers", { includeHidden: true })
  ]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todays = bookings.filter(b => b.date === todayStr);
  const pending = bookings.filter(b => b.status === "pending");
  const completed = bookings.filter(b => b.status === "completed");

  setStat("stat-today", todays.length);
  setStat("stat-pending", pending.length);
  setStat("stat-completed", completed.length);
  setStat("stat-haircuts", haircuts.length);
  setStat("stat-services", services.length);
  setStat("stat-barbers", barbers.length);

  const tbody = qs("#recent-bookings-body");
  if (tbody) {
    const recent = [...bookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).slice(0, 8);
    tbody.innerHTML = recent.length
      ? recent.map(bookingRowHTML).join("")
      : `<tr><td colspan="7" class="muted text-center" style="padding:24px;">No bookings yet.</td></tr>`;
  }
  if (!isFirebaseReady()) {
    const notice = qs("#demo-mode-notice");
    if (notice) notice.hidden = false;
  }
}

function setStat(id, value) {
  const el = qs(`#${id}`);
  if (el) el.textContent = value;
}

function statusPillHTML(status) {
  const colors = { pending: "#F5B301", completed: "#4ade80", cancelled: "#ff5a5a", arrived: "#60a5fa" };
  const c = colors[status] || "#999";
  return `<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:${c}"><span style="width:6px;height:6px;border-radius:50%;background:${c}"></span>${status}</span>`;
}

function bookingRowHTML(b) {
  return `
  <tr data-id="${b.id}">
    <td>${b.customerName}<br><span class="muted" style="font-size:11px">${b.phone}</span></td>
    <td>${b.styleName || "—"}</td>
    <td>${b.barberName || "—"}</td>
    <td>${b.date}<br><span class="muted" style="font-size:11px">${to12h(b.time)}</span></td>
    <td>${b.source === "walkin" ? "Walk-in" : "Online"}</td>
    <td>${statusPillHTML(b.status || "pending")}</td>
    <td class="admin-row-actions">
      ${b.status !== "completed" ? `<button class="btn-sm btn-outline" data-action="complete" data-id="${b.id}">Mark Complete</button>` : ""}
      ${b.status !== "cancelled" ? `<button class="btn-danger" data-action="cancel" data-id="${b.id}">Cancel</button>` : ""}
    </td>
  </tr>`;
}

/* ------------------------------------------------------------------ GENERIC CRUD TABLE HELPERS */
export async function loadTable(collectionName, renderRow, tbodySelector, emptyMessage) {
  const tbody = qs(tbodySelector);
  const items = await fetchCollection(collectionName, { includeHidden: true });
  tbody.innerHTML = items.length ? items.map(renderRow).join("") : `<tr><td colspan="8" class="muted text-center" style="padding:24px;">${emptyMessage}</td></tr>`;
  return items;
}

export function confirmDialog(message) {
  return window.confirm(message);
}

export async function toggleHidden(collectionName, id, currentlyHidden, onDone) {
  const result = await updateItem(collectionName, id, { hidden: !currentlyHidden });
  if (result.ok) {
    toast(!currentlyHidden ? "Item hidden" : "Item shown", "success");
    onDone?.();
  } else {
    toast(result.error || "Could not update item.", "error");
  }
}

export async function softDelete(collectionName, id, onDone) {
  if (!confirmDialog("Move this item to Trash? You can restore it before it's permanently removed.")) return;
  const result = await deleteItem(collectionName, id);
  if (result.ok) {
    toast("Item moved to trash", "success");
    onDone?.();
  } else {
    toast(result.error || "Could not delete item.", "error");
  }
}

export { fetchCollection, addItem, updateItem, deleteItem, formatPrice, formatDuration, to12h, isFirebaseReady };
