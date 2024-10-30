import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { CustomMarkerMapa } from './customMarkerMapa';

const libraries = ["places", "geometry"];

export const Mapa = ({ setDireccion, initialDireccion, latitud, longitud }) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [address, setAddress] = useState(initialDireccion || '');
    const [markerPosition, setMarkerPosition] = useState({ lat: latitud || 41.39124311587592, lng: longitud || 2.1558980676717767 });
    const [center, setCenter] = useState({ lat: latitud || 41.39124311587592, lng: longitud || 2.1558980676717767 });
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapRef = React.useRef();

    useEffect(() => {
        if (isMapLoaded && window.google) {
            const geocoder = new window.google.maps.Geocoder();

            if (latitud != null && longitud != null) {
                const newPosition = { lat: latitud, lng: longitud };
                setMarkerPosition(newPosition);
                setCenter(newPosition);
                geocoder.geocode({ location: newPosition }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        setAddress(results[0].formatted_address);
                    }
                });
            } else if (initialDireccion) {
                geocoder.geocode({ address: initialDireccion }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const location = results[0].geometry.location;
                        const newPosition = { lat: location.lat(), lng: location.lng() };
                        setMarkerPosition(newPosition);
                        setCenter(newPosition);
                        setAddress(initialDireccion);
                    } else {
                        console.error("Geocoding failed: " + status);
                    }
                });
            }
        }
    }, [initialDireccion, latitud, longitud, isMapLoaded]);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const newPosition = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setMarkerPosition(newPosition);
                setCenter(newPosition);
                setAddress(place.formatted_address);
                setDireccion(place.formatted_address, newPosition.lat, newPosition.lng);
                if (mapRef.current) {
                    google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
                        mapRef.current.panTo(newPosition);
                        mapRef.current.setZoom(15);
                    });
                }
            }
        }
    };

    const onMapClick = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const formattedAddress = results[0].formatted_address;
                setMarkerPosition(newPosition);
                setCenter(newPosition);
                setAddress(formattedAddress);
                setDireccion(formattedAddress, newPosition.lat, newPosition.lng);
            }
        });
    };

    const mapContainerStyle = {
        height: "400px",
        width: 'auto',
        maxWidth: "800px",
        cursor: 'pointer'
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onPlaceChanged();
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
            onLoad={() => setIsMapLoaded(true)} // Esto se ejecuta cuando se carga el script de Google Maps
        >
            {isMapLoaded && (
                <GoogleMap
                    ref={mapRef}
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    onClick={onMapClick}
                >
                    <Autocomplete
                        onLoad={autocomplete => setAutocomplete(autocomplete)}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            className='w-75 fs-5'
                            type="text"
                            placeholder="Introduzca su dirección..."
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                setDireccion(e.target.value, null, null);
                            }}
                            onKeyDown={handleKeyPress}
                            style={{
                                position: 'absolute',
                                top: '50px',
                                left: '10px',
                                zIndex: 1,
                                padding: '10px',
                                width: '300px'
                            }}
                        />
                    </Autocomplete>
                    <CustomMarkerMapa position={markerPosition} />
                </GoogleMap>
            )}
        </LoadScript>
    );
};