import {
    AltercadoIcon,
    customIcon,
    deviceIcon,
    HomeIcon,
} from "@/Components/IconMap";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Marker, Popup, Polygon, Polyline } from "react-leaflet";
import * as turf from "@turf/turf";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";
import { RutaEnvioDeviceInterface } from "@/interfaces/RutaEnvioDevice";
import axios from "axios";
import toast from "react-hot-toast";
import ModalAlerta from "./ModalAlerta";

type Props = {
    envio: ShipmentInterface;
    altercados?: AltercationReportInterface[];
    rutaEnvioDevice?: RutaEnvioDeviceInterface;
};

const Index: React.FC<Props> = ({ envio, altercados, rutaEnvioDevice }) => {
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [rutaUpdated, SetRutaUpdate] = useState(rutaEnvioDevice?.coordenadas);
    let token = 'pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA';
    const [error, setError] = useState<string | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    const [alerta, setAlerta] = useState(false);
    const geocercaCoords: [number, number][] = envio.geocerca
        ?.polygon_coordinates
        ? JSON.parse(envio.geocerca.polygon_coordinates)
        : [];

    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];

    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
    ];

    const [deviceLocation, setDeviceLocation] = useState<
        [number, number] | null
    >(
        envio.vehicle.device?.last_latitude &&
            envio.vehicle.device?.last_longitude
            ? [
                  JSON.parse(envio.vehicle.device.last_latitude),
                  JSON.parse(envio.vehicle.device.last_longitude),
              ]
            : null
    );
    // Memorizar la geocerca cerrada para evitar cálculos redundantes
    const closedGeocercaCoords = useMemo(() => {
        if (geocercaCoords.length === 0) return [];
        return geocercaCoords[0] !== geocercaCoords[geocercaCoords.length - 1]
            ? [...geocercaCoords, geocercaCoords[0]]
            : geocercaCoords;
    }, [geocercaCoords]);

    const checkInsideGeofence = useCallback(
        (coords: [number, number]) => {
            const point = turf.point(coords);
            const polygon = turf.polygon([closedGeocercaCoords]);
            return turf.booleanPointInPolygon(point, polygon);
        },
        [geocercaCoords]
    );

    // Verificar si el dispositivo está dentro o fuera de la geocerca
    useEffect(() => {
        if (!deviceLocation || closedGeocercaCoords.length === 0) return;

        if (!checkInsideGeofence(deviceLocation)) {
            if (!alertTriggered) {
                setAlerta(true);
            }
        } else {
            if (alertTriggered) {
                setAlerta(false);
                setAlertTriggered(false);
            }
        }
    }, [deviceLocation, closedGeocercaCoords, alertTriggered]);

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    const updateRutaDevice = async () => {
        try {
            const response = await axios.get(
                `/devices/${envio.vehicle.device?.id}/location/${envio.id}/monitoreo`
            );
            if (response.status === 200) {
                const { latitude, longitude, coordenadas } = response.data;
                setDeviceLocation([latitude, longitude]);
                SetRutaUpdate(coordenadas);
            } else {
                throw new Error("Error al actualizar la ubicación");
            }
        } catch (err) {
            console.error("Error en updateRutaDevice:", err);
            toast.error("No se pudo actualizar la ubicación");
        }
    };

    useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            if (isMounted) await updateRutaDevice();
        }, 20000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [envio.vehicle.device?.id]);

    // Función para obtener la ruta entre el origen y el destino
    const fetchRoute = async () => {
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origenCoords[1]},${origenCoords[0]};${envioCoords[1]},${envioCoords[0]}?geometries=geojson&access_token=${token}`
            );
            const route = response.data.routes[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]]
            );
            setRouteCoordinates(route);
        } catch (err) {
            console.error("Error fetching route:", err);
            setError("No se pudo obtener la ruta.");
        }
    };

    useEffect(() => {
        fetchRoute();
    }, [origenCoords, envioCoords]);

    return (
        <Authenticated>
            <Head title="Mapa" />
            <ModalAlerta
                show={alerta}
                onClose={handleCloseAlert}
                conductor={
                    envio.conductor?.nombre + " " + envio.conductor?.ap_pat
                }
                telefono={envio.conductor?.numero}
            />
            <div className="h-150 w-full">
                <Map center={envioCoords} zoom={15}>
                    {/* Renderizar geocerca */}
                    {closedGeocercaCoords.length > 0 && (
                        <Polygon
                            positions={closedGeocercaCoords}
                            color={envio.geocerca?.color || "blue"}
                            weight={2}
                        />
                    )}
                    {/* Coordenadas del destino */}
                    <Marker position={envioCoords} icon={customIcon}>
                        <Popup>{envio.destino}</Popup>
                    </Marker>
                    {/* Coordenadas del origen */}
                    <Marker position={origenCoords} icon={HomeIcon}>
                        <Popup>{envio.origen}</Popup>
                    </Marker>
                    {/* Ubicación del dispositivo */}
                    {deviceLocation && (
                        <Marker position={deviceLocation} icon={deviceIcon}>
                            <Popup>
                                {envio.vehicle.device?.name_device ||
                                    "Dispositivo desconocido"}
                            </Popup>
                        </Marker>
                    )}
                    {/* Trayecto del dispositivo */}
                    {altercados &&
                        altercados.map((item, index) => (
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
                    {/** Ruta del Camion o dispositivo */}
                    {rutaUpdated && rutaUpdated.length > 0 && (
                        <Polyline
                            positions={JSON.parse(rutaUpdated)}
                            color={rutaEnvioDevice?.color}
                        />
                    )}
                    {/* Dibuja la ruta en el mapa */}
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="blue" />
                    )}
                </Map>
            </div>
        </Authenticated>
    );
};

export default Index;
