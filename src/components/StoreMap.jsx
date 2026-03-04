import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { mockStores } from '../mockData';

// Haversine distance in km
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Inner component that has access to the map instance (via useMap)
const MapContent = ({ userLocation, measureStore }) => {
    const map = useMap();
    const polylineRef = useRef(null);

    useEffect(() => {
        // Clear existing polyline
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
            polylineRef.current = null;
        }

        // Draw new polyline if both user location and measure store are set
        if (map && userLocation && measureStore) {
            const line = new window.google.maps.Polyline({
                path: [
                    { lat: userLocation.lat, lng: userLocation.lng },
                    { lat: measureStore.lat, lng: measureStore.lng },
                ],
                geodesic: true,
                strokeColor: '#2563eb',
                strokeOpacity: 0,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        strokeColor: '#2563eb',
                        scale: 4,
                    },
                    offset: '0',
                    repeat: '20px',
                }],
            });
            line.setMap(map);
            polylineRef.current = line;

            // Fit map to show both points
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
            bounds.extend({ lat: measureStore.lat, lng: measureStore.lng });
            map.fitBounds(bounds, 80);
        }

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
        };
    }, [map, userLocation, measureStore]);

    return null;
};

const StoreMap = ({ onUserLocation, measureStore, onMeasureClear }) => {
    const navigate = useNavigate();

    const [userLocation, setUserLocation] = useState(null);
    const [userLocationLabel, setUserLocationLabel] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);

    const [mapCenter, setMapCenter] = useState({ lat: 24.7471, lng: 90.4203 });
    const [mapZoom, setMapZoom] = useState(14);

    const placeUserMarker = (lat, lng, label) => {
        setUserLocation({ lat, lng });
        setUserLocationLabel(label || 'Your Location');
        setMapCenter({ lat, lng });
        setMapZoom(15);

        if (onUserLocation) {
            const distances = {};
            mockStores.forEach(store => {
                distances[store.id] = getDistanceKm(lat, lng, store.lat, store.lng);
            });
            onUserLocation({ lat, lng, distances });
        }
    };

    const handleFindMe = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation not supported by your browser.');
            return;
        }
        setIsLocating(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                placeUserMarker(latitude, longitude, 'You are here');
                setIsLocating(false);
            },
            () => {
                setLocationError('Could not get your location. Please allow location access.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Distance for the measurement banner
    const measureDist = (measureStore && userLocation)
        ? getDistanceKm(userLocation.lat, userLocation.lng, measureStore.lat, measureStore.lng)
        : null;

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
                style={{ width: '100%', height: '100%' }}
            >
                {/* Polyline renderer (needs useMap) */}
                <MapContent userLocation={userLocation} measureStore={measureStore} onMeasureClear={onMeasureClear} />

                {/* Store Markers */}
                {mockStores.map(store => (
                    <Marker
                        key={store.id}
                        position={{ lat: store.lat, lng: store.lng }}
                        onClick={() => setSelectedStore(store)}
                        title={store.name}
                        label={{
                            text: '🏷️ ' + store.topDiscount,
                            className: 'google-map-marker-label',
                            color: '#ffffff',
                            fontWeight: 'bold',
                        }}
                    />
                ))}

                {/* User Location Marker - Blue Dot */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        zIndex={100}
                        title={userLocationLabel}
                        icon={{
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="18" fill="rgba(37,99,235,0.2)" />
                                    <circle cx="20" cy="20" r="10" fill="#2563eb" stroke="white" stroke-width="2.5" />
                                </svg>
                            `)}`,
                            scaledSize: { width: 40, height: 40 },
                            anchor: { x: 20, y: 20 },
                        }}
                        label={{
                            text: userLocationLabel,
                            className: 'google-map-user-marker-label',
                            color: '#1e3a8a',
                            fontWeight: 'bold',
                            fontSize: '11px',
                        }}
                    />
                )}

                {/* Store Info Popup */}
                {selectedStore && (
                    <InfoWindow
                        position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                        onCloseClick={() => setSelectedStore(null)}
                    >
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: '200px', padding: '4px' }}>
                            <img
                                src={selectedStore.imageUrl}
                                alt={selectedStore.name}
                                style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                            />
                            <strong style={{ fontSize: '14px', color: '#111827' }}>{selectedStore.name}</strong>
                            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '3px' }}>
                                📍 {selectedStore.address.split(',')[0]}
                            </div>
                            <div style={{ marginTop: '6px', background: '#fdf2f8', color: '#ec4899', padding: '4px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '12px', display: 'inline-block' }}>
                                {selectedStore.topDiscount}
                            </div>

                            {/* Distance from user */}
                            {userLocation && (() => {
                                const dist = getDistanceKm(userLocation.lat, userLocation.lng, selectedStore.lat, selectedStore.lng);
                                const distStr = dist < 1
                                    ? `${Math.round(dist * 1000)} m away`
                                    : `${dist.toFixed(1)} km away`;
                                return (
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', borderRadius: '10px', padding: '5px 10px' }}>
                                        <span style={{ fontSize: '14px' }}>📏</span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>{distStr}</span>
                                        <span style={{ fontSize: '11px', color: '#3b82f6' }}>from you</span>
                                    </div>
                                );
                            })()}

                            {/* Action Buttons */}
                            <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => navigate(`/store/${selectedStore.id}`)}
                                    style={{
                                        flex: 1, textAlign: 'center',
                                        background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                                        color: 'white', padding: '7px', borderRadius: '20px',
                                        fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    View Details →
                                </button>
                                <a
                                    href={`https://www.google.com/maps/dir/${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}/${selectedStore.lat},${selectedStore.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: '#10b981', color: 'white', padding: '7px 10px', borderRadius: '20px',
                                        fontWeight: 700, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap'
                                    }}
                                >
                                    🗺️ Go
                                </a>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </Map>

            {/* Distance Measurement Banner */}
            {measureStore && (
                <div style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'white', borderRadius: '16px',
                    padding: '0.75rem 1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem',
                    border: '2px solid #2563eb', minWidth: '240px',
                }}>
                    <span style={{ fontSize: '20px' }}>📏</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{measureStore.name}</div>
                        {measureDist !== null ? (
                            <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>
                                {measureDist < 1
                                    ? `${Math.round(measureDist * 1000)} m from you`
                                    : `${measureDist.toFixed(2)} km from you`}
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
                                📍 Press the Find Me button to see your distance
                            </div>
                        )}
                    </div>
                    <a
                        href={`https://www.google.com/maps/dir/${userLocation ? `${userLocation.lat},${userLocation.lng}` : ''}/${measureStore.lat},${measureStore.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            background: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '20px',
                            fontWeight: 700, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap'
                        }}
                    >
                        🗺️ Go
                    </a>
                    <button
                        onClick={onMeasureClear}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '18px', padding: '0 4px' }}
                        title="Clear"
                    >✕</button>
                </div>
            )}

            {/* Controls Overlay - Find Me Button */}
            <div style={{
                position: 'absolute', top: '12px', right: '12px',
                zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
                <button
                    onClick={handleFindMe}
                    disabled={isLocating}
                    title="Show my location"
                    style={{
                        background: 'white', border: 'none', borderRadius: '12px',
                        width: '44px', height: '44px', flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', opacity: isLocating ? 0.6 : 1,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                    {isLocating ? '⏳' : '📍'}
                </button>
            </div>

            {/* Location error toast */}
            {locationError && (
                <div style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    background: '#fef2f2', color: '#dc2626', borderRadius: '10px',
                    padding: '0.6rem 1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: '0.8rem', fontWeight: 600, zIndex: 1000, whiteSpace: 'nowrap',
                }}>
                    ⚠️ {locationError}
                </div>
            )}
        </div>
    );
};

export default StoreMap;
