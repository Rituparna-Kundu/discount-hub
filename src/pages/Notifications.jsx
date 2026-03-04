import React, { useMemo } from 'react';
import { mockStores } from '../mockData';
import { Bell, Clock, Store, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    // Generate mock notifications based on active discounts that are "ending soon"
    // Since mock data dates are static (e.g., 2026-03-x), we'll just extract all active discounts
    // and sort them by endDate to simulate a "ending soon" feed.
    const notifications = useMemo(() => {
        let allDiscounts = [];

        mockStores.forEach(store => {
            if (store.activeDiscounts && store.activeDiscounts.length > 0) {
                store.activeDiscounts.forEach(discount => {
                    allDiscounts.push({
                        ...discount,
                        storeId: store.id,
                        storeName: store.name,
                        storeImage: store.imageUrl || store.image
                    });
                });
            }
        });

        // Sort by end date (earliest ending first)
        return allDiscounts.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }, []);

    // Format date string
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell size={28} className="text-primary" /> Deal Notifications
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Stay instantly updated when your favorite deals are ending soon.
                </p>
            </div>

            {notifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map((notif, index) => (
                        <div key={notif.id} className="card" style={{
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1.25rem',
                            alignItems: 'center',
                            borderLeft: index < 3 ? '4px solid var(--primary-color)' : '1px solid var(--border-color)', // Highlight top 3 ending soon
                            transition: 'transform var(--transition-fast)'
                        }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-light)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Tag size={28} style={{ color: 'var(--primary-color)' }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{notif.description}</h3>
                                    {index < 3 && <span className="badge badge-discount animate-pulse-glow" style={{ fontSize: '0.7rem' }}>Expiring Soon!</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Store size={14} /> {notif.storeName}</span>
                                    •
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: index < 3 ? '#E53935' : 'inherit', fontWeight: index < 3 ? 600 : 400 }}>
                                        <Clock size={14} /> Ends: {formatDate(notif.endDate)}
                                    </span>
                                </div>
                                <div style={{ background: 'var(--bg-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', border: '1px dashed var(--border-color)' }}>
                                    Code: {notif.coupon !== 'NONE' ? notif.coupon : 'No Code Required'}
                                </div>
                            </div>

                            <Link to={`/store/${notif.storeId}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                                Shop Now <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: 'var(--bg-color)', borderRadius: 'var(--radius-xl)',
                    border: '2px dashed var(--border-color)'
                }}>
                    <Bell size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>You're all caught up!</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        There are no deals expiring soon in your area. Check back later!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
