import React, { useState } from 'react';
import { X, User, Mail, Lock, Bell, Store } from 'lucide-react';

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
        alert('Settings saved successfully!');
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(6px)',
                padding: '1rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="card animate-fade-in"
                style={{ width: '100%', maxWidth: '550px', display: 'flex', overflow: 'hidden', padding: 0, borderRadius: 'var(--radius-xl)' }}
            >
                {/* Sidebar */}
                <div style={{ width: '180px', background: 'var(--bg-color)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Settings</h3>
                    </div>
                    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                        <button
                            onClick={() => setActiveTab('profile')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem',
                                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                                background: activeTab === 'profile' ? 'var(--accent-light)' : 'transparent',
                                color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-main)',
                                fontWeight: activeTab === 'profile' ? 700 : 500, fontSize: '0.9rem', textAlign: 'left'
                            }}
                        >
                            <User size={16} /> Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem',
                                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                                background: activeTab === 'security' ? 'var(--accent-light)' : 'transparent',
                                color: activeTab === 'security' ? 'var(--primary-color)' : 'var(--text-main)',
                                fontWeight: activeTab === 'security' ? 700 : 500, fontSize: '0.9rem', textAlign: 'left'
                            }}
                        >
                            <Lock size={16} /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem',
                                borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                                background: activeTab === 'notifications' ? 'var(--accent-light)' : 'transparent',
                                color: activeTab === 'notifications' ? 'var(--primary-color)' : 'var(--text-main)',
                                fontWeight: activeTab === 'notifications' ? 700 : 500, fontSize: '0.9rem', textAlign: 'left'
                            }}
                        >
                            <Bell size={16} /> Notifications
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, padding: '2rem', position: 'relative' }}>
                    {/* Close */}
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', padding: '0.25rem' }}
                        className="btn-ghost"
                    >
                        <X size={20} />
                    </button>

                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Public Profile</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Change personal details associated with your account.</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary-color), #D32F2F)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
                                    boxShadow: '0 4px 12px rgba(229, 57, 53, 0.25)'
                                }}>
                                    {name ? name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Upload new photo</button>
                            </div>

                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" style={{ paddingLeft: '2.4rem' }} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email or Phone</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '2.4rem' }} required />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Change Password</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Ensure your account is using a long, random password to stay secure.</p>

                            <form onSubmit={(e) => { e.preventDefault(); alert("Password updated successfully!"); onClose(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Current Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        <input type="password" placeholder="••••••••" className="input-field" style={{ paddingLeft: '2.4rem' }} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        <input type="password" placeholder="••••••••" className="input-field" style={{ paddingLeft: '2.4rem' }} required />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Must be at least 8 characters long.</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Update Password</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Notification Preferences</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Choose what alerts you want to receive about discounts.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                                    <input
                                        type="checkbox"
                                        id="push-notif"
                                        checked={notifications}
                                        onChange={() => setNotifications(!notifications)}
                                        style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
                                    />
                                    <div>
                                        <label htmlFor="push-notif" style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem', cursor: 'pointer' }}>Deal Alerts & Ending Soon</label>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Get notified when massive discounts (50%+) happen near you or when favored coupons are expiring.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
                                    <input
                                        type="checkbox"
                                        id="email-notif"
                                        style={{ marginTop: '0.25rem', width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
                                    />
                                    <div>
                                        <label htmlFor="email-notif" style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem', cursor: 'pointer' }}>Weekly Newsletter</label>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>A weekly roundup of the best ongoing clothing sales in Mymensingh.</p>
                                    </div>
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
