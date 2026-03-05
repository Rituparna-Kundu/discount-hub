import React, { useMemo } from 'react';
import { mockStores } from '../mockData';
import { Clock, Store, ArrowRight, BellRing, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowSize } from '../hooks/useWindowSize';

const Notifications = () => {
    const { isMobile, isDesktop } = useWindowSize();

    const notifications = useMemo(() => {
        let allDiscounts = [];
        mockStores.forEach(store => {
            if (store.activeDiscounts && store.activeDiscounts.length > 0) {
                store.activeDiscounts.forEach(discount => {
                    allDiscounts.push({
                        ...discount,
                        storeId: store.id,
                        storeName: store.name
                    });
                });
            }
        });
        return allDiscounts.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }, []);

    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '8rem' }} className="animate-fade-in">
            {/* ── Brand Header ── */}
            <header style={{
                padding: isMobile ? '6rem 0 4rem' : '10rem 0 7rem',
                background: 'var(--grad-brand)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Background Element */}
                <div style={{
                    position: 'absolute', top: '-10%', left: '70%', width: '40%', height: '120%',
                    background: 'var(--brand-navy)', opacity: 0.15, filter: 'blur(100px)', transform: 'rotate(-25deg)', borderRadius: '50%'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                        background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1.25rem',
                        borderRadius: 'var(--radius-full)', marginBottom: '1.5rem',
                        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <BellRing size={14} color="white" />
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 850 }}>Live Dispatch</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '1rem' }}>
                        The <span style={{ fontWeight: 300, fontStyle: 'italic' }}>Dispatch</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '550px', lineHeight: 1.6, fontWeight: 300 }}>
                        Real-time intelligence on seasonal transitions and priority collection access in Mymensingh.
                    </p>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '5rem' }}>
                {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {notifications.map((notif, index) => (
                            <Link
                                key={notif.id}
                                to={`/store/${notif.storeId}`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
                                    gap: isMobile ? '1.5rem' : '4rem',
                                    padding: '2.5rem',
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(26, 35, 126, 0.05)',
                                    boxShadow: 'var(--shadow-sm)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(10px)';
                                    e.currentTarget.style.borderColor = 'rgba(26, 35, 126, 0.15)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.borderColor = 'rgba(26, 35, 126, 0.05)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                            >
                                {/* Priority Indicator */}
                                {index < 3 && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '4px', background: 'var(--brand-red)' }}></div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            color: index < 3 ? 'var(--brand-red)' : 'var(--brand-blue)',
                                            fontWeight: 850, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em'
                                        }}>
                                            {index < 3 ? <Zap size={12} fill="currentColor" /> : <Sparkles size={12} />}
                                            {index < 3 ? 'Critical Access' : 'New Arrival'}
                                        </div>
                                        <span style={{ color: 'rgba(26, 35, 126, 0.1)' }}>|</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-navy)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                            <Store size={12} color="var(--brand-red)" /> {notif.storeName}
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-navy)', textTransform: 'uppercase', lineHeight: 1.1 }}>{notif.description}</h3>

                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                            <Clock size={14} color="var(--brand-red)" />
                                            <span>Ends {formatDate(notif.endDate)}</span>
                                        </div>
                                        {notif.coupon !== 'NONE' && (
                                            <div style={{
                                                background: 'var(--accent-light)', color: 'var(--brand-red)',
                                                padding: '0.2rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)'
                                            }}>
                                                USE CODE: {notif.coupon}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-red)', fontWeight: 850, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {!isMobile && <span>Explore Shop</span>}
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: 'var(--primary-light)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10rem 0' }} className="glass">
                        <BellRing size={48} strokeWidth={1} style={{ marginBottom: '2rem', color: 'var(--brand-blue)', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '1rem', textTransform: 'uppercase' }}>Quiet Period</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '3rem', maxWidth: '450px', margin: '0 auto 3rem', fontWeight: 450 }}>
                            Your dispatch feed is currently optimized. Explore the boutique directory for ongoing collections.
                        </p>
                        <Link to="/" style={{
                            display: 'inline-block',
                            padding: '1.25rem 3.5rem',
                            background: 'var(--grad-brand)',
                            color: 'white',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            borderRadius: 'var(--radius-full)',
                            boxShadow: 'var(--shadow-red)'
                        }}>
                            Open Directory
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Notifications;
