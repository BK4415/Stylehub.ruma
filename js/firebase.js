/**
 * STYLE HUB — FIREBASE INTEGRATION LAYER
 * ------------------------------------------------------------------
 * Every page imports data through THIS file — never Firestore
 * directly. That keeps a single source of truth for:
 *   - Firebase initialisation (or graceful offline fallback)
 *   - Firestore read/write helpers
 *   - Firebase Auth helpers (used today by the Admin Panel)
 *
 * If /firebase-config.js does not exist yet (you haven't copied
 * firebase-config.example.js), or the Firebase SDK fails to reach
 * the network, `isFirebaseReady()` returns false and every data
 * helper below transparently returns the demo/fallback data instead.
 * The rest of the codebase never has to branch on this itself.
 * ------------------------------------------------------------------
 */

import {
  DEMO_SETTINGS, DEMO_HAIRCUTS, DEMO_SERVICES, DEMO_BARBERS,
  DEMO_REVIEWS, DEMO_OFFERS
} from "./demo-data.js";

const SDK_VERSION = "10.12.2";
const SDK_BASE = `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;

let app = null;
let db = null;
let auth = null;
let storage = null;
let firestoreApi = null;
let authApi = null;
let ready = false;
let initPromise = null;

/**
 * Attempts to boot Firebase. Safe to call multiple times — only
 * runs once. Resolves to `true`/`false` (never rejects) so callers
 * never need a try/catch of their own.
 */
export function initFirebase() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1. Load the user's real config. This import intentionally
      //    points at a file that does NOT ship with the repo
      //    (firebase-config.js) — only firebase-config.example.js
      //    does. Until the person copies/renames it, this import
      //    throws and we fall back to demo mode below.
      const { firebaseConfig } = await import("../firebase-config.js");

      if (!firebaseConfig || firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.info("[StyleHub] Firebase config not set — running in demo data mode.");
        return false;
      }

      const [{ initializeApp }, firestoreMod, authMod, storageMod] = await Promise.all([
        import(`${SDK_BASE}/firebase-app.js`),
        import(`${SDK_BASE}/firebase-firestore.js`),
        import(`${SDK_BASE}/firebase-auth.js`),
        import(`${SDK_BASE}/firebase-storage.js`)
      ]);

      app = initializeApp(firebaseConfig);
      firestoreApi = firestoreMod;
      authApi = authMod;
      db = firestoreMod.getFirestore(app);
      auth = authMod.getAuth(app);
      storage = storageMod.getStorage(app);
      ready = true;
      return true;
    } catch (err) {
      console.info("[StyleHub] Firebase unavailable, using demo data mode.", err?.message || err);
      ready = false;
      return false;
    }
  })();

  return initPromise;
}

export function isFirebaseReady() {
  return ready;
}

/* --------------------------------------------------------------------
   Generic Firestore helpers — every one degrades to demo data.
   -------------------------------------------------------------------- */

const FALLBACK = {
  settings: DEMO_SETTINGS,
  haircuts: DEMO_HAIRCUTS,
  services: DEMO_SERVICES,
  barbers: DEMO_BARBERS,
  reviews: DEMO_REVIEWS,
  offers: DEMO_OFFERS
};

/**
 * Fetches all (non-hidden by default) docs from a collection.
 * @param {string} name - collection name
 * @param {object} opts - { includeHidden?: boolean }
 */
export async function fetchCollection(name, opts = {}) {
  await initFirebase();
  if (ready && db) {
    try {
      const { collection, getDocs, query, orderBy } = firestoreApi;
      let q;
      try {
        q = query(collection(db, name), orderBy("order", "asc"));
      } catch {
        q = collection(db, name);
      }
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (docs.length) {
        return opts.includeHidden ? docs : docs.filter(d => !d.hidden);
      }
      // empty collection → fall through to demo data so the UI never looks broken
    } catch (err) {
      console.warn(`[StyleHub] Firestore read failed for "${name}", using demo data.`, err.message);
    }
  }
  const demo = Array.isArray(FALLBACK[name]) ? FALLBACK[name] : [];
  return opts.includeHidden ? demo : demo.filter(d => !d.hidden);
}

/** Fetches the single "settings" document (site-wide CMS content). */
export async function fetchSettings() {
  await initFirebase();
  if (ready && db) {
    try {
      const { doc, getDoc } = firestoreApi;
      const snap = await getDoc(doc(db, "settings", "site"));
      if (snap.exists()) return { ...DEMO_SETTINGS, ...snap.data() };
    } catch (err) {
      console.warn("[StyleHub] Settings read failed, using demo settings.", err.message);
    }
  }
  return DEMO_SETTINGS;
}

/** Live listener wrapper — falls back to a single callback with demo data. */
export function listenCollection(name, callback, opts = {}) {
  initFirebase().then((isReady) => {
    if (isReady && db) {
      try {
        const { collection, onSnapshot, query, orderBy } = firestoreApi;
        let q;
        try {
          q = query(collection(db, name), orderBy("order", "asc"));
        } catch {
          q = collection(db, name);
        }
        onSnapshot(q, (snap) => {
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          callback(opts.includeHidden ? docs : docs.filter(d => !d.hidden));
        }, (err) => {
          console.warn(`[StyleHub] Listener failed for "${name}", using demo data.`, err.message);
          const demo = FALLBACK[name] || [];
          callback(opts.includeHidden ? demo : demo.filter(d => !d.hidden));
        });
        return;
      } catch (err) {
        console.warn(`[StyleHub] Listener setup failed for "${name}".`, err.message);
      }
    }
    const demo = FALLBACK[name] || [];
    callback(opts.includeHidden ? demo : demo.filter(d => !d.hidden));
  });
}

/** Adds a document. Returns { ok, id, demo }. */
export async function addItem(name, data) {
  await initFirebase();
  if (ready && db) {
    try {
      const { collection, addDoc, serverTimestamp } = firestoreApi;
      const ref = await addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
      return { ok: true, id: ref.id, demo: false };
    } catch (err) {
      return { ok: false, error: err.message, demo: false };
    }
  }
  return { ok: true, id: `demo-${Date.now()}`, demo: true };
}

export async function updateItem(name, id, data) {
  await initFirebase();
  if (ready && db) {
    try {
      const { doc, updateDoc } = firestoreApi;
      await updateDoc(doc(db, name, id), data);
      return { ok: true, demo: false };
    } catch (err) {
      return { ok: false, error: err.message, demo: false };
    }
  }
  return { ok: true, demo: true };
}

/** Soft delete by default (sets hidden + deletedAt) so admin can "undo". */
export async function deleteItem(name, id, { hard = false } = {}) {
  await initFirebase();
  if (ready && db) {
    try {
      const { doc, updateDoc, deleteDoc, serverTimestamp } = firestoreApi;
      if (hard) {
        await deleteDoc(doc(db, name, id));
      } else {
        await updateDoc(doc(db, name, id), { hidden: true, deletedAt: serverTimestamp() });
      }
      return { ok: true, demo: false };
    } catch (err) {
      return { ok: false, error: err.message, demo: false };
    }
  }
  return { ok: true, demo: true };
}

/* --------------------------------------------------------------------
   Auth helpers (used today by /admin login; customer auth is Phase 2)
   -------------------------------------------------------------------- */

export async function adminSignIn(email, password) {
  await initFirebase();
  if (ready && auth) {
    try {
      const { signInWithEmailAndPassword } = authApi;
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return { ok: true, user: cred.user, demo: false };
    } catch (err) {
      return { ok: false, error: err.message, demo: false };
    }
  }
  // Demo-mode fallback so the admin panel is explorable without a
  // Firebase project. Clearly not for production use.
  if (email === "admin@stylehub.demo" && password === "StyleHub@123") {
    return { ok: true, user: { uid: "demo-admin", email }, demo: true };
  }
  return { ok: false, error: "Invalid credentials (demo mode: admin@stylehub.demo / StyleHub@123)", demo: true };
}

export async function adminSignOut() {
  await initFirebase();
  if (ready && auth) {
    try {
      const { signOut } = authApi;
      await signOut(auth);
    } catch { /* no-op */ }
  }
}

export function onAdminAuthChange(callback) {
  initFirebase().then((isReady) => {
    if (isReady && auth) {
      const { onAuthStateChanged } = authApi;
      onAuthStateChanged(auth, callback);
    } else {
      // Demo mode relies on sessionStorage set by adminSignIn's caller (admin.js)
      callback(null);
    }
  });
}

export async function updateSettings(data) {
  await initFirebase();
  if (ready && db) {
    try {
      const { doc, setDoc } = firestoreApi;
      await setDoc(doc(db, "settings", "site"), data, { merge: true });
      return { ok: true, demo: false };
    } catch (err) {
      return { ok: false, error: err.message, demo: false };
    }
  }
  return { ok: true, demo: true };
}

export { db, auth, storage };
