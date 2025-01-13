import Card from "@/Components/Cards/Card";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import { AltercadoIcon, customIcon, deviceIcon } from "@/Components/IconMap";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";


type Props = {
    envio: ShipmentInterface;
    altercados?: AltercationReportInterface[];
};

export default function Show({ envio, altercados }: Props) {
    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];

    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
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
                <div className="grid grid-cols-1 lg:grid-cols-2">
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
                            <strong>Fecha de envio: </strong>
                            {envio.fecha_envio}
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
                    <div className="pl-4 space-y-1">
                        <p>
                            <strong>Matricula de Vehiculo: </strong>
                            {envio.vehicle.matricula}
                        </p>
                        <p>
                            <strong>Color: </strong>
                            {envio.vehicle.color}
                        </p>
                        <p>
                            <strong>Capacidad de Carga: </strong>
                            {envio.vehicle.capacidad_carga}
                        </p>
                        <p>
                            <strong>Sub Total por tonelada: </strong>
                            {envio.sub_total}bs.
                        </p>
                        <p>
                            <strong>Total costo: </strong>
                            {envio.total}bs.
                        </p>
                    </div>
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
                        <Map
                            center={envioCoords}
                            zoom={13}
                        >
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
                            {/* Ruta entre origen y destino */}
                            {/*<RoutingMachine
                                origenCoords={origenCoords}
                                destinoCoords={envioCoords}
                            />*/}
                        </Map>
                    </div>
                </div>
            </Card>
        </Authenticated>
    );
}
