import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockStores } from '../mockData';
import { MapPin, ChevronRight, Star, SlidersHorizontal, Tag } from 'lucide-react';
import StoreMap from '../components/StoreMap';

const CATEGORIES = [
    { id: 'All', label: 'All', icon: '✨' },
    { id: 'Men', label: 'Men', icon: '👔' },
    { id: 'Women', label: 'Women', icon: '👗' },
    { id: 'Kids', label: 'Kids', icon: '🧒' },
    { id: 'Couple', label: 'Couple', icon: '💑' },
];

const SORT_OPTIONS = [
    { label: 'Most Discounted', value: 'discount' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Reviews', value: 'reviews' },
    { label: 'Nearest First', value: 'distance' },
];

const Home = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('discount');
    const [showFilters, setShowFilters] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [measureStore, setMeasureStore] = useState(null);

    const handleUserLocation = (locationData) => {
        setUserLocation(locationData);
        setSortBy('distance');
    };

    const handleMeasure = (e, store) => {
        e.preventDefault();
        e.stopPropagation();
        setMeasureStore(prev => prev?.id === store.id ? null : store);
    };

    const filteredStores = useMemo(() => {
        let results = mockStores;
        if (activeCategory !== 'All') {
            results = results.filter(s => s.categories.includes(activeCategory));
        }
        return [...results].sort((a, b) => {
            if (sortBy === 'distance' && userLocation?.distances) {
                return (userLocation.distances[a.id] || 99) - (userLocation.distances[b.id] || 99);
            }
            if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'reviews') return b.reviews - a.reviews;
            return 0;
        });
    }, [activeCategory, sortBy, userLocation]);

    const totalCoupons = mockStores.reduce((sum, s) => sum + s.activeDiscounts.length, 0);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>

            {/* ===== Sidebar ===== */}
            <div style={{
                width: '440px', flexShrink: 0, display: 'flex', flexDirection: 'column',
                background: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--border-color)',
                overflowY: 'auto',
                boxShadow: '2px 0 12px rgba(0,0,0,0.03)',
                zIndex: 10,
            }}>

                {/* Hero Banner - RED / ORANGE Theme */}
                <div style={{
                    background: 'linear-gradient(135deg, #E53935 0%, #D32F2F 50%, #C62828 100%)',
                    padding: '2rem 1.5rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '220px',
                }}>
                    {/* Abstract Shapes */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6D00, #FF8F00)', opacity: 0.9, mixBlendMode: 'screen', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-10px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,109,0,0.4)', mixBlendMode: 'screen', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', zIndex: 1, marginTop: '-0.5rem' }}>

                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                            Discount dash <br /> <span style={{ color: '#FFD54F' }}>Near You.</span>
                        </h1>

                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Stores', value: mockStores.length, icon: '🏪' },
                                { label: 'Coupons', value: totalCoupons, icon: '🎟️' },
                                { label: 'Max Off', value: '60%', icon: '🔥', highlight: true },
                            ].map(({ label, value, icon, highlight }) => (
                                <div key={label} style={{
                                    background: highlight ? '#FFCA28' : 'rgba(255,255,255,0.15)',
                                    color: highlight ? '#BF360C' : 'white',
                                    backdropFilter: highlight ? 'none' : 'blur(4px)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '0.5rem 0.6rem',
                                    border: highlight ? 'none' : '1px solid rgba(255,255,255,0.25)',
                                    flex: 1, minWidth: '70px', textAlign: 'center',
                                    boxShadow: highlight ? '0 4px 12px rgba(255,202,40,0.3)' : 'none',
                                }}>
                                    <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{icon}</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{value}</div>
                                    <div style={{ fontSize: '0.65rem', opacity: highlight ? 1 : 0.85, marginTop: '2px', fontWeight: highlight ? 700 : 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category + Sort Controls (sticky) */}
                <div style={{ padding: '1.25rem 1.5rem 0.75rem', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                    padding: '0.45rem 1.1rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 700, fontSize: '0.85rem',
                                    fontFamily: 'var(--font-heading)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                                    border: activeCategory === cat.id ? '2px solid transparent' : '2px solid var(--border-color)',
                                    background: activeCategory === cat.id ? 'linear-gradient(135deg, #1E3A8A, #1e40af)' : 'white',
                                    color: activeCategory === cat.id ? 'white' : 'var(--text-muted)',
                                    boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(30,58,138,0.3)' : 'none',
                                    transform: activeCategory === cat.id ? 'scale(1.03)' : 'scale(1)',
                                    flexShrink: 0,
                                }}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort row */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowFilters(f => !f)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                border: '1.5px solid var(--border-color)',
                                background: showFilters ? 'var(--accent-light)' : 'white',
                                color: showFilters ? 'var(--accent-color)' : 'var(--text-main)',
                                cursor: 'pointer',
                            }}
                        >
                            <SlidersHorizontal size={14} /> Sort
                        </button>
                        {showFilters && SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSortBy(opt.value)}
                                style={{
                                    padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                                    border: sortBy === opt.value ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                                    background: sortBy === opt.value ? 'var(--accent-light)' : 'white',
                                    color: sortBy === opt.value ? 'var(--accent-color)' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>{filteredStores.length}</span> stores found matching criteria
                    </div>
                </div>

                {/* Store Cards */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--bg-color)' }}>
                    {filteredStores.map((store, i) => (
                        <Link
                            to={`/store/${store.id}`}
                            key={store.id}
                            className="card"
                            style={{
                                display: 'block',
                                padding: '0',
                                textDecoration: 'none',
                                animation: `fadeInUp 0.4s ease-out ${i * 0.04}s both`,
                                backgroundColor: 'white',
                            }}
                        >
                            {/* Card Image */}
                            <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                                <img
                                    src={store.imageUrl}
                                    alt={store.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                {/* Overlay gradient */}
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

                                {/* Red Discount badge - Most prominent */}
                                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                                    <span className="badge badge-discount" style={{ fontWeight: 800, fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                                        {store.topDiscount}
                                    </span>
                                </div>
                                {/* Category pill on image */}
                                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                                    {store.categories.slice(0, 2).map(c => (
                                        <span key={c} style={{ background: 'white', color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-heading)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{c}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{store.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                                            <MapPin size={14} />
                                            <span>{store.address.split(',')[0]}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#B45309', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0, background: '#FEF3C7', padding: '4px 8px', borderRadius: 'var(--radius-full)', border: '1px solid #FDE68A' }}>
                                        <Star size={14} fill="currentColor" />
                                        {store.rating}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px dashed var(--border-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--secondary-color)' }}>
                                                <Tag size={15} />
                                                {store.activeDiscounts.length} Deals
                                            </span>
                                            {userLocation?.distances?.[store.id] != null && (
                                                <span style={{ background: 'var(--accent-light)', color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.8rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    📍 {userLocation.distances[store.id] < 1
                                                        ? `${Math.round(userLocation.distances[store.id] * 1000)} m`
                                                        : `${userLocation.distances[store.id].toFixed(1)} km`}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                        <button
                                            className="btn btn-outline"
                                            onClick={(e) => handleMeasure(e, store)}
                                            style={{
                                                flex: 1, padding: '0.6rem', fontSize: '0.8rem',
                                                border: measureStore?.id === store.id ? '2px solid var(--accent-color)' : '1.5px solid var(--border-color)',
                                                background: measureStore?.id === store.id ? 'var(--accent-light)' : 'transparent',
                                                color: measureStore?.id === store.id ? 'var(--accent-color)' : 'var(--text-main)',
                                            }}
                                        >
                                            📏 {measureStore?.id === store.id ? 'Clear Route' : 'Measure'}
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ flex: 1.5, padding: '0.6rem', fontSize: '0.8rem' }}
                                        >
                                            View Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ===== Google Map Panel ===== */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e5e3df' }}>
                <StoreMap onUserLocation={handleUserLocation} measureStore={measureStore} onMeasureClear={() => setMeasureStore(null)} />
            </div>
        </div>
    );
};

export default Home;
