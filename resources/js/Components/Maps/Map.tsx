import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    center: [number, number]; // Coordenadas del centro del mapa
    zoom: number; // Nivel de zoom inicial
    children: React.ReactNode; // Elementos hijos (como marcadores)
};

const Map: React.FC<Props> = ({ center, zoom, children }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {children}
        </MapContainer>
    );
};

export default Map;
