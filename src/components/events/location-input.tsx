// src/components/events/location-input.tsx
import * as React from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useMemo, useState, useCallback } from "react";

interface Location {
    address: string;
    latitude?: number;
    longitude?: number;
}

interface LocationInputProps {
    value: Location;
    onChange: (location: Location) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
    const [mapCenter, setMapCenter] = useState({
        lat: value.latitude || 22.5726,
        lng: value.longitude || 88.3639
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });

    const initAutocomplete = useCallback((input: HTMLInputElement | null) => {
        if (!input || !isLoaded) return;

        const autocomplete = new google.maps.places.Autocomplete(input, {
            fields: ["formatted_address", "geometry"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;

            const newLocation = {
                address: place.formatted_address || "",
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
            };

            onChange(newLocation);
            setMapCenter({
                lat: newLocation.latitude!,
                lng: newLocation.longitude!
            });
        });
    }, [isLoaded, onChange]);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        clickableIcons: true,
        scrollwheel: true,
    }), []);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Reverse geocoding to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                const newLocation = {
                    address: results[0].formatted_address,
                    latitude: lat,
                    longitude: lng,
                };
                onChange(newLocation);
            }
        });
    }, [onChange]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        placeholder="Enter location or click on map"
                        className="pl-10"
                        defaultValue={value.address}
                        ref={initAutocomplete}
                    />
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {navigator.geolocation && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition((position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                const geocoder = new google.maps.Geocoder();
                                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                    if (status === "OK" && results?.[0]) {
                                        onChange({
                                            address: results[0].formatted_address,
                                            latitude: lat,
                                            longitude: lng,
                                        });
                                        setMapCenter({ lat, lng });
                                    }
                                });
                            });
                        }}
                    >
                        Use Current Location
                    </Button>
                )}
            </div>

            <div className="h-[300px] w-full rounded-md border">
                <GoogleMap
                    zoom={13}
                    center={mapCenter}
                    mapContainerClassName="w-full h-full rounded-md"
                    options={mapOptions}
                    onClick={onMapClick}
                >
                    {value.latitude && value.longitude && (
                        <Marker
                            position={{
                                lat: value.latitude,
                                lng: value.longitude
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
}