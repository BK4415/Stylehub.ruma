# Style Hub — Premium Men's Salon Booking Website

A production-ready, CMS-driven booking website for a men's salon, built with
plain HTML, CSS, and JavaScript (no frameworks, no build step) plus Firebase
(Firestore + Auth) for dynamic content and bookings. Includes a full customer
site and a basic Admin Panel.

This README documents **Phase 1** of the build exactly as delivered, and is
explicit about what is stubbed for **Phase 2 / Phase 3** so nothing here is
mistaken for a finished feature it isn't.

---

## 1. Quick Start

1. **Open the site.** Because this project uses native ES module imports
   (`<script type="module">`), you must serve it over `http://` — opening
   `index.html` directly via `file://` will block the module imports in most
   browsers. Any static server works, for example:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```
2. **(Optional) Connect Firebase** — see Section 2. Without it, the entire
   site runs on realistic demo data automatically. Nothing breaks.
3. **Visit `/admin/login.html`** to explore the Admin Panel.
   Demo credentials (only active when Firebase isn't connected):
   ```
   Email:    admin@stylehub.demo
   Password: StyleHub@123
   ```

---

## 2. Connecting Firebase

1. Create a Firebase project at https://console.firebase.google.com.
2. Enable **Firestore Database** and **Authentication → Email/Password**.
3. Copy `firebase-config.example.js` → rename the copy to `firebase-config.js`
   (same folder, project root) and paste in your real project keys.
4. Deploy the example security rules in `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Create your first admin user in **Authentication**, then add a matching
   document at `users/{that-user's-uid}` with `{ role: "admin" }` so the
   security rules recognise them (see `firestore.rules` comments).
6. Seed your Firestore collections (`haircuts`, `services`, `barbers`,
   `reviews`, `offers`, `settings/site`) — the shapes to match are documented
   in `js/demo-data.js`. Until you do, the site automatically displays that
   same demo data, so you can seed collections one at a time with zero
   downtime.

No code changes are required anywhere else — every page reads through
`js/firebase.js`, which transparently prefers Firestore data and falls back
to `js/demo-data.js` only when a read fails or returns nothing.

---

## 3. Folder Structure

```
/
├── index.html                Home
├── gallery.html               Haircuts gallery (filters, search, sort)
├── services.html               Services & pricing
├── booking.html                 Book Appointment
├── favorites.html                Saved haircuts (device-local for now)
├── contact.html                    Contact & location
├── about.html                       Story / mission / vision / barbers
├── faq.html                          Frequently asked questions
├── privacy-policy.html                 Legal pages (6 total, see below)
├── terms.html
├── disclaimer.html
├── cancellation-policy.html
├── refund-policy.html
├── cookie-policy.html
├── 404.html                              Custom not-found page
├── manifest.json                          PWA manifest
├── sw.js                                    Offline service worker
├── robots.txt
├── firestore.rules                            Example security rules
├── firebase-config.example.js                   Copy → firebase-config.js
│
├── css/
│   ├── style.css                Design system: tokens, layout, components
│   ├── responsive.css             Mobile / tablet / desktop breakpoints
│   └── animations.css               Keyframes + scroll-reveal utilities
│
├── js/
│   ├── firebase.js               Firebase init + Firestore/Auth helpers
│   ├── demo-data.js                Fallback content (matches Firestore shape)
│   ├── icons.js                      Centralised inline SVG icon library
│   ├── main.js                         Shared navbar/theme/toasts/CMS chrome
│   ├── render.js                         Shared card templates
│   ├── gallery.js                          Gallery filters/search/sort
│   ├── booking.js                            Booking form + live slots
│   ├── favorites.js                            Favorites page
│   └── admin.js                                  Admin panel logic
│
├── assets/
│   ├── logo.svg                  Placeholder logo — replace with your own
│   ├── images/                     Procedurally generated placeholder photos
│   └── icons/                        App icons / favicon (generated)
│
├── admin/                          Admin Panel (separate mini-app)
│   ├── login.html
│   ├── index.html                    Dashboard
│   ├── haircuts.html                   Haircuts CRUD
│   ├── services.html                     Services CRUD
│   ├── bookings.html                       Bookings (online + walk-in)
│   ├── customers.html                        Derived customer list
│   ├── reviews.html                            Review moderation
│   ├── settings.html                             Site-wide CMS settings
│   ├── analytics.html                              Phase 3 placeholder
│   └── css/admin.css
│
└── tools/                          Dev-only utility scripts (not shipped to users)
    ├── gen_assets.py                Regenerates placeholder images/icons
    └── gen_legal_pages.py             Regenerates the 6 legal pages
```

---

## 4. What's in Phase 1 (this delivery)

Matches the "Phase 1" scope from the project brief exactly:

- **Gallery** — full filter/search/sort, 16 seeded styles across all listed
  categories, favorite-saving, hairstyle disclaimer.
- **Booking** — real form validation, live time-slot generation from
  configurable opening hours minus already-booked slots, disclaimer
  acceptance with timestamp, success screen with a confirmation reference.
- **Contact** — phone/WhatsApp/email actions, Google Maps embed, opening
  hours, social links — all CMS-editable.
- **Basic Admin** — secure-enough login, dashboard stats, full CRUD for
  Haircuts & Services (add/edit/soft-delete/hide-show), unified Bookings
  management (online + walk-in, mark complete/paid/cancel), a derived
  Customers view, Reviews moderation, and a Settings page that edits the
  single site-wide CMS document live.
- Dark/light theme (both fully designed, not a washed-out afterthought),
  PWA manifest + offline service worker, SEO meta/OG/Twitter tags, skeleton
  loaders, toasts, empty/error states, scroll-reveal animation, accessible
  focus states and reduced-motion support throughout.

## 5. What's intentionally stubbed for Phase 2 / Phase 3

Being upfront about this matters more than pretending it's all here:

**Phase 2** (not in this delivery):
- Firebase Authentication (sign up / login / forgot password / required
  email verification before first booking) and a full customer dashboard.
- Favorites and Reviews moving from device-local storage to a real
  per-user Firestore collection.
- Full Role-Based Access Control (Super Admin / Admin / Staff / Customer)
  enforced by both the UI and Firestore rules — today's admin login is a
  single flat "admin" concept, and `firestore.rules` is written so this
  upgrade slots in without rewriting existing rules.
- Notifications, Offers UI, drag-and-drop reordering, bulk admin actions,
  undo-delete toasts, and real image upload to Firebase Storage (today,
  images are referenced by path/URL text field in the admin forms).

**Phase 3** (not in this delivery):
- AI hairstyle recommendation, membership tiers, real analytics dashboard,
  loyalty rewards, online payments, virtual try-on. `admin/analytics.html`
  is a clearly-labelled placeholder screen, not fake data.

If you'd like, these can be built next in the same architecture.

---

## 6. Customization

- **Logo:** replace `assets/logo.svg` with your real logo (any square-ish
  SVG works; it's used at both ~34px in the navbar and ~36–40px in footers
  and the admin sidebar).
- **Colors:** edit the CSS custom properties at the top of `css/style.css`
  (`:root` and `:root[data-theme="light"]`). The Admin → Settings page also
  lets you change the accent color live without editing code.
- **Placeholder photos:** everything in `assets/images/` was generated by
  `tools/gen_assets.py` (requires `pip install pillow`) — replace the files
  directly, or re-run the script after editing it to change the look of the
  placeholders.
- **Demo data:** edit `js/demo-data.js` if you want different fallback
  content while you're still setting up Firestore.

---

## 7. Accessibility & Performance Notes

- Every interactive control is reachable by keyboard with a visible focus
  ring; `prefers-reduced-motion` disables all animation.
- All icons are inline SVG (no icon fonts, no external requests).
- No external CSS/JS/font CDNs are required to render the site — the only
  network calls are to Firebase itself (Firestore/Auth), and those degrade
  gracefully to demo data when unavailable or offline.
- Images use `loading="lazy"` and explicit width/height to avoid layout
  shift.

---

## 8. A note on the Firebase SDK

This project intentionally uses Firebase's official CDN-hosted ES modules
(`https://www.gstatic.com/firebasejs/...`) loaded via dynamic `import()`
inside `js/firebase.js`, rather than an npm bundler. That keeps the rest of
the project genuinely dependency-free and buildless, while still using
Firebase's real, current SDK rather than a hand-rolled REST wrapper.
