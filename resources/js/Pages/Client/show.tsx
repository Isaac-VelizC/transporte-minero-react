import Card from "@/Components/Cards/Card";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import { customIcon, deviceIcon } from "@/Components/IconMap";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";

type Props = {
    envio: ShipmentInterface;
};

export default function show({ envio }: Props) {
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
    return (
        <Authenticated>
            <Head title="Show Envio" />
            <Card>
                <div className="px-4 py-2 border-b">
                    <h1 className="font-semibold text-sm md:text-lg pb-3">
                        Información del envio de carga
                    </h1>
                </div>
                <div className="pl-4 space-y-1">
                    <p>
                        <strong>Cliente: </strong>
                        {envio.client.nombre + " " + envio.client.ap_pat}
                    </p>
                    <p>
                        <strong>Peso en toneldas: </strong>
                        {envio.peso} t.
                    </p>
                    <p>
                        <strong>Destino: </strong>
                        {envio.destino}
                    </p>
                    <p>
                        <strong>Fecha de Entrega: </strong>
                        {envio.fecha_entrega}
                    </p>
                    <p>
                        <strong>Notas: </strong>
                        {envio.notas}
                    </p>
                </div>
            </Card>
            <br />
            <Card>
                <div className="py-4 text-center">
                    <div className="py-4">
                        <h1 className="font-bold text-lg">
                            Rastreo del pedido
                        </h1>
                    </div>
                    <div className="h-150">
                        <MapContainer
                            center={envioCoords}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {/* Renderizar geocerca */}
                            {geocercaCoords.length > 0 && (
                                <Polygon
                                    positions={geocercaCoords}
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
                                <Marker
                                    position={deviceLocation}
                                    icon={deviceIcon}
                                >
                                    <Popup>
                                        {envio.vehicle.device?.name_device ||
                                            "Dispositivo desconocido"}
                                    </Popup>
                                </Marker>
                            )}
                            {/* Trayecto del dispositivo */}
                            {/*path.length > 1 && (
                                <Polyline
                                    positions={path}
                                    color="green"
                                    weight={3}
                                    dashArray="5, 10"
                                />
                            )*/}
                        </MapContainer>
                    </div>
                </div>
            </Card>
        </Authenticated>
    );
}
