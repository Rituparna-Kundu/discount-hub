import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, Bell, Settings, LogOut, Home, Map as MapIcon } from 'lucide-react';
import LoginModal from './LoginModal';
import AccountSettingsModal from './AccountSettingsModal';
import { useAppContext } from '../context/AppContext';
import { useWindowSize } from '../hooks/useWindowSize';
import { useStores } from '../hooks/useStores';

const Navbar = ({ user, onLogin, onLogout }) => {
    const { searchQuery, setSearchQuery, favorites } = useAppContext();
    const { isMobile } = useWindowSize();
    const { stores } = useStores();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.trim().length > 0) {
            const results = stores.filter(s =>
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.address.toLowerCase().includes(q.toLowerCase()) ||
                (s.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))
            );
            setSearchResults(results);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
            setSearchResults([]);
        }
    };

    const handleSelectResult = (store) => {
        setShowDropdown(false);
        setSearchQuery('');
        navigate(`/store/${store.id}`);
    };

    // ── Shared nav items — identical on mobile and desktop ───────────────────
    const NAV_ITEMS = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/map', icon: MapIcon, label: 'Map' },
        { to: '/favorites', icon: Heart, label: 'Bag', badge: favorites.length },
        {
            action: user ? () => setIsSettingsOpen(true) : () => setIsLoginOpen(true),
            icon: User,
            label: user ? 'Account' : 'Login',
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════
                DESKTOP NAV
            ═══════════════════════════════════════════════════════════════ */}
            {!isMobile && (
                <nav className="glass" style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    padding: '1rem 0',
                    borderBottom: '1px solid rgba(26, 35, 126, 0.1)',
                }}>
                    <div className="container flex items-center justify-between">

                        {/* Logo */}
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, textDecoration: 'none' }}>
                            <div style={{
                                background: 'white', padding: '4px', borderRadius: '10px',
                                boxShadow: 'var(--shadow-red)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <img src="/logo.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', lineHeight: 1 }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-logo-en)', color: 'var(--brand-navy)', letterSpacing: '-0.02em' }}>Discount</span>
                                    <span style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-logo-bn)', color: 'var(--brand-red)' }}>খুঁজি</span>
                                </div>
                                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-light)', marginTop: '2px', fontWeight: 700 }}>Mymensingh Hub</span>
                            </div>
                        </Link>

                        {/* Search */}
                        <div style={{ position: 'relative', flex: 1, maxWidth: '440px', margin: '0 3rem' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                background: 'var(--primary-light)', padding: '0.5rem 1.25rem',
                                borderRadius: 'var(--radius-full)', border: '1px solid transparent',
                            }}>
                                <Search size={16} color="var(--brand-blue)" />
                                <input
                                    type="text"
                                    placeholder="Search the directory..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{
                                        width: '100%', background: 'transparent', border: 'none',
                                        padding: '0 0.75rem', fontSize: '0.85rem',
                                        outline: 'none', color: 'var(--text-main)', fontWeight: 450
                                    }}
                                />
                            </div>
                            {showDropdown && searchResults.length > 0 && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
                                    background: 'white', borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                                    zIndex: 200, overflow: 'hidden'
                                }}>
                                    {searchResults.slice(0, 5).map(store => (
                                        <button
                                            key={store.id}
                                            onClick={() => handleSelectResult(store)}
                                            style={{
                                                width: '100%', padding: '1rem', display: 'flex', gap: '1rem',
                                                alignItems: 'center', border: 'none', background: 'none',
                                                cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--bg-alt)'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-light)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                        >
                                            <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                                <img src={store.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-navy)' }}>{store.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{store.category}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop nav items — same labels as mobile */}
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            {NAV_ITEMS.map((item, idx) => {
                                const Icon = item.icon;
                                const active = item.to ? isActive(item.to) : false;

                                // Account item with dropdown
                                if (!item.to && user) {
                                    return (
                                        <div key={idx} style={{ position: 'relative' }} ref={profileMenuRef}>
                                            <button
                                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                                style={{
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: 'var(--brand-navy)'
                                                }}
                                            >
                                                <div style={{
                                                    width: '22px', height: '22px', borderRadius: '50%',
                                                    background: 'var(--brand-navy)', color: 'white',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', fontWeight: 800
                                                }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: '0.6rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account</span>
                                            </button>
                                            {showProfileMenu && (
                                                <div className="glass" style={{
                                                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                                                    padding: '0.75rem 0', width: '200px',
                                                    display: 'flex', flexDirection: 'column',
                                                    zIndex: 110, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'
                                                }}>
                                                    <button onClick={() => { setShowProfileMenu(false); navigate('/favorites'); }} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-navy)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Heart size={16} /> Favorites
                                                    </button>
                                                    <button onClick={() => { setShowProfileMenu(false); setIsSettingsOpen(true); }} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-navy)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <Settings size={16} /> Settings
                                                    </button>
                                                    <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
                                                    <button onClick={onLogout} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                const inner = (
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                                        color: active ? 'var(--brand-red)' : 'var(--brand-navy)',
                                        position: 'relative'
                                    }}>
                                        <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                                        <span style={{ fontSize: '0.6rem', fontWeight: active ? 800 : 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
                                        {item.badge > 0 && (
                                            <span style={{
                                                position: 'absolute', top: -4, right: -6,
                                                background: 'var(--brand-red)', color: 'white',
                                                fontSize: '0.5rem', width: '14px', height: '14px',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
                                            }}>{item.badge}</span>
                                        )}
                                    </div>
                                );

                                return item.to ? (
                                    <Link key={idx} to={item.to} style={{ textDecoration: 'none' }}>{inner}</Link>
                                ) : (
                                    <button key={idx} onClick={item.action} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{inner}</button>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MOBILE TOP HEADER
            ═══════════════════════════════════════════════════════════════ */}
            {isMobile && (
                <div className="glass" style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    padding: '0.75rem var(--container-padding)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(26, 35, 126, 0.05)'
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <div style={{ background: 'white', padding: '3px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(229,57,53,0.1)' }}>
                            <img src="/logo.png" alt="Logo" style={{ height: '26px', width: 'auto' }} />
                        </div>
                        {/* Full name — same as desktop */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
                            <span style={{ fontFamily: 'var(--font-logo-en)', fontSize: '1.05rem', fontWeight: 900, color: 'var(--brand-navy)', letterSpacing: '-0.02em' }}>Discount</span>
                            <span style={{ fontFamily: 'var(--font-logo-bn)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--brand-red)' }}>খুঁজি</span>
                        </div>
                    </Link>
                    <Link to="/notifications" style={{ position: 'relative', color: 'var(--brand-navy)' }}>
                        <Bell size={22} strokeWidth={1.5} />
                        <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--brand-red)', borderRadius: '50%', border: '1.5px solid white' }} />
                    </Link>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MOBILE BOTTOM BAR
            ═══════════════════════════════════════════════════════════════ */}
            {isMobile && (
                <div className="glass" style={{
                    position: 'fixed', bottom: '1.5rem',
                    left: 'var(--container-padding)', right: 'var(--container-padding)',
                    height: '4.5rem', borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                    padding: '0 1rem', zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255,255,255,0.4)'
                }}>
                    {NAV_ITEMS.map((item, idx) => {
                        const Icon = item.icon;
                        const active = item.to ? isActive(item.to) : false;

                        // Mobile Account item with drop-up menu
                        if (!item.to && user) {
                            return (
                                <div key={idx} style={{ position: 'relative' }} ref={profileMenuRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--brand-navy)'
                                        }}
                                    >
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%',
                                            background: 'var(--brand-navy)', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.6rem', fontWeight: 800, marginBottom: '2px'
                                        }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</span>
                                    </button>

                                    {/* Mobile Drop-up Menu */}
                                    {showProfileMenu && (
                                        <div className="glass" style={{
                                            position: 'absolute', bottom: 'calc(100% + 15px)', right: -10,
                                            padding: '0.5rem 0', width: '180px',
                                            display: 'flex', flexDirection: 'column',
                                            zIndex: 110, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            transformOrigin: 'bottom right',
                                            animation: 'slideUp 0.2s ease forwards'
                                        }}>
                                            <button onClick={() => { setShowProfileMenu(false); navigate('/favorites'); }} style={{ padding: '0.8rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-navy)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Heart size={16} /> Favorites
                                            </button>
                                            <button onClick={() => { setShowProfileMenu(false); setIsSettingsOpen(true); }} style={{ padding: '0.8rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--brand-navy)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Settings size={16} /> Settings
                                            </button>
                                            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }} />
                                            <button onClick={() => { setShowProfileMenu(false); onLogout(); }} style={{ padding: '0.8rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const inner = (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                                color: active ? 'var(--brand-red)' : 'var(--brand-navy)',
                                position: 'relative'
                            }}>
                                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                                <span style={{ fontSize: '0.6rem', fontWeight: active ? 800 : 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                                {item.badge > 0 && (
                                    <span style={{
                                        position: 'absolute', top: -4, right: -4,
                                        background: 'var(--brand-red)', color: 'white',
                                        fontSize: '0.5rem', width: '14px', height: '14px',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
                                    }}>{item.badge}</span>
                                )}
                            </div>
                        );

                        return item.to ? (
                            <Link key={idx} to={item.to} style={{ textDecoration: 'none' }}>{inner}</Link>
                        ) : (
                            <button key={idx} onClick={item.action} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{inner}</button>
                        );
                    })}
                </div>
            )}

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={(userData) => { onLogin(userData); setIsLoginOpen(false); }} />
            <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onUpdateUser={onLogin} />
        </>
    );
};

export default Navbar;
