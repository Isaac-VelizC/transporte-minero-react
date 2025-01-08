import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { DeviceInterface } from "@/interfaces/Device";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    MapContainer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    TileLayer,
} from "react-leaflet";
import { customIcon } from "@/Components/IconMap";
//import { LatLngExpression } from "leaflet";

type Props = {
    envio: ShipmentInterface;
    geocerca: GeocercaInterface;
    device: DeviceInterface;
};
const CERRO_RICO_COORDS: [number, number] = [-19.619227, -65.750071];

export default function ShowMapa({ envio, geocerca, device }: Props) {
    const [loading, setLoading] = useState(false);
    const [deviceLocation, setDeviceLocation] = useState<
        [number, number] | null
    >(
        device.last_latitude && device.last_longitude
            ? [
                  parseFloat(device.last_latitude),
                  parseFloat(device.last_longitude),
              ]
            : null
    );
    const [error, setError] = useState<string | null>(null);
    const geocercaCoords: [number, number][] = JSON.parse(
        geocerca.polygon_coordinates
    );

    const memoizedGeocercaCoords = useMemo(
        () => geocercaCoords,
        [geocercaCoords]
    );

    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];
    //const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([]);

    // Obtener la ruta inicial
    /*const fetchRoute = async () => {
        try {
            // Solicitar la ruta a tu backend Laravel
            const url = `/route?start=${CERRO_RICO_COORDS[1]},${CERRO_RICO_COORDS[0]}&end=${envioCoords[1]},${envioCoords[0]}`;
            const response = await axios.get(url);
            const coordinates = response.data.routes[0].geometry.coordinates;
            const route = coordinates.map((coord: [number, number]) => [
                coord[1],
                coord[0],
            ]);
            setRouteCoords(route);
        } catch (error) {
            console.error("Error al obtener la ruta:", error);
        }
    };*/

    // Obtiene la posición actual del dispositivo
    const getCurrentPosition =
        useCallback(async (): Promise<GeolocationCoordinates | null> => {
            setLoading(true);
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLoading(false);
                        resolve(position.coords);
                    },
                    (err) => {
                        setLoading(false);
                        reject(err);
                    },
                    { enableHighAccuracy: true }
                );
            });
        }, []);

    const updateLocation = useCallback(
        async (latitude: number, longitude: number) => {
            try {
                // Solo envía la ubicación si es significativamente diferente
                if (
                    !deviceLocation ||
                    Math.abs(deviceLocation[0] - latitude) > 0.0001 ||
                    Math.abs(deviceLocation[1] - longitude) > 0.0001
                ) {
                    await axios.put(`/devices/${device.id}/location`, {
                        latitude,
                        longitude,
                    });
                    setDeviceLocation([latitude, longitude]);
                    console.log("Ubicación actualizada en el servidor");
                }
            } catch (error) {
                console.error("Error al actualizar la ubicación:", error);
                setError("Error al actualizar la ubicación.");
            }
        },
        [device.id, deviceLocation]
    );

    // Actualiza la ubicación periódicamente
    useEffect(() => {
        //fetchRoute();
        let isMounted = true;
        const intervalId = setInterval(async () => {
            try {
                const coords = await getCurrentPosition();
                if (isMounted && coords) {
                    const { latitude, longitude } = coords;
                    updateLocation(latitude, longitude);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error al obtener la ubicación:", err);
                    setError("No se pudo obtener la ubicación");
                }
            }
        }, 60000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [getCurrentPosition, updateLocation]);

    return (
        <Authenticated>
            <Head title="Show Mapa" />
            <h1 className="text-xl font-semibold">Mapa de Envío</h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loading && <p>Cargando ubicación...</p>}
            <div className="mt-4">
                <MapContainer
                    center={envioCoords}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <Polygon
                        positions={memoizedGeocercaCoords}
                        color={geocerca.color}
                        weight={2}
                    />
                    <Marker position={envioCoords} icon={customIcon}>
                        <Popup>
                            {envio.client.nombre} - {envio.destino}
                        </Popup>
                    </Marker>
                    <Marker position={CERRO_RICO_COORDS} />
                    {/*routeCoords.length > 0 && (
                        <Polyline positions={routeCoords} color="red" />
                    )*/}
                    {deviceLocation && (
                        <Marker position={deviceLocation}>
                            <Popup>Ubicación del vehiculo</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </Authenticated>
    );
}
