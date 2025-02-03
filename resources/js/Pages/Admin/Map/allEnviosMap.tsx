import { customIcon, deviceIcon, HomeIcon } from "@/Components/IconMap";
import Map from "@/Components/Maps/Map";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";

type Props = {
    envios: ShipmentInterface[];
};

export default function allEnviosMap({ envios }: Props) {
    const token =
        "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";

    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    const [routes, setRoutes] = useState<{ [key: string]: [number, number][] }>(
        {}
    );

    const fetchRoute = async (
        origenCoords: [number, number],
        envioCoords: [number, number],
        envioId: number
    ) => {
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origenCoords[1]},${origenCoords[0]};${envioCoords[1]},${envioCoords[0]}?geometries=geojson&access_token=${token}`
            );
            const route = response.data.routes[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]]
            );
            setRoutes((prevRoutes) => ({
                ...prevRoutes,
                [envioId]: route,
            }));
        } catch (err) {
            console.error("Error fetching route:", err);
        }
    };

    useEffect(() => {
        envios.forEach((envio) => {
            const origenCoords: [number, number] = [
                envio.origen_latitude,
                envio.origen_longitude,
            ];
            const envioCoords: [number, number] = [
                envio.client_latitude,
                envio.client_longitude,
            ];
            fetchRoute(origenCoords, envioCoords, envio.id);
        });
    }, [envios]);

    return (
        <Authenticated>
            <Head title="Mapa" />
            <div className="h-150 w-full">
                <Map center={[-16.290154, -63.588653]} zoom={6}>
                    {envios.map((envio) => (
                        <React.Fragment key={envio.id}>
                            {/* Marcador para el destino del cliente */}
                            <Marker
                                position={[
                                    envio.client_latitude,
                                    envio.client_longitude,
                                ]}
                                icon={customIcon}
                            >
                                <Popup>{envio.destino}</Popup>
                            </Marker>
                            {/* Marcador para el origen */}
                            <Marker
                                position={[
                                    envio.origen_latitude,
                                    envio.origen_longitude,
                                ]}
                                icon={HomeIcon}
                            >
                                <Popup>{envio.origen}</Popup>
                            </Marker>
                            {/* Marcadores para los horarios de vehículos */}
                            {envio.vehicle_schedules.map((location, index) => (
                                <Marker
                                    key={location.vehicle.id}
                                    position={[
                                        parseFloat(
                                            location.vehicle.device
                                                ?.last_latitude || "0"
                                        ),
                                        parseFloat(
                                            location.vehicle.device
                                                ?.last_longitude || "0"
                                        ),
                                    ]}
                                    icon={deviceIcon}
                                >
                                    <Popup>Vehículo {index + 1}</Popup>
                                </Marker>
                            ))}
                            {/* Dibuja la ruta en el mapa si las coordenadas existen */}
                            {routes[envio.id] && (
                                <Polyline
                                    positions={routes[envio.id]}
                                    color="red"
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Map>
            </div>
        </Authenticated>
    );
}
