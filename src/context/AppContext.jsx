import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Favorites persistence
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('mymensingh_hub_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Global Search & Category
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // User Location
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        localStorage.setItem('mymensingh_hub_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (storeId) => {
        setFavorites(prev =>
            prev.includes(storeId)
                ? prev.filter(id => id !== storeId)
                : [...prev, storeId]
        );
    };

    const isFavorite = (storeId) => favorites.includes(storeId);

    return (
        <AppContext.Provider value={{
            favorites,
            toggleFavorite,
            isFavorite,
            searchQuery,
            setSearchQuery,
            activeCategory,
            setActiveCategory,
            userLocation,
            setUserLocation
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
