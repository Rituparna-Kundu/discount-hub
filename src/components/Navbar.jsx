import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Tag, X, User, Heart, Bell, Settings, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import AccountSettingsModal from './AccountSettingsModal';
import { mockStores } from '../mockData';

const Navbar = ({ user, onLogin, onLogout }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    // Close profile menu if clicked outside
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
            const results = mockStores.filter(s =>
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.address.toLowerCase().includes(q.toLowerCase()) ||
                s.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
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

    const clearSearch = () => {
        setSearchQuery('');
        setShowDropdown(false);
        setSearchResults([]);
    };

    return (
        <>
            <nav style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '0.875rem 0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}>
                {/* Red Brand Accent Line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: 'var(--primary-color)',
                }} />

                <div className="container flex items-center justify-between" style={{ gap: '1rem' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0, textDecoration: 'none' }}>
                        <img
                            src="/logo.png"
                            alt="Discount খুঁজি Logo"
                            style={{
                                height: '38px',
                                width: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(229, 57, 53, 0.15)'
                            }}
                        />
                        <div>
                            <span style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.15rem',
                                lineHeight: 1,
                            }}>
                                <span style={{
                                    fontSize: '1.35rem', fontWeight: 800,
                                    fontFamily: 'var(--font-logo-en)',
                                    letterSpacing: '0.01em',
                                    color: 'var(--text-main)',
                                }}>
                                    Discount
                                </span>
                                <span style={{
                                    fontSize: '1.5rem', fontWeight: 700,
                                    fontFamily: 'var(--font-logo-bn)',
                                    letterSpacing: '0em',
                                    color: 'var(--primary-color)',
                                }}>
                                    খুঁজি
                                </span>
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div style={{ flex: 1, maxWidth: '500px', position: 'relative', margin: '0 1.5rem' }}>
                        <Search size={16} style={{
                            position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
                            color: 'var(--text-muted)', pointerEvents: 'none'
                        }} />
                        <input
                            type="text"
                            placeholder="Search stores, brands, categories..."
                            value={searchQuery}
                            onChange={handleSearch}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                            onFocus={() => searchQuery && setShowDropdown(true)}
                            className="input-field"
                            style={{
                                paddingLeft: '2.8rem', paddingRight: '2.5rem',
                                borderRadius: 'var(--radius-full)', fontSize: '0.9rem', height: '2.75rem',
                                background: 'var(--bg-color)',
                                border: '1.5px solid transparent',
                            }}
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} style={{
                                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--text-muted)', padding: '0.125rem',
                                background: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px'
                            }}>
                                <X size={12} strokeWidth={3} />
                            </button>
                        )}

                        {/* Dropdown */}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                boxShadow: 'var(--shadow-lg)',
                                overflow: 'hidden', zIndex: 200,
                            }}>
                                {searchResults.length === 0 ? (
                                    <div style={{
                                        padding: '1.25rem', color: 'var(--text-muted)',
                                        fontSize: '0.9rem', textAlign: 'center', fontWeight: 500
                                    }}>No stores found 🔍</div>
                                ) : searchResults.map(store => (
                                    <div
                                        key={store.id}
                                        onMouseDown={() => handleSelectResult(store)}
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '0.875rem 1.25rem', cursor: 'pointer',
                                            transition: 'background var(--transition-fast)',
                                            borderBottom: '1px solid var(--border-color)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>{store.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{store.address.split(',')[0]}</div>
                                        </div>
                                        <span className="badge badge-discount">{store.topDiscount}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions / User Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        {user ? (
                            <div style={{ position: 'relative' }} ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary-color), #D32F2F)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.1rem', fontWeight: 800, border: '2px solid white',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer',
                                        fontFamily: 'var(--font-heading)',
                                    }}
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </button>

                                {showProfileMenu && (
                                    <div style={{
                                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                                        background: 'white', borderRadius: 'var(--radius-lg)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)',
                                        width: '220px', overflow: 'hidden', zIndex: 200,
                                        animation: 'fadeInUp 0.2s ease-out'
                                    }}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>{user.name || 'User'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email || user.phone}</div>
                                        </div>

                                        <div style={{ padding: '0.5rem 0' }}>
                                            <button
                                                onClick={() => { setShowProfileMenu(false); navigate('/favorites'); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    color: 'var(--text-main)', textAlign: 'left',
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Heart size={16} strokeWidth={2.5} style={{ color: '#E91E63' }} /> Favorite Shops
                                            </button>
                                            <button
                                                onClick={() => { setShowProfileMenu(false); navigate('/notifications'); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    color: 'var(--text-main)', textAlign: 'left',
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Bell size={16} strokeWidth={2.5} style={{ color: '#FF9800' }} /> Deal Notifications
                                            </button>
                                            <button
                                                onClick={() => { setShowProfileMenu(false); setIsSettingsOpen(true); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    color: 'var(--text-main)', textAlign: 'left',
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Settings size={16} strokeWidth={2.5} style={{ color: 'var(--text-muted)' }} /> Account Settings
                                            </button>

                                            <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                                            <button
                                                onClick={() => { setShowProfileMenu(false); onLogout(); }}
                                                style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600,
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    color: '#E53935', textAlign: 'left',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#ffebee'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <LogOut size={16} strokeWidth={2.5} /> Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsLoginOpen(true)}
                                style={{ padding: '0.55rem 1.4rem' }}
                            >
                                <User size={16} />
                                <span className="hide-mobile">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={(userData) => { onLogin(userData); setIsLoginOpen(false); }} />
            <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onUpdateUser={onLogin} />
        </>
    );
};

export default Navbar;
