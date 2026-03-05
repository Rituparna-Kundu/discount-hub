import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Sparkles, Heart } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';

const Footer = () => {
    const { isMobile } = useWindowSize();

    return (
        <footer style={{
            background: 'var(--brand-navy)',
            color: 'white',
            padding: '6rem 0 3rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Gradient */}
            <div style={{
                position: 'absolute', top: '0', right: '0', width: '40%', height: '100%',
                background: 'var(--brand-red)', opacity: 0.05, filter: 'blur(100px)', transform: 'rotate(-15deg)'
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1.2fr',
                    gap: isMobile ? '3rem' : '4rem',
                    marginBottom: '5rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--grad-brand)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                <Sparkles size={20} color="white" />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Hub<span style={{ color: 'var(--brand-red)' }}>.</span>
                            </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
                            Mymensingh's premier digital destination for curated boutique discoveries and exclusive local rewards.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.05)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: 'white',
                                    transition: 'background 0.3s ease', border: '1px solid rgba(255,255,255,0.1)'
                                }} onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-red)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem', fontWeight: 800, color: 'var(--brand-red)' }}>Directory</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Boutiques</Link></li>
                            <li><Link to="/map" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Active Radar</Link></li>
                            <li><Link to="/notifications" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Latest Dispatch</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem', fontWeight: 800, color: 'var(--brand-red)' }}>Account</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/favorites" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Your Bag</Link></li>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Member Login</a></li>
                            <li><a href="#" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Register Store</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem', fontWeight: 800, color: 'var(--brand-red)' }}>Concierge</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <MapPin size={16} color="var(--brand-red)" />
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                    Mymensingh City Center, 2200<br />Bangladesh
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Phone size={16} color="var(--brand-red)" />
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>+880 1700-000000</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    paddingTop: '3rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 500
                }}>
                    <div>© 2026 Mymensingh Discount Hub. All Rights Reserved.</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Crafted with <Heart size={10} fill="var(--brand-red)" color="transparent" /> in Mymensingh
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
