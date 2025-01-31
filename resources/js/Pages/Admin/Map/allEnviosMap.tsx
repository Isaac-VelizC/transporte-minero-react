import { customIcon, deviceIcon, HomeIcon } from "@/Components/IconMap";
import Map from "@/Components/Maps/Map";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { Marker, Polyline, Popup } from "react-leaflet";

type Props = {
    envios: ShipmentInterface[];
};

export default function allEnviosMap({ envios }: Props) {
    return (
        <Authenticated>
            <Head title="Mapa" />
            <div className="h-150 w-full">
                <Map center={[-16.290154, -63.588653]} zoom={6}>
                    {envios.map((envio) => (
                        <React.Fragment key={envio.id}>
                            {" "}
                            {/* Asegúrate de tener una clave única */}
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
                                    key={location.vehicle.id} // Usa un identificador único si está disponible
                                    position={[
                                        parseFloat(
                                            location.vehicle.device
                                                ?.last_latitude || "0"
                                        ), // Manejo de valores nulos
                                        parseFloat(
                                            location.vehicle.device
                                                ?.last_longitude || "0"
                                        ), // Manejo de valores nulos
                                    ]}
                                    icon={deviceIcon}
                                >
                                    <Popup>Vehículo {index + 1}</Popup>
                                </Marker>
                            ))}
                        </React.Fragment>
                    ))}

                    {/* Coordenadas del destino */}

                    {/* Ubicación del dispositivo */}

                    {/* Ruta del Camión o Dispositivo */}
                    {/*rutaUpdated.length > 0 &&
                        rutaUpdated.map((coords, index) => (
                            <Polyline
                                key={index}
                                positions={coords}
                                color={'green'}
                            />
                        ))*/}
                    {/* Dibuja la ruta en el mapa */}
                    {/*routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="red" />
                    )*/}
                </Map>
            </div>
        </Authenticated>
    );
}
