import React from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polygon,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeocercaInterface } from "@/interfaces/Geocerca";

type Props = {
    latitud: number | null;
    longitud: number | null;
    geocercas?: GeocercaInterface[];
    onChange: (lat: number, lon: number) => void;
};

const SelectLatLonMap: React.FC<Props> = ({
    latitud,
    longitud,
    geocercas,
    onChange,
}) => {
    // Manejador de clics en el mapa
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                onChange(lat, lng);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={[latitud || -19.58361, longitud || -65.75306]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Manejador de clics en el mapa */}
            <MapClickHandler />

            {/* Mostrar marcador */}
            {latitud !== null && longitud !== null && (
                <Marker position={[latitud, longitud]} />
            )}

            {/* Mostrar geocercas */}
            {geocercas && geocercas.map((geocerca) => (
                <Polygon
                    key={geocerca.id}
                    positions={JSON.parse(geocerca.polygon_coordinates)}
                    pathOptions={{ color: "blue", weight: 2 }}
                />
            ))}
        </MapContainer>
    );
};

export default SelectLatLonMap;
