import React, { useEffect, useState } from "react";
//import echo from "../echo";
import { MapContainer, TileLayer, Marker, Polyline, Polygon } from "react-leaflet";
import L from "leaflet";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";

type Props = {
    envio: ShipmentInterface;
    geocerca: GeocercaInterface;
};

export default function ShowMapa({ envio, geocerca }: Props) {
    const geocercaCoords: [number, number][] = JSON.parse(
        geocerca.polygon_coordinates
    );
    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];
    const [driverLocation, setDriverLocation] = useState<[number, number] | null>(
        null
    );

    /*useEffect(() => {
        echo.channel("driver-location").listen("DriverLocationUpdated", (e: any) => {
            setDriverLocation([e.location.latitude, e.location.longitude]);
        });

        return () => {
            echo.leaveChannel("driver-location");
        };
    }, []);*/

    return (
        <div>
            <h1 className="text-lg font-semibold">Mapa de Envío</h1>
            <MapContainer
                center={envioCoords}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polygon positions={geocercaCoords} color="blue" weight={2} />
                <Marker position={envioCoords} />
                {driverLocation && (
                    <Marker
                        position={driverLocation}
                        icon={L.icon({
                            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                            iconSize: [30, 30],
                        })}
                    />
                )}
                {driverLocation && envioCoords && (
                    <Polyline
                        positions={[driverLocation, envioCoords]}
                        pathOptions={{ color: "red", weight: 3 }}
                    />
                )}
            </MapContainer>
        </div>
    );
}
