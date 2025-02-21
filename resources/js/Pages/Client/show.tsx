import Card from "@/Components/Cards/Card";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    AltercadoIcon,
    customIcon,
    deviceIcon,
    HomeIcon,
} from "@/Components/IconMap";
import { Marker, Popup } from "react-leaflet";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";
import { CargoShipmentVehicleScheduleInterface } from "@/interfaces/CargoShipmentVehicleSchedule";

type Props = {
    envio: ShipmentInterface;
    altercados?: AltercationReportInterface[];
    schedules: CargoShipmentVehicleScheduleInterface[];
};

export default function Show({ envio, altercados, schedules }: Props) {
    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];

    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
    ];

    const deviceLocations: [number, number][] = schedules
        .map((schedule) => {
            
            if (
                schedule.vehicle.device?.last_latitude &&
                schedule.vehicle.device?.last_longitude
            ) {
                return [
                    JSON.parse(schedule.vehicle.device.last_latitude),
                    JSON.parse(schedule.vehicle.device.last_longitude),
                ];
            }
            return null;
        })
        .filter((coords): coords is [number, number] => coords !== null);
    
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
                        {schedules.map((item, index) => (
                            <div key={index}>
                                <p>
                                    <strong>Matricula de Vehiculo: </strong>
                                    {item.vehicle.matricula}
                                </p>
                                <p>
                                    <strong>Color: </strong>
                                    {item.vehicle.color}
                                </p>
                                <p>
                                    <strong>Capacidad de Carga: </strong>
                                    {item.vehicle.capacidad_carga}
                                </p>
                            </div>
                        ))}
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
                        <Map center={envioCoords} zoom={13}>
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
                                        <Popup>
                                            <div className="flex flex-col">
                                                <h1>Matricula: {item.vehiculo.matricula}</h1>
                                                <span>{item.fecha}</span>
                                                <p>{item.description}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            {/* Ubicación del dispositivo */}
                            {deviceLocations.map((location, index) => (
                                <Marker
                                    key={index}
                                    position={location}
                                    icon={deviceIcon}
                                >
                                    <Popup>
                                        <div className="flex flex-col">
                                            <h1 className="text-sm font-bold">Matricula: {schedules[index].vehicle.matricula}</h1>
                                            <span>Modelos: {schedules[index].vehicle.modelo}</span>
                                            <span>Color: {schedules[index].vehicle.color}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {origenCoords && (
                                <Marker position={origenCoords} icon={HomeIcon}>
                                    <Popup>Origén: {envio.origen}</Popup>
                                </Marker>
                            )}

                            {envioCoords && (
                                <Marker
                                    position={envioCoords}
                                    icon={customIcon}
                                >
                                    <Popup>Destino: {envio.destino}</Popup>
                                </Marker>
                            )}
                        </Map>
                    </div>
                </div>
            </Card>
        </Authenticated>
    );
}
