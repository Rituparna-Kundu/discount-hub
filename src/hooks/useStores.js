// ─────────────────────────────────────────────────────────────────────────────
//  useStores – Real-Time Store Data Hook
//
//  • When Firebase IS configured: listens to Firestore with onSnapshot,
//    so every admin update is pushed to all open browser tabs instantly.
//  • When Firebase is NOT configured: falls back to mockData so the site
//    still works locally without any setup.
//
//  Data transformations applied on every update:
//    1. Expired discounts (endDate < today) are filtered out automatically
//    2. discountPercent is recalculated as max of remaining active discounts
//    3. updatedAt is preserved for freshness badge logic
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { mockStores } from '../mockData';

// Haversine distance in km
export function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Removes discounts whose endDate has passed
function filterExpiredDiscounts(store) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeDiscounts = (store.activeDiscounts || []).filter((d) => {
        if (!d.endDate) return true;
        return new Date(d.endDate) >= today;
    });

    // Recalculate top discount percent from remaining active discounts
    const discountPercent =
        activeDiscounts.length > 0
            ? Math.max(...activeDiscounts.map((d) => d.discountPercent || store.discountPercent || 0))
            : store.discountPercent || 0;

    return { ...store, activeDiscounts, discountPercent };
}

export function useStores() {
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState('mock'); // 'firebase' | 'mock'

    useEffect(() => {
        if (!isFirebaseConfigured) {
            // ── Fallback: use mock data ──────────────────────────────────────
            const processed = mockStores.map(filterExpiredDiscounts);
            setStores(processed);
            setIsLoading(false);
            setDataSource('mock');
            return;
        }

        // ── Live: Firestore real-time listener ───────────────────────────────
        setDataSource('firebase');
        const q = query(collection(db, 'stores'), orderBy('name'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const processed = data.map(filterExpiredDiscounts);
                setStores(processed);
                setIsLoading(false);
            },
            (err) => {
                console.error('Firestore error:', err);
                setError(err.message);
                // Graceful fallback on read error
                const processed = mockStores.map(filterExpiredDiscounts);
                setStores(processed);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { stores, isLoading, error, dataSource };
}

// ── Freshness helpers ────────────────────────────────────────────────────────

/** Returns number of days since updatedAt (or createdAt). */
export function daysSinceUpdate(store) {
    const ts = store.updatedAt || store.createdAt;
    if (!ts) return null;
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Returns true if the store was updated within the last N days (default 3). */
export function isFresh(store, days = 3) {
    const d = daysSinceUpdate(store);
    return d !== null && d <= days;
}
