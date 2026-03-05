// ─────────────────────────────────────────────────────────────────────────────
//  Firebase Configuration – Mymensingh Discount Hub
//
//  TO ACTIVATE REAL-TIME DATA:
//  1. Go to https://console.firebase.google.com
//  2. Create a project → Add a Web App → copy the firebaseConfig values
//  3. Create a Firestore Database (test mode is fine to start)
//  4. Paste your values into .env (see .env.example)
//  5. Run: node src/scripts/seedFirestore.js  (imports all existing store data)
//
//  The app works on mock data until Firebase is configured.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialise Firebase if the user has provided credentials
export const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;

if (isFirebaseConfigured) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
}

export { db };
