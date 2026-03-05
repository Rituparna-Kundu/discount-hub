import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockStores } from '../mockData';
import { MapPin, Search, Star, Map as MapIcon, Grid, Tag, Heart, Sparkles, Filter } from 'lucide-react';
import StoreMap from '../components/StoreMap';
import { useAppContext } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

const CATEGORIES = [
    { id: 'All', label: 'All', emoji: '✨' },
    { id: 'Men', label: 'Men', emoji: '🕺' },
    { id: 'Women', label: 'Women', emoji: '👸' },
    { id: 'Kids', label: 'Kids', emoji: '🎈' },
    { id: 'Couple', label: 'Couple', emoji: '👩‍❤️‍👨' },
];

const Home = () => {
    const {
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        toggleFavorite,
        isFavorite,
        userLocation,
        setUserLocation
    } = useAppContext();
    const { isMobile } = useWindowSize();
    const [sortBy, setSortBy] = useState('discount');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const navigate = useNavigate();

    const filteredStores = useMemo(() => {
        let results = mockStores;

        if (activeCategory !== 'All') {
            results = results.filter(s => s.categories.includes(activeCategory));
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        return [...results].sort((a, b) => {
            if (sortBy === 'distance' && userLocation?.distances) {
                return (userLocation.distances[a.id] || 99) - (userLocation.distances[b.id] || 99);
            }
            if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });
    }, [activeCategory, sortBy, userLocation, searchQuery]);

    const totalDeals = mockStores.reduce((sum, s) => sum + s.activeDiscounts.length, 0);

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-main)' }}>

            {/* ── Vibrant Hero Section ── */}
            <section style={{
                padding: isMobile ? '6rem 0 4rem' : '10rem 0 8rem',
                background: 'var(--grad-navy)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                {/* Decorative background element */}
                <div style={{
                    position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '120%',
                    background: 'var(--brand-red)', opacity: 0.1, filter: 'blur(100px)', transform: 'rotate(-20deg)'
                }}></div>

                <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                        background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.25rem',
                        borderRadius: 'var(--radius-full)', marginBottom: '2.5rem',
                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Sparkles size={14} color="var(--brand-red)" fill="var(--brand-red)" />
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2rem', fontWeight: 700 }}>Exclusive Collection 2026</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        marginBottom: '2rem',
                        lineHeight: 0.9,
                        fontFamily: 'var(--font-heading)',
                        color: 'white'
                    }}>
                        Boutique <br />
                        <span style={{ fontStyle: 'italic', fontWeight: '350', color: 'var(--brand-red)' }}>Discoveries</span>
                    </h1>

                    <p style={{
                        maxWidth: '650px',
                        margin: '0 auto 4rem',
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6,
                        fontWeight: 300
                    }}>
                        Unlocking Mymensingh's most prestigious discounts. <br />
                        Hand-selected for those who appreciate the finer things.
                    </p>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: isMobile ? '1.5rem 2rem' : '4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 750
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.5rem', color: 'var(--brand-red)' }}>{mockStores.length}</span>
                            <span style={{ opacity: 0.6 }}>Stores</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.5rem', color: 'var(--brand-red)' }}>{totalDeals}+</span>
                            <span style={{ opacity: 0.6 }}>Offers</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1.5rem', color: 'var(--brand-red)' }}>60%</span>
                            <span style={{ opacity: 0.6 }}>Max Off</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Dynamic Search & Filters ── */}
            <div className="glass" style={{
                position: 'sticky',
                top: isMobile ? '0' : '77px', // adjusted for navbar height
                zIndex: 50,
                padding: '1rem 0',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: isMobile ? '1rem' : '2.5rem'
                }}>
                    {/* Category Scroll */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        width: isMobile ? '100%' : 'auto',
                        paddingBottom: '2px',
                        scrollbarWidth: 'none'
                    }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontWeight: 700,
                                    background: activeCategory === cat.id ? 'var(--brand-navy)' : 'white',
                                    color: activeCategory === cat.id ? 'white' : 'var(--brand-navy)',
                                    border: '1px solid',
                                    borderColor: activeCategory === cat.id ? 'var(--brand-navy)' : 'rgba(26, 35, 126, 0.1)',
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: 'var(--radius-full)',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: activeCategory === cat.id ? 'var(--shadow-navy)' : 'none'
                                }}
                            >
                                <span>{cat.emoji}</span> {cat.label}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'center',
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: 'space-between'
                    }}>
                        {/* Inline Search */}
                        <div style={{
                            position: 'relative',
                            flex: 1,
                            minWidth: isMobile ? 'auto' : '280px',
                            background: 'var(--primary-light)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.5rem 1rem',
                            border: '1px solid rgba(26, 35, 126, 0.05)'
                        }}>
                            <input
                                type="text"
                                placeholder="Filter results..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '0.8rem',
                                    outline: 'none',
                                    color: 'var(--brand-navy)',
                                    fontWeight: 500
                                }}
                            />
                            <Search size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--brand-navy)', opacity: 0.5 }} />
                        </div>

                        {/* View Switchers */}
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                            <button onClick={() => setViewMode('list')} style={{
                                color: viewMode === 'list' ? 'var(--brand-red)' : 'var(--text-light)',
                                background: viewMode === 'list' ? 'var(--accent-light)' : 'transparent',
                                padding: '0.4rem', borderRadius: 'var(--radius-sm)'
                            }}>
                                <Grid size={18} strokeWidth={viewMode === 'list' ? 2.5 : 1.5} />
                            </button>
                            <button onClick={() => setViewMode('map')} style={{
                                color: viewMode === 'map' ? 'var(--brand-red)' : 'var(--text-light)',
                                background: viewMode === 'map' ? 'var(--accent-light)' : 'transparent',
                                padding: '0.4rem', borderRadius: 'var(--radius-sm)'
                            }}>
                                <MapIcon size={18} strokeWidth={viewMode === 'map' ? 2.5 : 1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Display Area ── */}
            <main className="container" style={{ paddingTop: isMobile ? '4rem' : '6rem', paddingBottom: isMobile ? '8rem' : '10rem' }}>
                {viewMode === 'list' ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: isMobile ? '3rem' : '6rem 3rem'
                    }}>
                        {filteredStores.map((store, i) => (
                            <div key={store.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                <Link to={`/store/${store.id}`} style={{ display: 'block' }}>
                                    <div style={{
                                        position: 'relative',
                                        aspectRatio: isMobile ? '16/9' : '16/7',
                                        overflow: 'hidden',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: '1.25rem',
                                        boxShadow: 'var(--shadow-md)',
                                        background: 'var(--primary-light)',
                                        group: 'true' // Logical group for hover effects
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                        e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                                    }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                                        }}>
                                        <img
                                            src={store.imageUrl}
                                            alt={store.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.2, 0, 0, 1)' }}
                                        />

                                        {/* Cinematic Scrim */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(13, 27, 62, 0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: '2rem'
                                        }}>
                                            <div className="glass" style={{
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: 'var(--radius-md)',
                                                textAlign: 'center',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                <h3 style={{
                                                    fontSize: isMobile ? '1.2rem' : '1.8rem',
                                                    color: 'var(--brand-navy)',
                                                    fontWeight: 900,
                                                    margin: 0,
                                                    letterSpacing: '-0.01em',
                                                    fontFamily: 'var(--font-heading)'
                                                }}>
                                                    {store.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(store.id); }}
                                            style={{
                                                position: 'absolute', top: '1rem', right: '1rem',
                                                background: 'white', border: 'none', borderRadius: '50%',
                                                width: '32px', height: '32px', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                boxShadow: 'var(--shadow-md)', cursor: 'pointer',
                                                zIndex: 10,
                                                color: isFavorite(store.id) ? 'var(--brand-red)' : 'var(--brand-navy)'
                                            }}
                                        >
                                            <Heart size={16} fill={isFavorite(store.id) ? 'currentColor' : 'none'} />
                                        </button>

                                        <div style={{
                                            position: 'absolute',
                                            bottom: '1rem',
                                            left: '1rem',
                                            background: 'var(--grad-brand)',
                                            color: 'white',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            borderRadius: 'var(--radius-sm)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            boxShadow: 'var(--shadow-red)',
                                            zIndex: 10
                                        }}>
                                            Up to {store.discountPercent}% OFF
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                <MapPin size={10} color="var(--brand-red)" />
                                                {store.address.split(',')[0]}
                                                {userLocation?.distances?.[store.id] != null && (
                                                    <span style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>• {userLocation.distances[store.id].toFixed(1)} km</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                                            fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-navy)',
                                            background: 'var(--bg-alt)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)'
                                        }}>
                                            <Star size={14} fill="var(--brand-red)" color="transparent" /> {store.rating}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {store.tags.slice(0, 3).map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.6rem', padding: '0.2rem 0.6rem',
                                                background: 'var(--primary-light)', color: 'var(--brand-blue)',
                                                borderRadius: 'var(--radius-full)', textTransform: 'uppercase',
                                                fontWeight: 600, border: '1px solid rgba(26, 35, 126, 0.05)'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        height: '70vh', width: '100%',
                        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                        border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)'
                    }}>
                        <StoreMap
                            onUserLocation={(data) => setUserLocation(data)}
                            searchQuery={searchQuery}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
