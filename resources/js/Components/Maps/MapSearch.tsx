import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import GooglePlacesAutocomplete, {
    geocodeByPlaceId,
    getLatLng,
} from "react-google-places-autocomplete";

import "leaflet/dist/leaflet.css";

type Props = {
    center: [number, number]; // Coordenadas del centro del mapa
    zoom: number; // Nivel de zoom inicial
    children: React.ReactNode;
};

// Componente para cambiar la vista del mapa
const ChangeMapView: React.FC<{ position: [number, number] }> = ({
    position,
}) => {
    const map = useMap();

    useEffect(() => {
        if (map) {
            map.setView(position, 13);
        }
    }, [position, map]); // Se ejecuta solo cuando `position` cambia

    return null;
};

const MapSeach: React.FC<Props> = ({ center, zoom, children }) => {
    const [position, setPosition] = useState<[number, number]>([
        -19.58361, -65.75306,
    ]); // Coordenadas iniciales (Londres)

    const handleSelect = async (place: any) => {
        const results = await geocodeByPlaceId(place.value.place_id);
        const { lat, lng } = await getLatLng(results[0]);
        setPosition([lat, lng]);
    };

    return (
        <div className="relative flex h-[500px] w-full">
            <div className="absolute top-2 left-14 w-[260px] lg:w-2/5 z-99999">
                <GooglePlacesAutocomplete
                    selectProps={{
                        onChange: handleSelect,
                        placeholder: "Buscar una ubicación...",
                    }}
                />
            </div>
            <div className=" relative w-full h-[480px]">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <ChangeMapView position={position} />
                    {children}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapSeach;
