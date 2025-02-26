import {
    AltercadoIcon,
    customIcon,
    deviceIcon,
    HomeIcon,
} from "@/Components/IconMap";
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
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
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
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origenCoords[1]},${origenCoords[0]};${envioCoords[1]},${envioCoords[0]}?geometries=geojson&overview=full&access_token=${token}`
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

    // Colores para las rutas de los vehículos
    const colors = ["blue", "green", "purple", "orange", "cyan"];

    const [time, setTime] = useState("");

    const fetchTravelTime = async (origin: string, destination: string) => {
        //const origin = "40.712776,-74.005974"; // Coordenadas de origen
        //const destination = "34.052235,-118.243683"; // Coordenadas de destino
        setTime('');
        try {
            const response = await axios.get(`/api/travel-time`, {
                params: { origin, destination },
            });

            const duration = response.data.rows[0].elements[0].duration.text;
            setTime(duration);
        } catch (error) {
            console.error("Error obteniendo el tiempo de ruta", error);
        }
    };

    return (
        <Authenticated>
            <Head title="Mapa" />
            <div className="h-150 w-full">
                <Map center={[-16.290154, -63.588653]} zoom={6}>
                    {envios.map((envio, index) => (
                        <React.Fragment key={index}>
                            {/* Marcador para el destino del cliente */}
                            <Marker
                                position={[
                                    envio.client_latitude,
                                    envio.client_longitude,
                                ]}
                                icon={customIcon}
                            >
                                <Popup>Destino: {envio.destino}</Popup>
                            </Marker>
                            {/* Marcador para el origen */}
                            <Marker
                                position={[
                                    envio.origen_latitude,
                                    envio.origen_longitude,
                                ]}
                                icon={HomeIcon}
                            >
                                <Popup>Origén: {envio.origen}</Popup>
                            </Marker>
                            {/* Marcadores para los horarios de vehículos */}

                            {envio.vehicle_schedules.map((location) => {
                                const lat = parseFloat(
                                    location.vehicle.device?.last_latitude ||
                                        "0"
                                );
                                const lng = parseFloat(
                                    location.vehicle.device?.last_longitude ||
                                        "0"
                                );

                                return (
                                    <Marker
                                        key={location.vehicle.id}
                                        position={[lat, lng]}
                                        icon={deviceIcon}
                                        eventHandlers={{
                                            click: () =>
                                                fetchTravelTime(
                                                    `${lat},${lng}`,
                                                    `${envio.client_latitude},${envio.client_longitude}`
                                                ),
                                        }}
                                    >
                                        <Popup>
                                            <div>
                                                <h1 className="text-sm font-bold">
                                                    Matricula{" "}
                                                    {location.vehicle.matricula}
                                                </h1>
                                                <span>
                                                    Llega en :{" "}
                                                    {time == '' ? <small className="text-red">Calculando</small> : time}
                                                </span>
                                                <br />
                                                <span>
                                                    Conductor:{" "}
                                                    {
                                                        location.vehicle?.driver
                                                            ?.nombre
                                                    }{" "}
                                                    {
                                                        location.vehicle?.driver
                                                            ?.ap_pat
                                                    }{" "}
                                                    {
                                                        location.vehicle?.driver
                                                            ?.ap_mat
                                                    }
                                                </span>
                                                <br />
                                                <span>
                                                    Carga:{" "}
                                                    {envio.mineral.nombre +
                                                        " " +
                                                        envio.peso +
                                                        "t."}
                                                </span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/*envio.vehicle_schedules.map((location) => (
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
                                    <Popup>
                                        <div>
                                            <h1 className="text-sm font-bold">
                                                Matricula
                                                {location.vehicle.matricula}
                                            </h1>
                                            <span>
                                                Llega en:{" "}
                                                {time}
                                            </span>
                                            <span>
                                                Modelo:{" "}
                                                {location.vehicle.modelo}
                                            </span>
                                            <br />
                                            <span>
                                                Conductor:{" "}
                                                {
                                                    location.vehicle?.driver
                                                        ?.nombre
                                                }{" "}
                                                {
                                                    location.vehicle?.driver
                                                        ?.ap_pat
                                                }{" "}
                                                {
                                                    location.vehicle?.driver
                                                        ?.ap_mat
                                                }
                                            </span>
                                            <br />
                                            <span>
                                                Carga:{" "}
                                                {envio.mineral.nombre +
                                                    " " +
                                                    envio.peso +
                                                    "t."}
                                            </span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))*/}
                            {/* Trayecto del dispositivo */}
                            {envio.altercado_reports?.map((item, index) => (
                                <Marker
                                    key={index}
                                    position={[
                                        item.last_latitude,
                                        item.last_longitude,
                                    ]}
                                    icon={AltercadoIcon}
                                >
                                    <Popup>{item.description}</Popup>
                                </Marker>
                            ))}

                            {/* Dibuja la ruta en el mapa si las coordenadas existen */}
                            {routes[envio.id] && (
                                <Polyline
                                    positions={routes[envio.id]}
                                    color={colors[index % colors.length]}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Map>
            </div>
        </Authenticated>
    );
}
