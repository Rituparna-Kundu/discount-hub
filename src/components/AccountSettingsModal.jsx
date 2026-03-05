import React, { useState } from 'react';
import { X, User, Mail, Lock, Bell, Camera } from 'lucide-react';

const AccountSettingsModal = ({ isOpen, onClose, user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || user?.phone || '');
    const [notifications, setNotifications] = useState(true);

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        if (onUpdateUser) {
            onUpdateUser({ ...user, name, email });
        }
        alert('Updates saved to your profile.');
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(253, 251, 247, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    display: 'flex',
                    flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}
                className="animate-fade-in"
            >
                {/* Sidebar */}
                <div style={{
                    width: window.innerWidth < 640 ? '100%' : '220px',
                    borderRight: window.innerWidth < 640 ? 'none' : '1px solid var(--border-color)',
                    borderBottom: window.innerWidth < 640 ? '1px solid var(--border-color)' : 'none',
                    padding: '2.5rem 1.5rem',
                    background: 'var(--bg-alt)'
                }}>
                    <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-light)', marginBottom: '2.5rem' }}>My Account</h3>
                    <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'row' : 'column', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { id: 'profile', label: 'Profile', Icon: User },
                            { id: 'security', label: 'Security', Icon: Lock },
                            { id: 'notifications', label: 'Preferences', Icon: Bell }
                        ].map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                    border: 'none', background: activeTab === id ? 'white' : 'transparent',
                                    color: activeTab === id ? 'var(--text-main)' : 'var(--text-light)',
                                    fontSize: '0.8rem', fontWeight: activeTab === id ? 700 : 400,
                                    cursor: 'pointer', textAlign: 'left',
                                    borderLeft: window.innerWidth >= 640 && activeTab === id ? '2px solid var(--text-main)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Icon size={14} strokeWidth={activeTab === id ? 2.5 : 2} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, padding: '3.5rem 3rem', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>

                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Edit Selection</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem', fontWeight: 300 }}>Manage your personal identification and presentation.</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: 'var(--bg-alt)',
                                    color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', border: '1px solid var(--border-color)', position: 'relative'
                                }}>
                                    {name ? name.charAt(0).toUpperCase() : 'U'}
                                    <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--text-main)', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Camera size={12} />
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity Image</div>
                            </div>

                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Personal Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Contact Reference</label>
                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required />
                                </div>
                                <button type="submit" style={{ alignSelf: 'flex-start', background: 'var(--text-main)', color: 'white', border: 'none', padding: '1rem 3rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', marginTop: '1rem' }}>
                                    Update Identity
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Security Access</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem', fontWeight: 300 }}>Maintain the integrity of your personal access keys.</p>

                            <form onSubmit={(e) => { e.preventDefault(); alert("Access updated."); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Existing Key</label>
                                    <input type="password" placeholder="••••••••" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>New Authorization Key</label>
                                    <input type="password" placeholder="••••••••" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required />
                                </div>
                                <button type="submit" style={{ alignSelf: 'flex-start', background: 'var(--text-main)', color: 'white', border: 'none', padding: '1rem 3rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', marginTop: '1rem' }}>
                                    Confirm Key Update
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Signal Feed</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem', fontWeight: 300 }}>Determine which seasonal alerts reach your device.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.25rem' }}>Direct Dispatch</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Receive real-time alerts for local boutique deals.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={() => setNotifications(!notifications)}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--text-main)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.25rem' }}>Weekly Digest</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>A curated editorial look at the city’s top collections.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsModal;
