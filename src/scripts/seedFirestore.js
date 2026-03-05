#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  seedFirestore.js — One-time script to upload all store data to Firestore
//
//  Run ONCE after setting up Firebase:
//    node src/scripts/seedFirestore.js
//
//  Requirements:
//    • VITE_FIREBASE_* vars filled in .env
//    • npm install firebase dotenv (already installed)
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key) env[key.trim()] = rest.join('=').trim();
}

const {
    VITE_FIREBASE_API_KEY: apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: authDomain,
    VITE_FIREBASE_PROJECT_ID: projectId,
    VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
    VITE_FIREBASE_APP_ID: appId,
} = env;

if (!apiKey || !projectId) {
    console.error('\n❌  Firebase credentials not found in .env\n');
    console.error('Please fill in VITE_FIREBASE_* values in .env first.\n');
    process.exit(1);
}

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId });
const db = getFirestore(app);

// Import mock store data (inline to avoid ESM issues)
const require = createRequire(import.meta.url);

// Read and evaluate mockData
const mockDataPath = path.resolve(__dirname, '../mockData.js');
const mockDataContent = readFileSync(mockDataPath, 'utf-8');

// Simple extraction: run the file as a module
const { mockStores } = await import('../mockData.js');

console.log(`\n🚀 Seeding ${mockStores.length} stores to Firestore project: ${projectId}\n`);

let success = 0, failed = 0;

for (const store of mockStores) {
    try {
        const storeRef = doc(collection(db, 'stores'), String(store.id));
        await setDoc(storeRef, {
            ...store,
            updatedAt: serverTimestamp(),
            createdAt: store.createdAt || serverTimestamp(),
        });
        console.log(`  ✅ ${store.name}`);
        success++;
    } catch (e) {
        console.error(`  ❌ ${store.name}: ${e.message}`);
        failed++;
    }
}

console.log(`\n✅ Done! ${success} uploaded, ${failed} failed.`);
console.log(`\n🌐 View your data: https://console.firebase.google.com/project/${projectId}/firestore\n`);
process.exit(0);
