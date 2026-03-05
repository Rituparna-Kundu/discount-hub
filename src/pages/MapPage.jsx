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
            height: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 77px)',
            background: '#0A0F1D', // Midnight Frame Match
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="glass" style={{
                position: 'absolute',
                top: isMobile ? '0' : '2rem',
                left: isMobile ? '0' : '2rem',
                zIndex: 10,
                padding: isMobile ? '1.5rem 1.25rem' : '2.5rem',
                width: isMobile ? '100%' : '400px',
                borderRadius: isMobile ? '0' : 'var(--radius-lg)',
                boxShadow: isMobile ? 'none' : 'var(--shadow-lg)',
                border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: isMobile ? 'auto' : 'calc(100% - 4rem)',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{
                        background: 'var(--grad-brand)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        boxShadow: 'var(--shadow-red)'
                    }}>
                        <Store size={20} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--brand-navy)', textTransform: 'uppercase', lineHeight: 1 }}>Radar</h1>
                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--brand-red)', fontWeight: 800 }}>Mymensingh Hub</span>
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 450, opacity: 0.8 }}>
                    Scan the city for active boutique offers and seasonal collection transitions.
                </p>

                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div className="glass" style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '16px',
                        padding: '0.8rem 1.25rem',
                        border: '1px solid rgba(26, 35, 126, 0.1)',
                        background: 'rgba(255,255,255,0.8)'
                    }}>
                        <Search size={16} color="var(--brand-red)" style={{ marginRight: '1rem' }} />
                        <input
                            type="text"
                            placeholder="Find boutiques or styles..."
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
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setDealsOnly(!dealsOnly)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            borderRadius: '12px',
                            background: dealsOnly ? 'var(--grad-brand)' : 'white',
                            color: dealsOnly ? 'white' : 'var(--brand-navy)',
                            border: '1px solid rgba(26, 35, 126, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                padding: '0.3rem',
                                background: dealsOnly ? 'rgba(255,255,255,0.2)' : 'var(--accent-light)',
                                borderRadius: '6px'
                            }}>
                                <Zap size={14} color={dealsOnly ? 'white' : 'var(--brand-red)'} fill={dealsOnly ? 'white' : 'none'} />
                            </div>
                            High Discounts
                        </div>
                        <div style={{
                            width: '32px', height: '18px',
                            background: dealsOnly ? 'rgba(255,255,255,0.3)' : '#eee',
                            borderRadius: '10px', position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute', top: '2px',
                                left: dealsOnly ? '16px' : '2px',
                                width: '14px', height: '14px',
                                background: 'white', borderRadius: '50%',
                                transition: 'all 0.3s ease'
                            }}></div>
                        </div>
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {userLocation ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--brand-red)', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--brand-red)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-red)' }}></div>
                            Live Signal Acquired
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={12} /> Proximity tracking offline
                        </div>
                    )}
                </div>
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
