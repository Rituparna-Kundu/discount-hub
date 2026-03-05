import React, { useState } from 'react';
import { X, Mail, Lock, Phone, Loader2, User } from 'lucide-react';

const TAB_EMAIL = 'email';
const TAB_PHONE = 'phone';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [tab, setTab] = useState(TAB_EMAIL);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isPhoneLoading, setIsPhoneLoading] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsEmailLoading(true);
        const nameField = e.target.querySelector('input[type="text"]');
        const emailField = e.target.querySelector('input[type="email"]');
        const userName = isSignUp && nameField ? nameField.value : 'Guest User';
        const userEmail = emailField ? emailField.value : '';

        setTimeout(() => {
            setIsEmailLoading(false);
            if (onLogin) onLogin({ name: userName, email: userEmail });
        }, 1500);
    };

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        setIsPhoneLoading(true);
        const nameField = e.target.querySelector('input[type="text"]');
        const phoneField = e.target.querySelector('input[type="tel"]');
        const userName = isSignUp && nameField ? nameField.value : 'Guest User';
        const userPhone = phoneField ? phoneField.value : '';

        setTimeout(() => {
            setIsPhoneLoading(false);
            if (onLogin) onLogin({ name: userName, phone: userPhone });
        }, 1500);
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        setTimeout(() => {
            setIsGoogleLoading(false);
            if (onLogin) onLogin({ name: 'Google User', email: 'account@google.com' });
        }, 1500);
    };

    if (!isOpen) return null;

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
                    maxWidth: '440px',
                    padding: '3.5rem 3rem',
                    position: 'relative',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.05)'
                }}
                className="animate-fade-in"
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Member Access
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                        {isSignUp ? 'Join the Hub' : 'Welcome Back'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 300 }}>
                        {isSignUp ? 'Unlock exclusive access to the city’s finest deals.' : 'Sign in to access your curated boutique list.'}
                    </p>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
                    {[{ id: TAB_EMAIL, label: 'Email' }, { id: TAB_PHONE, label: 'Phone' }].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            style={{
                                flex: 1, padding: '1rem',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontWeight: 700,
                                color: tab === id ? 'var(--text-main)' : 'var(--text-light)',
                                borderBottom: tab === id ? '2px solid var(--text-main)' : 'none',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {tab === TAB_EMAIL ? (
                    <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {isSignUp && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Full Name</label>
                                <input type="text" placeholder="Alex Standard" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required disabled={isEmailLoading} />
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Email Address</label>
                            <input type="email" placeholder="alex@standard.com" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required disabled={isEmailLoading} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                                Password
                                {!isSignUp && (
                                    <button type="button" onClick={() => alert("Reset link sent.")} style={{ background: 'none', border: 'none', fontSize: '0.6rem', color: 'var(--text-light)', textTransform: 'uppercase', cursor: 'pointer' }}>Forgot?</button>
                                )}
                            </label>
                            <input type="password" placeholder="••••••••" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required disabled={isEmailLoading} />
                        </div>
                        <button type="submit" style={{ width: '100%', marginTop: '1rem', background: 'var(--text-main)', color: 'white', border: 'none', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={isEmailLoading}>
                            {isEmailLoading ? <Loader2 size={16} className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {isSignUp && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Full Name</label>
                                <input type="text" placeholder="Alex Standard" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required disabled={isPhoneLoading} />
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Phone Number</label>
                            <input type="tel" placeholder="+880 1XXX-XXXXXX" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', outline: 'none', fontSize: '0.9rem' }} required disabled={isPhoneLoading} />
                        </div>
                        <button type="submit" style={{ width: '100%', marginTop: '1rem', background: 'var(--text-main)', color: 'white', border: 'none', padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={isPhoneLoading}>
                            {isPhoneLoading ? <Loader2 size={16} className="animate-spin" /> : 'Request OTP'}
                        </button>
                    </form>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <button
                    style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', padding: '0.875rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google Account
                </button>

                <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.75rem', color: 'var(--text-light)', letterSpacing: '0.05em' }}>
                    {isSignUp ? "Already a member? " : "New to the Hub? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                        {isSignUp ? "Sign In" : "Register Now"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
