import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const [user, setUser] = useState(null);

    return (
        <div className="site-frame">
            <div className="site-inner">
                <Navbar user={user} onLogin={setUser} onLogout={() => setUser(null)} />
                <main style={{ flex: 1, position: 'relative' }}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
