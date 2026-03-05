import React from 'react';
import StoreMap from '../components/StoreMap';
import { Search, MapPin, Compass, Store, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

const MapPage = () => {
    const { userLocation, setUserLocation, searchQuery, setSearchQuery } = useAppContext();
    const { isMobile } = useWindowSize();
    const [dealsOnly, setDealsOnly] = React.useState(false);

    return (
        <div style={{
            height: isMobile ? 'calc(100vh - 142px)' : 'calc(100vh - 77px)',
            background: '#F8F9FA', // Off-White Frame
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* ── Search & Filters Overlay ── */}
            <div style={{
                position: 'absolute',
                top: isMobile ? '1rem' : '2rem',
                left: isMobile ? 'var(--container-padding)' : '2rem',
                right: isMobile ? 'var(--container-padding)' : 'auto',
                zIndex: 10,
                width: isMobile ? 'auto' : '400px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                pointerEvents: 'none'
            }}>
                {/* Search Bar */}
                <div className="glass" style={{
                    padding: isMobile ? '0.75rem 1rem' : '1.25rem',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'auto'
                }}>
                    <Search size={18} color="var(--brand-red)" style={{ marginRight: '1rem', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder={isMobile ? "Search..." : "Find boutiques or styles..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.9rem',
                            color: 'var(--brand-navy)',
                            fontWeight: 600,
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Quick Filters / Deals Toggle */}
                <div style={{ pointerEvents: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setDealsOnly(!dealsOnly)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: isMobile ? '0.6rem 1.25rem' : '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: dealsOnly ? 'var(--grad-brand)' : 'white',
                            color: dealsOnly ? 'white' : 'var(--brand-navy)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            backdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Zap size={14} fill={dealsOnly ? 'white' : 'none'} />
                        {isMobile ? 'Deals' : 'Best Offers'}
                    </button>

                    {!isMobile && (
                        <div className="glass" style={{
                            padding: '0.6rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: 'var(--brand-navy)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            <div style={{ width: '6px', height: '6px', background: userLocation ? '#E53935' : '#CBD5E0', borderRadius: '50%', boxShadow: userLocation ? '0 0 8px #E53935' : 'none' }}></div>
                            {userLocation ? 'Signal: Active' : 'Radar: Scanning...'}
                        </div>
                    )}
                </div>

                {/* Desktop-only Directory Card */}
                {!isMobile && (
                    <div className="glass" style={{
                        marginTop: '1rem',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                        pointerEvents: 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ background: 'var(--grad-brand)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'white' }}>
                                <Store size={18} />
                            </div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)', textTransform: 'uppercase' }}>Directory</h2>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.8, lineHeight: 1.6, fontWeight: 500 }}>
                            Explore Mymensingh's premier boutiques through our refined visual radar. High-value offers are color-coded for instant detection.
                        </p>
                    </div>
                )}
            </div>

            <StoreMap
                onUserLocation={(data) => setUserLocation(data)}
                searchQuery={searchQuery}
                dealsOnly={dealsOnly}
            />
        </div>
    );
};

export default MapPage;
