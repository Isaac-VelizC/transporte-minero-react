import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
    center: [number, number]; // Coordenadas del centro del mapa
    zoom: number; // Nivel de zoom inicial
    children: React.ReactNode;
};

const Map: React.FC<Props> = ({ center, zoom, children }) => {
    //const token = "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";
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
            {/*<TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${token}`}
                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
            />*/}
            {children}
        </MapContainer>
    );
};

export default Map;
