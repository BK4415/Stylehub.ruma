/**
 * STYLE HUB — SHARED RENDER TEMPLATES
 * ------------------------------------------------------------------
 * Keeps card markup identical everywhere a haircut / service /
 * review / barber is shown, so one visual/behavioural change here
 * updates the whole site.
 * ------------------------------------------------------------------
 */
import { icon } from "./icons.js";
import { formatPrice, formatDuration, renderStars, isFavorite } from "./main.js";

export function styleCardHTML(item) {
  const fav = isFavorite(item.id);
  return `
  <article class="card style-card animate-scaleIn" data-id="${item.id}" data-category="${item.category}" data-price="${item.price}" data-time="${item.durationMin}">
    <div class="style-media">
      <img src="${item.image}" alt="${item.name} — ${item.category} hairstyle reference" loading="lazy" width="800" height="1000">
      <span class="cat-pill">${item.category}</span>
      <button class="fav-btn ${fav ? "is-active" : ""}" data-fav-toggle="${item.id}" aria-pressed="${fav}" aria-label="${fav ? "Remove from favorites" : "Add to favorites"}">
        ${icon("heart")}
      </button>
    </div>
    <div class="style-body">
      <h4>${item.name}</h4>
      <div class="style-meta">
        <span>${icon("clock")} ${formatDuration(item.durationMin)}</span>
      </div>
      <div class="style-footer">
        <span class="style-price">${formatPrice(item.price)}</span>
        <a class="btn btn-primary btn-sm" href="booking.html?style=${encodeURIComponent(item.id)}">Book This Style</a>
      </div>
    </div>
  </article>`;
}

export function serviceCardHTML(s) {
  return `
  <article class="card service-card animate-scaleIn">
    <div class="service-icon">${icon(s.icon || "scissors")}</div>
    <h3>${s.name}</h3>
    <p class="text-secondary">${s.description}</p>
    <div class="service-price-row">
      <span class="muted" style="display:flex;align-items:center;gap:6px;font-size:var(--fs-xs)">${icon("clock", "icon")} ${formatDuration(s.durationMin)}</span>
      <span class="style-price">${formatPrice(s.price)}</span>
    </div>
    <a class="btn btn-outline btn-block" href="booking.html?service=${encodeURIComponent(s.id)}">Book This Service</a>
  </article>`;
}

export function reviewCardHTML(r) {
  const initials = r.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return `
  <article class="card review-card animate-scaleIn">
    <div class="review-stars">${renderStars(r.rating)}</div>
    <p>&ldquo;${r.comment}&rdquo;</p>
    <div class="review-author">
      <div class="review-avatar">${initials}</div>
      <div>
        <strong style="display:block;font-size:var(--fs-sm)">${r.name}</strong>
        <span class="muted" style="font-size:var(--fs-xs)">${new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  </article>`;
}

export function barberCardHTML(b) {
  return `
  <article class="card animate-scaleIn" style="overflow:hidden;text-align:center;padding-bottom: var(--sp-5)">
    <div style="aspect-ratio:4/5;overflow:hidden;">
      <img src="${b.image}" alt="${b.name}, ${b.role} at Style Hub" loading="lazy" style="width:100%;height:100%;object-fit:cover">
    </div>
    <div style="padding: var(--sp-5) var(--sp-4) 0;">
      <h4>${b.name}</h4>
      <p class="muted" style="font-size:var(--fs-xs);text-transform:uppercase;letter-spacing:0.06em;margin:4px 0 10px;color:var(--accent)">${b.role}</p>
      <p class="text-secondary" style="font-size:var(--fs-sm)">${b.bio}</p>
    </div>
  </article>`;
}

export function skeletonCards(n = 4) {
  return Array.from({ length: n }).map(() => `<div class="skeleton skeleton-card"></div>`).join("");
}

export function emptyState(title, msg, iconName = "info") {
  return `
  <div class="state-block">
    <div class="state-icon">${icon(iconName)}</div>
    <h3>${title}</h3>
    <p>${msg}</p>
  </div>`;
}

export function errorState(msg = "Something went wrong while loading this content. Please try again.") {
  return emptyState("Couldn't load content", msg, "x");
}
