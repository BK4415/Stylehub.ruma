/**
 * STYLE HUB — FIREBASE CONFIGURATION (EXAMPLE)
 * ------------------------------------------------------------------
 * 1. Copy this file and rename the copy to:  firebase-config.js
 * 2. Paste your real Firebase project keys below.
 * 3. Never commit your real firebase-config.js to a public repository.
 *
 * All Firebase imports across the project (js/firebase.js, admin/js/*)
 * read from "../firebase-config.js" (or "./firebase-config.js").
 * If that file does not exist, the app automatically runs in
 * OFFLINE / DEMO DATA mode using js/demo-data.js — nothing breaks.
 * ------------------------------------------------------------------
 */

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};

/**
 * Firestore collection names — centralised so the whole app
 * stays consistent if you ever rename a collection.
 */
export const COLLECTIONS = {
  users: "users",
  haircuts: "haircuts",
  services: "services",
  bookings: "bookings",
  favorites: "favorites",
  reviews: "reviews",
  barbers: "barbers",
  settings: "settings",
  offers: "offers"
};
