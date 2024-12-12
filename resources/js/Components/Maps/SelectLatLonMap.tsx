import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    latitud: number | null;
    longitud: number | null;
    onChange: (lat: number, lon: number) => void;
};

const SelectLatLonMap: React.FC<Props> = ({ latitud, longitud, onChange }) => {
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
            <MapClickHandler />
            {latitud !== null && longitud !== null && (
                <Marker position={[latitud, longitud]} />
            )}
        </MapContainer>
    );
};

export default SelectLatLonMap;
