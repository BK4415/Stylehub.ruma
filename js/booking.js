/**
 * STYLE HUB — BOOKING PAGE LOGIC
 * ------------------------------------------------------------------
 * Loads haircuts + barbers to populate selects, computes real
 * available time slots from the salon's opening hours minus already
 * booked slots for the chosen barber/date, validates the form, and
 * writes the booking to Firestore (or demo mode) before showing a
 * success screen with a confirmation reference.
 * ------------------------------------------------------------------
 */
import { initLayout, fetchCollection, getSettings, addItem, qs, toast, formatPrice, formatDuration, to12h } from "./main.js";
import { icon } from "./icons.js";

const form = qs("#booking-form");
const styleSelect = qs("#cust-style");
const barberSelect = qs("#cust-barber");
const dateInput = qs("#cust-date");
const slotGrid = qs("#slot-grid");
const submitBtn = qs("#submit-btn");
const submitLabel = qs("#submit-label");

let haircuts = [];
let barbers = [];
let settings = null;
let existingBookings = [];
let selectedTime = null;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function todayISO() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function populateSelect(select, items, labelFn, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>` + items.map(i => `<option value="${i.id}">${labelFn(i)}</option>`).join("");
}

function selectedStyle() { return haircuts.find(h => h.id === styleSelect.value); }
function selectedBarber() { return barbers.find(b => b.id === barberSelect.value); }

function updateSummary() {
  const style = selectedStyle();
  const barber = selectedBarber();
  qs("#sum-style").textContent = style ? style.name : "—";
  qs("#sum-barber").textContent = barber ? barber.name : "—";
  qs("#sum-date").textContent = dateInput.value ? new Date(dateInput.value + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "—";
  qs("#sum-time").textContent = selectedTime ? to12h(selectedTime) : "—";
  qs("#sum-duration").textContent = style ? formatDuration(style.durationMin) : "—";
  qs("#sum-price").textContent = style ? formatPrice(style.price) : "₹0";
}

function generateSlotsForDate(dateStr) {
  if (!dateStr || !settings) return [];
  const date = new Date(dateStr + "T00:00");
  const dayName = DAY_NAMES[date.getDay()];
  const hours = settings.openingHours.find(h => h.day === dayName);
  if (!hours || hours.closed) return [];

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const step = settings.slotDurationMinutes || 30;

  const slots = [];
  let cursor = new Date(date); cursor.setHours(openH, openM, 0, 0);
  const end = new Date(date); end.setHours(closeH, closeM, 0, 0);

  const now = new Date();
  const isToday = dateStr === todayISO();

  const barberId = barberSelect.value;
  const bookedTimes = new Set(
    existingBookings
      .filter(b => b.date === dateStr && b.barberId === barberId && b.status !== "cancelled")
      .map(b => b.time)
  );

  while (cursor < end) {
    const hh = String(cursor.getHours()).padStart(2, "0");
    const mm = String(cursor.getMinutes()).padStart(2, "0");
    const timeStr = `${hh}:${mm}`;
    const isPast = isToday && cursor <= now;
    slots.push({ time: timeStr, disabled: isPast || bookedTimes.has(timeStr) });
    cursor = new Date(cursor.getTime() + step * 60000);
  }
  return slots;
}

function renderSlots() {
  if (!barberSelect.value) {
    slotGrid.innerHTML = `<p class="muted" style="font-size:var(--fs-xs)">Choose a barber first.</p>`;
    return;
  }
  const slots = generateSlotsForDate(dateInput.value);
  selectedTime = null;
  updateSummary();

  if (!slots.length) {
    slotGrid.innerHTML = `<p class="muted" style="font-size:var(--fs-xs)">We're closed on this date. Please pick another.</p>`;
    return;
  }
  slotGrid.innerHTML = slots.map(s => `
    <button type="button" class="slot-btn ${s.disabled ? "is-disabled" : ""}" data-time="${s.time}" ${s.disabled ? "disabled" : ""}>
      ${to12h(s.time)}
    </button>`).join("");

  slotGrid.querySelectorAll(".slot-btn:not(.is-disabled)").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedTime = btn.getAttribute("data-time");
      slotGrid.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      updateSummary();
      clearError("time");
    });
  });
}

function setError(field, message) {
  const el = qs(`#err-${field}`);
  const input = qs(`#cust-${field}`);
  if (el) el.textContent = message || "";
  if (input) input.closest(".field")?.classList.toggle("has-error", Boolean(message));
}
function clearError(field) { setError(field, ""); }

function validatePhone(value) {
  const digits = value.replace(/\D/g, "").replace(/^91/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

function validate() {
  let valid = true;
  const name = qs("#cust-name").value.trim();
  const phone = qs("#cust-phone").value.trim();

  if (name.length < 2) { setError("name", "Please enter your full name."); valid = false; } else clearError("name");
  if (!validatePhone(phone)) { setError("phone", "Enter a valid 10-digit mobile number."); valid = false; } else clearError("phone");
  if (!styleSelect.value) { setError("style", "Please choose a haircut style."); valid = false; } else clearError("style");
  if (!barberSelect.value) { setError("barber", "Please choose a barber."); valid = false; } else clearError("barber");
  if (!dateInput.value) { setError("date", "Please pick a date."); valid = false; } else clearError("date");
  if (!selectedTime) { setError("time", "Please select an available time slot."); valid = false; } else clearError("time");
  if (!qs("#cust-disclaimer").checked) { setError("disclaimer", "You must accept the disclaimer to continue."); valid = false; } else clearError("disclaimer");

  return valid;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) {
    form.querySelector(".has-error input, .has-error select")?.focus();
    toast("Please fix the highlighted fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitLabel.innerHTML = `<span class="spinner"></span>`;

  const style = selectedStyle();
  const barber = selectedBarber();
  const payload = {
    customerName: qs("#cust-name").value.trim(),
    phone: qs("#cust-phone").value.trim(),
    styleId: style.id,
    styleName: style.name,
    price: style.price,
    durationMin: style.durationMin,
    barberId: barber.id,
    barberName: barber.name,
    date: dateInput.value,
    time: selectedTime,
    notes: qs("#cust-notes").value.trim(),
    source: "online",
    status: "pending",
    paid: false,
    disclaimerAcceptedAt: new Date().toISOString()
  };

  const result = await addItem("bookings", payload);
  submitBtn.disabled = false;
  submitLabel.textContent = "Confirm Booking";

  if (result.ok) {
    showSuccess(result.id, result.demo);
  } else {
    toast(result.error || "Could not confirm booking. Please try again.", "error");
  }
}

function showSuccess(id, demo) {
  qs("#booking-view").classList.add("hide");
  const successView = qs("#success-view");
  successView.classList.remove("hide");
  qs("#success-icon").innerHTML = icon("check");
  const ref = (id || "").toString().slice(-8).toUpperCase() || Math.random().toString(36).slice(-8).toUpperCase();
  qs("#success-ref").textContent = `#SH-${ref}`;
  if (demo) toast("Demo mode: booking simulated locally (Firebase not connected).", "info", 5000);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  form.reset();
  selectedTime = null;
  slotGrid.innerHTML = `<p class="muted" style="font-size:var(--fs-xs)">Pick a date to see available slots.</p>`;
  ["name", "phone", "style", "barber", "date", "time", "disclaimer"].forEach(clearError);
  updateSummary();
  qs("#success-view").classList.add("hide");
  qs("#booking-view").classList.remove("hide");
}

async function boot() {
  await initLayout();
  dateInput.min = todayISO();

  const params = new URLSearchParams(window.location.search);
  const preselectStyle = params.get("style");
  const preselectService = params.get("service");

  [haircuts, barbers, settings, existingBookings] = await Promise.all([
    fetchCollection("haircuts"),
    fetchCollection("barbers"),
    getSettings(),
    fetchCollection("bookings", { includeHidden: true }).catch(() => [])
  ]);

  populateSelect(styleSelect, haircuts, h => `${h.name} — ${formatPrice(h.price)}`, "Choose a haircut style");
  populateSelect(barberSelect, barbers, b => `${b.name} (${b.role})`, "Choose a barber");

  if (preselectStyle && haircuts.some(h => h.id === preselectStyle)) styleSelect.value = preselectStyle;
  if (preselectService) {
    // If arriving from a Service card, no direct haircut maps 1:1 — default to first style and let them adjust.
    styleSelect.selectedIndex = styleSelect.selectedIndex || 1;
  }

  updateSummary();

  styleSelect.addEventListener("change", () => { updateSummary(); clearError("style"); });
  barberSelect.addEventListener("change", () => { renderSlots(); clearError("barber"); });
  dateInput.addEventListener("change", () => { renderSlots(); clearError("date"); });

  form.addEventListener("submit", handleSubmit);
  qs("#book-another-btn").addEventListener("click", resetForm);
}

boot();
