import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockStores } from '../mockData';
import { MapPin, Star, Clock, Globe, Phone, ArrowLeft, Tag, Share2, Heart, ExternalLink, Gift, Copy, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';

const StoreDetail = () => {
    const { id } = useParams();
    const { toggleFavorite, isFavorite } = useAppContext();
    const { isMobile, isDesktop } = useWindowSize();
    const store = mockStores.find(s => s.id === parseInt(id));
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (coupon, id) => {
        if (coupon === 'NONE') return;
        navigator.clipboard.writeText(coupon).catch(() => { });
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!store) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--brand-navy)' }}>Not Found</h2>
                <Link to="/" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem', borderBottom: '1px solid var(--brand-red)', paddingBottom: '2px', color: 'var(--brand-red)', fontWeight: 700 }}>Return to Directory</Link>
            </div>
        );
    }

    const saved = isFavorite(store.id);

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '10rem' }} className="animate-fade-in">
            {/* ── Sub Navigation ── */}
            <div className="glass" style={{ position: 'sticky', top: isMobile ? '0' : '77px', zIndex: 90, borderBottom: '1px solid rgba(26, 35, 126, 0.05)' }}>
                <div className="container" style={{ padding: '1rem var(--container-padding)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.7rem', color: 'var(--brand-navy)', fontWeight: 750 }}>
                        <ArrowLeft size={16} color="var(--brand-red)" /> Back to Index
                    </Link>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-navy)' }}>
                            <Share2 size={18} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => toggleFavorite(store.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--brand-red)' : 'var(--brand-navy)' }}
                        >
                            <Heart size={18} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="container" style={{ marginTop: '4rem' }}>
                {/* ── Store Identity Section ── */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? '1.1fr 0.9fr' : '1fr',
                    gap: isMobile ? '3rem' : '6rem',
                    alignItems: 'start',
                    marginBottom: isMobile ? '4rem' : '8rem'
                }}>
                    <div style={{
                        position: 'relative',
                        aspectRatio: isMobile ? '1/1' : '16/10',
                        background: 'var(--primary-light)',
                        overflow: 'hidden',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <img src={store.imageUrl} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', top: '1.5rem', left: '1.5rem',
                            background: 'var(--grad-brand)', color: 'white',
                            padding: '0.6rem 1.25rem', fontSize: '0.75rem', fontWeight: 850,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            boxShadow: 'var(--shadow-red)', borderRadius: 'var(--radius-sm)'
                        }}>
                            {store.discountPercent}% OFF
                        </div>
                    </div>

                    <div style={{ paddingTop: isMobile ? '0' : '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                            {store.categories.map(c => (
                                <span key={c} style={{
                                    fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2rem',
                                    color: 'white', background: 'var(--brand-navy)', padding: '0.3rem 0.75rem',
                                    borderRadius: 'var(--radius-full)', fontWeight: 700
                                }}>{c}</span>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-navy)' }}>
                                <Star size={14} fill="var(--brand-red)" color="transparent" /> {store.rating}
                            </div>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontFamily: 'var(--font-heading)',
                            lineHeight: 0.9,
                            marginBottom: '2rem',
                            color: 'var(--brand-navy)',
                            textTransform: 'uppercase'
                        }}>
                            {store.name}
                        </h1>

                        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '3.5rem', fontWeight: 300, maxWidth: '550px' }}>
                            {store.description || `Experience high-quality craftsmanship at ${store.name}. Located in the heart of Mymensingh, we offer a curated selection of premium products tailored for your lifestyle.`}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem' }}>
                            {[
                                { Icon: MapPin, label: 'Location', value: store.address },
                                { Icon: Clock, label: 'Hours', value: store.openingHours },
                                { Icon: Phone, label: 'Contact', value: store.phone },
                                { Icon: Globe, label: 'Social', value: 'Official Page', href: store.facebookUrl },
                            ].map(({ Icon, label, value, href }) => (
                                <div key={label} style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{ color: 'var(--brand-red)', background: 'var(--accent-light)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-blue)', marginBottom: '0.25rem', fontWeight: 800 }}>{label}</div>
                                        {href ? (
                                            <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--brand-navy)', borderBottom: '1px solid rgba(26, 35, 126, 0.2)', paddingBottom: '1px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                                {value} <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--brand-navy)', fontWeight: 600 }}>{value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Colorful Offers Section ── */}
                <section style={{ marginTop: '8rem' }}>
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
                            <div style={{ background: 'var(--grad-brand)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'white' }}>
                                <Gift size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-navy)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Member Rewards</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', letterSpacing: '0.05em' }}>Access exclusive boutiques vouchers</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : isMobile ? '1fr' : '1fr 1fr', gap: '2.5rem' }}>
                            {store.activeDiscounts.map(discount => (
                                <div key={discount.id} className="glass" style={{
                                    padding: '2.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '260px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(26, 35, 126, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Decorative Accent */}
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', background: 'var(--grad-brand)', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                            <Tag size={12} color="var(--brand-red)" />
                                            <span style={{ fontSize: '0.6rem', color: 'var(--brand-red)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Flash Offer</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700, color: 'var(--brand-navy)', lineHeight: 1.2 }}>{discount.description}</h3>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 500 }}>
                                            Expires {new Date(discount.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleCopy(discount.coupon, discount.id)}
                                        disabled={discount.coupon === 'NONE'}
                                        style={{
                                            marginTop: '2.5rem',
                                            padding: '1.25rem',
                                            borderRadius: 'var(--radius-md)',
                                            background: copiedId === discount.id ? 'var(--brand-navy)' : 'var(--primary-light)',
                                            color: copiedId === discount.id ? 'white' : 'var(--brand-navy)',
                                            border: '1px solid rgba(26, 35, 126, 0.1)',
                                            cursor: discount.coupon === 'NONE' ? 'default' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {copiedId === discount.id ? <Check size={16} /> : <Copy size={16} />}
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {discount.coupon === 'NONE' ? 'Applied' : (copiedId === discount.id ? 'Copied' : 'Bag It')}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>
                                            {discount.coupon === 'NONE' ? '—' : discount.coupon}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StoreDetail;
