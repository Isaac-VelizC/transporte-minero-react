import React, { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
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
    withSearch?: boolean;
};

// Componente para cambiar la vista del mapa
const ChangeMapView: React.FC<{ position: [number, number] }> = ({
    position,
}) => {
    const map = useMap();
    map.setView(position, 13);
    return null;
};

const Map: React.FC<Props> = ({
    center,
    zoom,
    children,
    withSearch = false,
}) => {
    
    let token =
        "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";
    const [position, setPosition] = useState<[number, number]>([
        -19.58361, -65.75306,
    ]); // Coordenadas iniciales (Londres)

    const handleSelect = async (place: any) => {
        const results = await geocodeByPlaceId(place.value.place_id);
        const { lat, lng } = await getLatLng(results[0]);
        setPosition([lat, lng]);
    };

    const MapSection = () => (
        <MapContainer
            center={center}
            zoom={zoom}
         
            style={{ height: "100%", width: "100%" }}
        >
            
            <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${token}`} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ChangeMapView position={position} />
            <Marker position={position} />
            {children}
        </MapContainer>
    );

    return (
        <>
            {withSearch ? (
                <div className="flex h-150">
                    <div className="w-full lg:w-2/6">
                        <GooglePlacesAutocomplete
                            //apiKey="TU_CLAVE_API"
                            selectProps={{
                                onChange: handleSelect,
                                placeholder: "Buscar una ubicación...",
                            }}
                        />
                    </div>
                    <div className="w-full lg:w-3/5 h-90">
                        <MapSection />
                    </div>
                </div>
            ) : (
                <MapSection />
            )}
        </>
    );
};

export default Map;
