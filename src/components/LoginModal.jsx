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
        // get a name from the form if sign up, else dummy name
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
                style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', borderRadius: 'var(--radius-xl)' }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', padding: '0.25rem' }}
                    className="btn-ghost"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🛍️</div>
                    <h2 style={{ fontSize: '1.5rem' }}>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {isSignUp ? 'Join to unlock exclusive local deals' : 'Login to save stores & get exclusive deals'}
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem', marginBottom: '1.5rem' }}>
                    {[{ id: TAB_EMAIL, label: 'Email', Icon: Mail }, { id: TAB_PHONE, label: 'Phone/OTP', Icon: Phone }].map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            style={{
                                flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                                borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600,
                                background: tab === id ? 'white' : 'transparent',
                                color: tab === id ? 'var(--primary-color)' : 'var(--text-muted)',
                                boxShadow: tab === id ? 'var(--shadow-sm)' : 'none',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                {tab === TAB_EMAIL ? (
                    <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isSignUp && (
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                    <input type="text" placeholder="John Doe" className="input-field" style={{ paddingLeft: '2.4rem' }} required disabled={isEmailLoading} />
                                </div>
                            </div>
                        )}
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input type="email" placeholder="you@example.com" className="input-field" style={{ paddingLeft: '2.4rem' }} required disabled={isEmailLoading} />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Password
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); alert("A password reset link would be sent to your email!"); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input type="password" placeholder="••••••••" className="input-field" style={{ paddingLeft: '2.4rem' }} required disabled={isEmailLoading} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={isEmailLoading}>
                            {isEmailLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                            {isEmailLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {isSignUp && (
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                    <input type="text" placeholder="John Doe" className="input-field" style={{ paddingLeft: '2.4rem' }} required disabled={isPhoneLoading} />
                                </div>
                            </div>
                        )}
                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input type="tel" placeholder="+880 1XXX-XXXXXX" className="input-field" style={{ paddingLeft: '2.4rem' }} required disabled={isPhoneLoading} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} disabled={isPhoneLoading}>
                            {isPhoneLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                            {isPhoneLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                    <hr className="divider" style={{ flex: 1 }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>or</span>
                    <hr className="divider" style={{ flex: 1 }} />
                </div>

                {/* Google Login */}
                <button
                    className="btn btn-outline"
                    style={{ width: '100%', gap: '0.5rem', padding: '0.7rem' }}
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                >
                    {isGoogleLoading ? (
                        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    )}
                    {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); }}
                        style={{ color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                    >
                        {isSignUp ? "Log in instead" : "Sign up free"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
