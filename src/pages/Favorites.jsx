import React from 'react';
import { mockStores } from '../mockData';
import { Heart, MapPin, Star, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

const Favorites = () => {
    const { favorites, toggleFavorite } = useAppContext();
    const { isMobile } = useWindowSize();
    const favoriteStores = mockStores.filter(s => favorites.includes(s.id));

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '10rem' }} className="animate-fade-in">
            {/* ── Brand Header ── */}
            <header style={{
                padding: isMobile ? '6rem 0 4rem' : '10rem 0 7rem',
                background: 'var(--grad-navy)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '20%', right: '-10%', width: '30%', height: '100%',
                    background: 'var(--brand-red)', opacity: 0.1, filter: 'blur(80px)', transform: 'rotate(15deg)'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '2rem' }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem',
                            borderRadius: 'var(--radius-full)', marginBottom: '1.5rem',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Sparkles size={12} color="var(--brand-red)" />
                            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800 }}>Personal Selection</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: '1rem' }}>
                            Your <span style={{ color: 'var(--brand-red)', fontStyle: 'italic', fontWeight: 300 }}>Bag</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.6, fontWeight: 300 }}>
                            A curated selection of Mymensingh's boutiques and exclusive collections reserved specifically for you.
                        </p>
                    </div>
                    <div style={{
                        fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800,
                        background: 'rgba(255,255,255,0.05)', padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', color: 'var(--brand-red)', marginBottom: '0.25rem' }}>{favorites.length}</div>
                        <div style={{ opacity: 0.6 }}>{favorites.length === 1 ? 'Item' : 'Items'}</div>
                    </div>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '5rem' }}>
                {favoriteStores.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {favoriteStores.map((store, index) => (
                            <Link
                                key={store.id}
                                to={`/store/${store.id}`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '180px 1fr auto',
                                    gap: isMobile ? '1.5rem' : '3.5rem',
                                    padding: '2rem',
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(26, 35, 126, 0.05)',
                                    boxShadow: 'var(--shadow-sm)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.3s ease',
                                    alignItems: 'center'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                            >
                                <div style={{ height: isMobile ? '200px' : '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--primary-light)' }}>
                                    <img src={store.imageUrl} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'white', background: 'var(--brand-navy)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                                            {store.categories[0]}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
                                            <Star size={12} fill="var(--brand-red)" color="transparent" /> {store.rating}
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-navy)', textTransform: 'uppercase' }}>{store.name}</h3>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-blue)', fontSize: '0.8rem', fontWeight: 500 }}>
                                        <MapPin size={12} color="var(--brand-red)" /> {store.address}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: isMobile ? 'space-between' : 'flex-end', marginTop: isMobile ? '1rem' : '0' }}>
                                    <button
                                        onClick={(e) => { e.preventDefault(); toggleFavorite(store.id); }}
                                        style={{ background: 'var(--accent-light)', border: 'none', cursor: 'pointer', color: 'var(--brand-red)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 57, 53, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-light)'}
                                    >
                                        <Heart size={20} fill="currentColor" />
                                    </button>
                                    {!isMobile && (
                                        <div style={{ color: 'var(--brand-navy)', opacity: 0.3 }}>
                                            <ArrowRight size={24} strokeWidth={1.5} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10rem 0' }} className="glass">
                        <ShoppingBag size={48} strokeWidth={1} style={{ marginBottom: '2rem', color: 'var(--brand-blue)', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '1rem', textTransform: 'uppercase' }}>Empty Collection</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: '1rem', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem', fontWeight: 450 }}>
                            You haven't reserved any boutiques yet. Begin your curation by exploring the directory.
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
                            Browse directory
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Favorites;
