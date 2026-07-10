/**
 * STYLE HUB — DEMO / FALLBACK DATA
 * ------------------------------------------------------------------
 * This file is ONLY used when Firebase cannot be reached (no
 * firebase-config.js present, offline, or a read fails). It mirrors
 * the exact shape of the Firestore documents so the rest of the app
 * never needs to know whether data came from Firestore or here.
 *
 * Real content is always meant to live in Firestore and be managed
 * through /admin. Nothing in this file should be hand-edited in
 * production — edit it in the Admin Panel instead.
 * ------------------------------------------------------------------
 */

export const DEMO_SETTINGS = {
  salonName: "Style Hub",
  tagline: "Premium Grooming, Redefined",
  announcement: "Grand Opening Offer — 20% off your first Skin Fade this week!",
  announcementEnabled: true,
  themeAccent: "#F5B301",
  heroImage: "assets/images/hero-banner.jpg",
  heroHeading: "Precision Cuts. Modern Craft.",
  heroSubheading: "Book your next haircut with Assam's most premium men's salon experience — sharp fades, clean beards, zero compromise.",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@stylehub.example",
  address: "1st Floor, MG Road, Teok, Jorhat, Assam, India",
  mapsEmbedUrl: "https://www.google.com/maps?q=Teok,Assam&output=embed",
  socials: {
    instagram: "#",
    facebook: "#",
    whatsapp: "#",
    youtube: "#"
  },
  openingHours: [
    { day: "Monday", open: "10:00", close: "20:00", closed: false },
    { day: "Tuesday", open: "10:00", close: "20:00", closed: false },
    { day: "Wednesday", open: "10:00", close: "20:00", closed: false },
    { day: "Thursday", open: "10:00", close: "20:00", closed: false },
    { day: "Friday", open: "10:00", close: "21:00", closed: false },
    { day: "Saturday", open: "09:00", close: "21:00", closed: false },
    { day: "Sunday", open: "10:00", close: "18:00", closed: false }
  ],
  holidays: [],
  slotDurationMinutes: 30,
  disclaimerText: "The hairstyle photos displayed on Style Hub are for inspiration and reference only. The final haircut may vary depending on your hair type, hair density, hair length, face shape, natural hair growth pattern, styling method, and consultation with the barber. While our barbers strive to achieve a similar look, an exact match cannot be guaranteed. The displayed images are intended to help customers communicate their preferred style and should not be considered a guarantee of identical results."
};

export const DEMO_CATEGORIES = [
  "Fade", "Low Fade", "Mid Fade", "High Fade", "Skin Fade", "Taper Fade",
  "Crew Cut", "Buzz Cut", "French Crop", "Pompadour", "Quiff", "Undercut",
  "Side Part", "Textured Crop", "Curly Hair", "Beard Styles"
];

export const DEMO_HAIRCUTS = [
  { id: "h1",  name: "Classic Skin Fade", category: "Skin Fade", price: 299, durationMin: 30, image: "assets/images/haircut-skin-fade.jpg", trending: true, popular: true, featured: true, hidden: false, order: 1 },
  { id: "h2",  name: "Low Bald Fade", category: "Low Fade", price: 249, durationMin: 25, image: "assets/images/haircut-low-fade.jpg", trending: true, popular: false, featured: true, hidden: false, order: 2 },
  { id: "h3",  name: "Mid Taper Fade", category: "Mid Fade", price: 279, durationMin: 30, image: "assets/images/haircut-mid-fade.jpg", trending: false, popular: true, featured: false, hidden: false, order: 3 },
  { id: "h4",  name: "High Fade Crop", category: "High Fade", price: 299, durationMin: 30, image: "assets/images/haircut-high-fade.jpg", trending: true, popular: false, featured: false, hidden: false, order: 4 },
  { id: "h5",  name: "Sharp Taper Fade", category: "Taper Fade", price: 269, durationMin: 25, image: "assets/images/haircut-taper-fade.jpg", trending: false, popular: false, featured: false, hidden: false, order: 5 },
  { id: "h6",  name: "Signature Crew Cut", category: "Crew Cut", price: 229, durationMin: 20, image: "assets/images/haircut-crew-cut.jpg", trending: false, popular: true, featured: false, hidden: false, order: 6 },
  { id: "h7",  name: "Clean Buzz Cut", category: "Buzz Cut", price: 199, durationMin: 15, image: "assets/images/haircut-buzz-cut.jpg", trending: false, popular: true, featured: false, hidden: false, order: 7 },
  { id: "h8",  name: "French Crop Fringe", category: "French Crop", price: 319, durationMin: 35, image: "assets/images/haircut-french-crop.jpg", trending: true, popular: false, featured: true, hidden: false, order: 8 },
  { id: "h9",  name: "Modern Pompadour", category: "Pompadour", price: 349, durationMin: 40, image: "assets/images/haircut-pompadour.jpg", trending: true, popular: false, featured: true, hidden: false, order: 9 },
  { id: "h10", name: "Textured Quiff", category: "Quiff", price: 329, durationMin: 35, image: "assets/images/haircut-quiff.jpg", trending: false, popular: false, featured: false, hidden: false, order: 10 },
  { id: "h11", name: "Disconnected Undercut", category: "Undercut", price: 289, durationMin: 30, image: "assets/images/haircut-undercut.jpg", trending: true, popular: false, featured: false, hidden: false, order: 11 },
  { id: "h12", name: "Business Side Part", category: "Side Part", price: 259, durationMin: 25, image: "assets/images/haircut-side-part.jpg", trending: false, popular: false, featured: false, hidden: false, order: 12 },
  { id: "h13", name: "Textured Crop Fringe", category: "Textured Crop", price: 309, durationMin: 30, image: "assets/images/haircut-textured-crop.jpg", trending: false, popular: true, featured: false, hidden: false, order: 13 },
  { id: "h14", name: "Curly Top Fade", category: "Curly Hair", price: 339, durationMin: 40, image: "assets/images/haircut-curly-hair.jpg", trending: false, popular: false, featured: false, hidden: false, order: 14 },
  { id: "h15", name: "Full Beard Sculpt", category: "Beard Styles", price: 179, durationMin: 20, image: "assets/images/haircut-beard-styles.jpg", trending: true, popular: true, featured: false, hidden: false, order: 15 },
  { id: "h16", name: "Weekend Classic Fade", category: "Fade", price: 279, durationMin: 30, image: "assets/images/haircut-classic-fade.jpg", trending: false, popular: false, featured: false, hidden: false, order: 16 }
];

export const DEMO_SERVICES = [
  { id: "s1", name: "Haircut", price: 249, durationMin: 30, description: "Precision scissor or clipper cut, tailored to your face shape and finished with a clean style.", icon: "scissors", hidden: false, order: 1 },
  { id: "s2", name: "Hair + Beard", price: 399, durationMin: 50, description: "Our signature combo — a full haircut paired with a sculpted beard trim and hot towel finish.", icon: "combo", hidden: false, order: 2 },
  { id: "s3", name: "Beard Trim", price: 149, durationMin: 20, description: "Shape, line-up, and detail your beard with precision trimmers and a straight-edge finish.", icon: "beard", hidden: false, order: 3 },
  { id: "s4", name: "Hair Wash", price: 99, durationMin: 15, description: "Deep-cleansing wash with premium shampoo and a relaxing scalp massage.", icon: "wash", hidden: false, order: 4 },
  { id: "s5", name: "Face Clean-Up", price: 199, durationMin: 25, description: "Deep cleansing facial with scrub, steam, and massage for fresh, refreshed skin.", icon: "face", hidden: false, order: 5 }
];

export const DEMO_BARBERS = [
  { id: "b1", name: "Barber One", role: "Master Barber", bio: "8+ years shaping fades and beards with precision and patience.", image: "assets/images/barber-1.jpg", hidden: false, order: 1 },
  { id: "b2", name: "Barber Two", role: "Style Specialist", bio: "Specialist in modern crops, textured styles, and classic side parts.", image: "assets/images/barber-2.jpg", hidden: false, order: 2 }
];

export const DEMO_REVIEWS = [
  { id: "r1", name: "Arindam K.", rating: 5, comment: "Best skin fade I've had in Jorhat, hands down. Clean, sharp, and the vibe is premium.", createdAt: "2026-06-14", hidden: false },
  { id: "r2", name: "Manash D.", rating: 5, comment: "The hair + beard combo is worth every rupee. Booking online was effortless too.", createdAt: "2026-06-20", hidden: false },
  { id: "r3", name: "Priyom S.", rating: 4, comment: "Great attention to detail. Slight wait on a Saturday evening but worth it.", createdAt: "2026-07-01", hidden: false }
];

export const DEMO_OFFERS = [
  { id: "o1", title: "First Visit — 20% Off", description: "New customers get 20% off any haircut on their first booking.", code: "FIRST20", active: true }
];

/** Simple in-memory favorites store used only in guest / offline demo mode. */
export const DEMO_FAVORITES_KEY = "stylehub_demo_favorites";
