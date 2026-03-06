import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapPin, Navigation, ChevronRight, Zap } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';
import { isFresh as checkFresh } from '../hooks/useStores';

// Haversine distance in km
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MapContent = ({ userLocation, measureStore }) => {
    const map = useMap();
    const polylineRef = useRef(null);

    useEffect(() => {
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        if (map && userLocation && measureStore) {
            const line = new window.google.maps.Polyline({
                path: [
                    { lat: userLocation.lat, lng: userLocation.lng },
                    { lat: measureStore.lat, lng: measureStore.lng },
                ],
                geodesic: true,
                strokeColor: '#E53935', // Brand Red
                strokeOpacity: 0.8,
                strokeWeight: 3,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 3,
                    },
                    offset: '0',
                    repeat: '15px',
                }],
            });
            line.setMap(map);
            polylineRef.current = line;

            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
            bounds.extend({ lat: measureStore.lat, lng: measureStore.lng });
            map.fitBounds(bounds, 100);
        }

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
            }
        };
    }, [map, userLocation, measureStore]);

    return null;
};

const StoreMap = ({ stores = [], onUserLocation, measureStore, onMeasureClear, searchQuery, dealsOnly }) => {
    const navigate = useNavigate();
    const { isMobile } = useWindowSize();
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 24.7471, lng: 90.4203 });
    const [mapZoom, setMapZoom] = useState(14);

    const mapStyles = [
        { "elementType": "geometry", "stylers": [{ "color": "#F8F9FA" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#F8F9FA" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#4A5568" }] },
        { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#E2E8F0" }] },
        { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#EDF2F7" }] },
        { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#E2E8F0" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#718096" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#FFFFFF" }] },
        { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#CBD5E0" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#C9E2FF" }] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4A5568" }] }
    ];

    const map = useMap();
    const clusterer = useRef(null);
    const [markers, setMarkers] = useState({});

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    useEffect(() => {
        if (clusterer.current) {
            clusterer.current.clearMarkers();
            clusterer.current.addMarkers(Object.values(markers));
        }
    }, [markers]);

    const handleMarkerRef = (id, marker) => {
        if (marker && markers[id]) return;
        if (!marker && !markers[id]) return;
        setMarkers((prev) => {
            if (marker) return { ...prev, [id]: marker };
            const newMarkers = { ...prev };
            delete newMarkers[id];
            return newMarkers;
        });
    };

    const handleFindMe = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation not supported');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const loc = { lat: latitude, lng: longitude };
                setUserLocation(loc);
                setMapCenter(loc);
                setMapZoom(15);
                if (onUserLocation) {
                    const distances = {};
                    stores.forEach(s => {
                        distances[s.id] = getDistanceKm(latitude, longitude, s.lat, s.lng);
                    });
                    onUserLocation({ ...loc, distances });
                }
                setIsLocating(false);
            },
            () => {
                setLocationError('Location access denied');
                setIsLocating(false);
            }
        );
    };

    const filteredStores = React.useMemo(() => {
        return stores.filter(store => {
            const searchLower = (searchQuery || '').toLowerCase();
            const matchesSearch = !searchQuery ||
                store.name.toLowerCase().includes(searchLower) ||
                (store.address && store.address.toLowerCase().includes(searchLower)) ||
                (store.tags || []).some(t => t.toLowerCase().includes(searchLower));

            const matchesDeals = !dealsOnly || store.discountPercent >= 50;

            return matchesSearch && matchesDeals;
        });
    }, [stores, searchQuery, dealsOnly]);

    useEffect(() => {
        if (!map || !searchQuery || filteredStores.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        filteredStores.forEach(store => {
            bounds.extend({ lat: store.lat, lng: store.lng });
        });

        if (filteredStores.length === 1) {
            map.setCenter({ lat: filteredStores[0].lat, lng: filteredStores[0].lng });
            map.setZoom(16);
        } else {
            map.fitBounds(bounds, 100);
        }
    }, [map, searchQuery, filteredStores]);

    const getMarkerColor = (percent) => {
        if (percent >= 70) return '#E53935'; // Urgent Red
        if (percent >= 50) return '#FF6D00'; // Deep Orange
        return '#FFAB00'; // Light Orange / Gold
    };

    const isFreshStore = (store) => checkFresh(store, 3);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Map
                zoom={mapZoom}
                center={mapCenter}
                onCameraChanged={(ev) => {
                    setMapCenter(ev.detail.center);
                    setMapZoom(ev.detail.zoom);
                }}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                styles={mapStyles}
                style={{ width: '100%', height: '100%' }}
                backgroundColor="#F8F9FA"
            >
                <MapContent userLocation={userLocation} measureStore={measureStore} />

                {filteredStores.map(store => {
                    const markerColor = getMarkerColor(store.discountPercent);
                    const size = store.discountPercent >= 70 ? 44 : store.discountPercent >= 50 ? 38 : 34;
                    const fresh = isFreshStore(store);

                    return (
                        <Marker
                            key={store.id}
                            ref={(m) => handleMarkerRef(store.id, m)}
                            position={{ lat: store.lat, lng: store.lng }}
                            onClick={() => setSelectedStore(store)}
                            title={`${store.name} - ${store.discountPercent}% OFF ${fresh ? '(JUST UPDATED)' : ''}`}
                            icon={{
                                path: 'M -18,-18 L 18,-18 L 18,12 L 4,12 L 0,18 L -4,12 L -18,12 Z',
                                fillColor: markerColor,
                                fillOpacity: 1,
                                strokeWeight: fresh ? 4 : 2,
                                strokeColor: fresh ? '#4299E1' : '#FFFFFF', // Blue stroke for fresh deals
                                scale: size / 36,
                                labelOrigin: window.google ? new window.google.maps.Point(0, -3) : null,
                            }}
                            label={{
                                text: `${store.discountPercent}%`,
                                color: 'white',
                                fontSize: `${size / 3}px`,
                                fontWeight: '900',
                            }}
                        />
                    );
                })}

                {userLocation && (
                    <Marker
                        position={userLocation}
                        zIndex={100}
                        icon={{
                            path: window.google ? window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW : '',
                            fillColor: '#4299E1', // Vibrant Blue for User
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: '#FFFFFF',
                            scale: 6,
                        }}
                    />
                )}

                {selectedStore && (
                    <InfoWindow
                        position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                        onCloseClick={() => setSelectedStore(null)}
                    >
                        {(() => {
                            let distanceText = null;
                            if (userLocation) {
                                const dist = getDistanceKm(userLocation.lat, userLocation.lng, selectedStore.lat, selectedStore.lng);
                                distanceText = `${dist >= 1 ? dist.toFixed(1) + ' km' : Math.round(dist * 1000) + ' m'} away`;
                            }

                            return (
                                <div style={{
                                    padding: '0.25rem',
                                    maxWidth: '280px',
                                    background: 'white',
                                    color: 'var(--brand-navy)',
                                    fontFamily: 'var(--font-body)',
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'relative', height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <img
                                            src={selectedStore.imageUrl}
                                            alt={selectedStore.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute', top: '0.75rem', left: '0.75rem',
                                            background: getMarkerColor(selectedStore.discountPercent), color: 'white',
                                            padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 900,
                                            borderRadius: '8px', textTransform: 'uppercase', boxShadow: 'var(--shadow-red)'
                                        }}>
                                            {selectedStore.discountPercent}% OFF
                                        </div>

                                        {isFreshStore(selectedStore) && (
                                            <div style={{
                                                position: 'absolute', top: '0.75rem', right: '0.75rem',
                                                background: '#4299E1', color: 'white',
                                                padding: '0.4rem 0.6rem', fontSize: '0.6rem', fontWeight: 900,
                                                borderRadius: '8px', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                                boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                                            }}>
                                                <Zap size={10} fill="white" /> Just Updated
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ padding: '0 0.75rem 0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <Zap size={12} color={getMarkerColor(selectedStore.discountPercent)} fill={getMarkerColor(selectedStore.discountPercent)} />
                                            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 850, color: getMarkerColor(selectedStore.discountPercent) }}>
                                                Verified Boutique
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.25rem', lineHeight: 1, color: 'var(--brand-navy)' }}>
                                            {selectedStore.name}
                                        </h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: distanceText ? '0.25rem' : '1.25rem', fontWeight: 500 }}>
                                            {selectedStore.address.split(',')[0]}
                                        </p>

                                        {distanceText && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem', color: 'var(--brand-red)' }}>
                                                <Navigation size={12} fill="currentColor" />
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{distanceText}</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => navigate(`/store/${selectedStore.id}`)}
                                            style={{
                                                width: '100%',
                                                padding: '0.9rem',
                                                background: 'var(--brand-navy)',
                                                color: 'white',
                                                border: 'none',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                fontWeight: 850,
                                                cursor: 'pointer',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: 'var(--shadow-navy)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Explore Deals <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </InfoWindow>
                )}
            </Map>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: isMobile ? 'auto' : '1.5rem',
                bottom: isMobile ? '1.5rem' : 'auto',
                right: isMobile ? '1.25rem' : '1.5rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <button
                    onClick={handleFindMe}
                    title="Find my location"
                    style={{
                        width: isMobile ? '56px' : '48px', // Larger for mobile tap
                        height: isMobile ? '56px' : '48px',
                        background: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        color: 'var(--brand-red)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Navigation size={isMobile ? 24 : 20} fill="currentColor" />
                </button>
            </div>

            {locationError && (
                <div style={{
                    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--brand-navy)', color: 'white', padding: '0.75rem 1.5rem',
                    fontSize: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 700,
                    boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {locationError}
                </div>
            )}
        </div>
    );
};

export default StoreMap;
