/**
 * STYLE HUB — FAVORITES PAGE LOGIC
 * ------------------------------------------------------------------
 * Reads saved favorite IDs (device-local for now via main.js's
 * localStorage layer; will move to a per-user Firestore favorites
 * collection once Authentication ships in Phase 2 — same data
 * shape, so the migration is a drop-in swap of the read/write layer).
 * ------------------------------------------------------------------
 */
import { initLayout, fetchCollection, getFavoriteIds, qs } from "./main.js";
import { styleCardHTML, skeletonCards, emptyState, errorState } from "./render.js";

const grid = qs("#favorites-grid");

async function render() {
  const ids = getFavoriteIds();
  if (!ids.length) {
    grid.innerHTML = emptyState(
      "No favorites yet",
      "Tap the heart icon on any haircut in the Gallery to save it here for quick booking later.",
      "heart"
    );
    return;
  }
  try {
    const all = await fetchCollection("haircuts");
    const favs = all.filter(h => ids.includes(h.id));
    grid.innerHTML = favs.length
      ? favs.map(styleCardHTML).join("")
      : emptyState("Your saved styles moved", "The styles you favorited aren't available anymore. Browse the gallery to find new ones.", "heart");
  } catch {
    grid.innerHTML = errorState();
  }
}

async function boot() {
  grid.innerHTML = skeletonCards(4);
  await initLayout();
  await render();
  // Live-update the grid if a favorite is toggled from this same page.
  document.addEventListener("stylehub:favorites-changed", render);
}

boot();
