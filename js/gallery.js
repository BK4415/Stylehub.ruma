/**
 * STYLE HUB — GALLERY PAGE LOGIC
 * ------------------------------------------------------------------
 * Loads all haircuts once, then filters/sorts/searches entirely on
 * the client for an instant feel. Category chips, search box, price
 * and time selects, and sort — all combine (AND logic).
 * ------------------------------------------------------------------
 */
import { initLayout, fetchCollection, qs, qsa, debounce } from "./main.js";
import { styleCardHTML, skeletonCards, emptyState, errorState } from "./render.js";
import { DEMO_CATEGORIES } from "./demo-data.js";

const grid = qs("#gallery-grid");
const chipsEl = qs("#category-chips");
const searchInput = qs("#search-input");
const sortSelect = qs("#sort-select");
const priceSelect = qs("#price-select");
const timeSelect = qs("#time-select");
const resultsCount = qs("#results-count");

let allStyles = [];
let activeCategory = "All";

function parseRange(value) {
  if (!value) return null;
  const [min, max] = value.split("-").map(Number);
  return { min, max };
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const priceRange = parseRange(priceSelect.value);
  const timeRange = parseRange(timeSelect.value);

  let list = allStyles.filter(item => {
    if (activeCategory !== "All" && item.category !== activeCategory) return false;
    if (term && !item.name.toLowerCase().includes(term) && !item.category.toLowerCase().includes(term)) return false;
    if (priceRange && (item.price < priceRange.min || item.price > priceRange.max)) return false;
    if (timeRange && (item.durationMin < timeRange.min || item.durationMin > timeRange.max)) return false;
    return true;
  });

  switch (sortSelect.value) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "time-asc": list.sort((a, b) => a.durationMin - b.durationMin); break;
    case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  render(list);
}

function render(list) {
  resultsCount.textContent = `${list.length} style${list.length === 1 ? "" : "s"} found`;
  grid.innerHTML = list.length
    ? list.map(styleCardHTML).join("")
    : emptyState("No styles match your filters", "Try clearing a filter or searching a different keyword.", "search");
}

function renderChips(categories) {
  const cats = ["All", ...categories];
  chipsEl.innerHTML = cats.map(c => `<button class="chip ${c === activeCategory ? "is-active" : ""}" data-cat="${c}">${c}</button>`).join("");
  qsa(".chip", chipsEl).forEach(chip => {
    chip.addEventListener("click", () => {
      activeCategory = chip.getAttribute("data-cat");
      qsa(".chip", chipsEl).forEach(c => c.classList.toggle("is-active", c === chip));
      applyFilters();
    });
  });
}

async function boot() {
  grid.innerHTML = skeletonCards(8);
  await initLayout();
  try {
    allStyles = await fetchCollection("haircuts");
    const categories = [...new Set(allStyles.map(h => h.category))].length
      ? [...new Set(allStyles.map(h => h.category))]
      : DEMO_CATEGORIES;
    renderChips(categories);
    applyFilters();
  } catch (err) {
    grid.innerHTML = errorState();
  }
}

searchInput.addEventListener("input", debounce(applyFilters, 200));
sortSelect.addEventListener("change", applyFilters);
priceSelect.addEventListener("change", applyFilters);
timeSelect.addEventListener("change", applyFilters);

boot();
