import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockStores } from '../mockData';
import { MapPin, Star, Clock, Globe, Phone, ArrowLeft, Tag, Share2, Heart, ExternalLink } from 'lucide-react';

const StoreDetail = () => {
    const { id } = useParams();
    const store = mockStores.find(s => s.id === parseInt(id));
    const [isSaved, setIsSaved] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (coupon, id) => {
        if (coupon === 'NONE') return;
        navigator.clipboard.writeText(coupon).catch(() => { });
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!store) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
                <h2>Store not found</h2>
                <Link to="/" className="btn btn-primary">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1rem 4rem' }} className="animate-fade-in">

            {/* Top Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Link to="/" className="btn btn-outline" style={{ gap: '0.35rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    <ArrowLeft size={16} /> Back
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem 0.75rem' }} title="Share">
                        <Share2 size={16} />
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => setIsSaved(!isSaved)}
                        style={{ padding: '0.5rem 0.75rem', color: isSaved ? 'var(--secondary-color)' : 'inherit', borderColor: isSaved ? 'var(--secondary-color)' : 'var(--border-color)' }}
                        title={isSaved ? 'Saved!' : 'Save Store'}
                    >
                        <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            {/* Hero */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: 0 }}>
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
                    <img src={store.imageUrl} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <span className="badge badge-discount" style={{ fontSize: '0.875rem', padding: '0.4rem 0.875rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                            {store.topDiscount}
                        </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', color: 'white' }}>
                        <h1 style={{ color: 'white', fontSize: '1.75rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{store.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}>{store.category}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
                                <Star size={14} fill="currentColor" /> {store.rating} ({store.reviews})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {[
                        { Icon: MapPin, label: 'Address', value: store.address },
                        { Icon: Clock, label: 'Opening Hours', value: store.openingHours },
                        { Icon: Phone, label: 'Phone', value: store.phone },
                        { Icon: Globe, label: 'Social', value: 'Facebook Page', href: store.facebookUrl },
                    ].map(({ Icon, label, value, href }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                            <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '0.5rem', color: 'var(--primary-color)', flexShrink: 0 }}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                                {href ? (
                                    <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        {value} <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>{value}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Coupons */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={22} color="var(--primary-color)" /> Active Coupons & Deals
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {store.activeDiscounts.map(discount => (
                    <div key={discount.id} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderLeft: '4px solid var(--secondary-color)' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{discount.description}</h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                Expires: {new Date(discount.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div
                            onClick={() => handleCopy(discount.coupon, discount.id)}
                            style={{
                                minWidth: '160px', textAlign: 'center',
                                background: copiedId === discount.id ? '#ecfdf5' : 'var(--bg-color)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: 'var(--radius-lg)',
                                border: `2px dashed ${copiedId === discount.id ? 'var(--success-color)' : 'var(--border-color)'}`,
                                cursor: discount.coupon === 'NONE' ? 'default' : 'pointer',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                                {discount.coupon === 'NONE' ? 'Auto Applied' : copiedId === discount.id ? '✅ Copied!' : 'Click to Copy'}
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'monospace', color: copiedId === discount.id ? 'var(--success-color)' : 'var(--primary-color)', letterSpacing: '0.08em' }}>
                                {discount.coupon === 'NONE' ? 'NO CODE' : discount.coupon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreDetail;
