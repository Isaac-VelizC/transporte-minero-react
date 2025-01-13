import { AltercadoIcon, customIcon, deviceIcon } from "@/Components/IconMap";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState, useMemo } from "react";
import { Marker, Popup, Polygon, Polyline } from "react-leaflet";
import * as turf from "@turf/turf";
import { alertToast } from "@/Components/Alerts/AlertaToast";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";

type Props = {
    envio: ShipmentInterface;
    altercados?: AltercationReportInterface[];
};

const Index: React.FC<Props> = ({ envio, altercados }) => {
    const geocercaCoords: [number, number][] = envio.geocerca
        ?.polygon_coordinates
        ? JSON.parse(envio.geocerca.polygon_coordinates)
        : [];

    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];

    const deviceLocation: [number, number] | null =
        envio.vehicle.device?.last_latitude &&
        envio.vehicle.device?.last_longitude
            ? [
                  JSON.parse(envio.vehicle.device.last_latitude),
                  JSON.parse(envio.vehicle.device.last_longitude),
              ]
            : null;

    const [isInsideGeofence, setIsInsideGeofence] = useState(false);
    const [path, setPath] = useState<[number, number][]>([]);

    // Memorizar la geocerca cerrada para evitar cálculos redundantes
    const closedGeocercaCoords = useMemo(() => {
        if (geocercaCoords.length === 0) return [];
        return geocercaCoords[0] !== geocercaCoords[geocercaCoords.length - 1]
            ? [...geocercaCoords, geocercaCoords[0]]
            : geocercaCoords;
    }, [geocercaCoords]);

    // Verificar si el dispositivo está dentro o fuera de la geocerca
    useEffect(() => {
        if (!deviceLocation || closedGeocercaCoords.length === 0) return;

        const polygon = turf.polygon([closedGeocercaCoords]);
        const point = turf.point(deviceLocation);

        const inside = turf.booleanPointInPolygon(point, polygon);

        if (inside !== isInsideGeofence) {
            setIsInsideGeofence(inside);
            alertToast({
                message: inside
                    ? "El dispositivo entró dentro de la geocerca."
                    : "El dispositivo ha salido de la geocerca.",
                deviceName: envio.vehicle.device?.name_device || "",
            });
        }
    }, [deviceLocation, closedGeocercaCoords, isInsideGeofence]);

    // Actualizar el historial del trayecto
    useEffect(() => {
        if (deviceLocation) {
            setPath((prevPath) => {
                const lastPoint = prevPath[prevPath.length - 1];
                if (
                    !lastPoint ||
                    lastPoint[0] !== deviceLocation[0] ||
                    lastPoint[1] !== deviceLocation[1]
                ) {
                    return [...prevPath, deviceLocation];
                }
                return prevPath;
            });
        }
    }, [deviceLocation]);

    return (
        <Authenticated>
            <Head title="Mapa" />
            <div className="h-150 w-full">
                <Map center={envioCoords} zoom={13}>
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
                    {path.length > 1 && (
                        <Polyline
                            positions={path}
                            color="green"
                            weight={3}
                            dashArray="5, 10"
                        />
                    )}
                </Map>
            </div>
        </Authenticated>
    );
};

export default Index;
