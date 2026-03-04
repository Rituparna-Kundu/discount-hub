import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const [user, setUser] = useState(null);

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-color" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Navbar user={user} onLogin={setUser} onLogout={() => setUser(null)} />
            <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
