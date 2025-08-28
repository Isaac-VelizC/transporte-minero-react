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
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-50">
                    <h1 className="font-semibold text-base md:text-lg text-gray-800">
                        📦 Información del Envío de Carga
                    </h1>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {/* Datos del envío */}
                    <div className="space-y-3 text-sm text-gray-700">
                        <p>
                            <span className="font-medium text-gray-900">
                                Cliente:
                            </span>{" "}
                            {envio.client.nombre + " " + envio.client.ap_pat}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900">
                                Peso en toneladas:
                            </span>{" "}
                            {envio.peso} t.
                        </p>
                        <p>
                            <span className="font-medium text-gray-900">
                                Destino:
                            </span>{" "}
                            {envio.destino}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900">
                                Fecha de envío:
                            </span>{" "}
                            {envio.fecha_envio}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900">
                                Fecha de entrega:
                            </span>{" "}
                            {envio.fecha_entrega}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900">
                                Notas:
                            </span>{" "}
                            {envio.notas || "—"}
                        </p>
                    </div>

                    {/* Vehículos + costos */}
                    <div className="space-y-5 text-sm text-gray-700">
                        {schedules.map((item, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-xl border border-gray-200 shadow-sm bg-white"
                            >
                                <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                    <img
                                        src={`${
                                            import.meta.env.VITE_URL_STORAGE
                                        }/${item.vehicle.image}`}
                                        alt="Vehiculo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p>
                                    <span className="font-medium text-gray-900">
                                        Matrícula:
                                    </span>{" "}
                                    {item.vehicle.matricula}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">
                                        Color:
                                    </span>{" "}
                                    {item.vehicle.color}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">
                                        Capacidad de carga:
                                    </span>{" "}
                                    {item.vehicle.capacidad_carga} t.
                                </p>
                            </div>
                        ))}

                        <div className="pt-2 border-t space-y-2">
                            <p>
                                <span className="font-medium text-gray-900">
                                    💰 Sub Total por tonelada:
                                </span>{" "}
                                {envio.sub_total} Bs.
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                🔥 Total: {envio.total} Bs.
                            </p>
                        </div>
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
                                                <h1>
                                                    Matricula:{" "}
                                                    {item.vehiculo.matricula}
                                                </h1>
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
                                            <h1 className="text-sm font-bold">
                                                Matricula:{" "}
                                                {
                                                    schedules[index].vehicle
                                                        .matricula
                                                }
                                            </h1>
                                            <span>
                                                Modelos:{" "}
                                                {
                                                    schedules[index].vehicle
                                                        .modelo
                                                }
                                            </span>
                                            <span>
                                                Color:{" "}
                                                {schedules[index].vehicle.color}
                                            </span>
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
