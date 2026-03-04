import React from 'react';
import { mockStores } from '../mockData';
import { Tag, MapPin, ExternalLink, HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    // In a real app user favorites would be stored in the backend or localstorage.
    // Since we don't have that, we'll just show the first two mock stores as a mock "favorites" list
    const favoriteStores = [mockStores[0], mockStores[2]];

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    My Favorite Shops
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Your customized list of stores to keep an eye on for deals.
                </p>
            </div>

            {favoriteStores.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {favoriteStores.map(store => (
                        <div key={store.id} className="card" style={{
                            padding: '1.25rem',
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'transform var(--transition-bounce), box-shadow var(--transition-fast)'
                        }}>
                            <img
                                src={store.image}
                                alt={store.name}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius-lg)'
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>{store.name}</h3>
                                    <span className="badge badge-discount animate-pulse-glow" style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>
                                        {store.topDiscount}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <MapPin size={14} /> {store.address}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {store.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="badge badge-category" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                                            <Tag size={10} style={{ display: 'inline', marginRight: '3px' }} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link to={`/store/${store.id}`} className="btn btn-outline" style={{ padding: '0.5rem', alignSelf: 'center', borderRadius: '50%' }}>
                                <ExternalLink size={18} />
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
                    <HeartCrack size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>No favorites yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        When you favorite a store it will appear here so you can easily check for new deals.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>Explore Stores</Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;
