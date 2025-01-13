import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { DeviceInterface } from "@/interfaces/Device";
import { Head } from "@inertiajs/react";
import * as turf from "@turf/turf";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Marker,
    Polygon,
    Polyline,
    Popup
} from "react-leaflet";
import { RutaEnvioDeviceInterface } from "@/interfaces/RutaEnvioDevice";
import { deviceIcon } from "@/Components/IconMap";
import Map from "@/Components/Maps/Map";
//import { LatLngExpression } from "leaflet";

type Props = {
    envio: ShipmentInterface;
    geocerca: GeocercaInterface;
    device: DeviceInterface;
    rutaEnvioDevice?: RutaEnvioDeviceInterface;
};

const rutaCoordenadas = [
    [-19.5638, -65.7391],
    [-19.5642, -65.7387],
    [-19.5645, -65.7383],
    [-19.565, -65.7378],
    [-19.5655, -65.7374],
    [-19.566, -65.7369],
    [-19.5665, -65.7365],
    [-19.567, -65.736],
    [-19.5675, -65.7355],
    [-19.568, -65.735],
    [-19.5685, -65.7346],
    [-19.569, -65.7342],
    [-19.5695, -65.7337],
    [-19.57, -65.7333],
    [-19.5705, -65.7329],
];

export default function ShowMapa({
    envio,
    geocerca,
    device,
    rutaEnvioDevice,
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0); // Para rastrear el índice actual prueba borrar
console.log(rutaEnvioDevice);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [devicePath, setDevicePath] = useState<[number, number][]>([]);
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

    const memoizedGeocercaCoords = useMemo(
        () => JSON.parse(geocerca.polygon_coordinates),
        [geocerca.polygon_coordinates]
    );

    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
    ];
    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];
    /** Control de la geocerca si sale o entra el dispositivo */
    const closedGeocercaCoords = useMemo(() => {
        if (memoizedGeocercaCoords.length === 0) return [];
        return memoizedGeocercaCoords[0] !==
            memoizedGeocercaCoords[memoizedGeocercaCoords.length - 1]
            ? [...memoizedGeocercaCoords, memoizedGeocercaCoords[0]]
            : memoizedGeocercaCoords;
    }, [memoizedGeocercaCoords]);

    const checkInsideGeofence = useCallback(
        (coords: [number, number]) => {
            const point = turf.point(coords);
            const polygon = turf.polygon([closedGeocercaCoords]);
            return turf.booleanPointInPolygon(point, polygon);
        },
        [memoizedGeocercaCoords]
    );

    /** Simulacion de movimiento del dispositivo  */
    /*const simulateDeviceMovement = useCallback(() => {
        if (!deviceLocation) return;

        const [currentLat, currentLng] = deviceLocation;
        const [destLat, destLng] = envioCoords;

        // Calcular la diferencia en latitud y longitud
        const diffLat = destLat - currentLat;
        const diffLng = destLng - currentLng;

        // Distancia máxima por paso
        const step = 0.0001; // Ajusta este valor para definir la velocidad del movimiento

        // Calcular los pasos en dirección al destino
        const stepLat =
            diffLat > 0 ? Math.min(step, diffLat) : Math.max(-step, diffLat);
        const stepLng =
            diffLng > 0 ? Math.min(step, diffLng) : Math.max(-step, diffLng);

        // Nueva posición
        const newLat = currentLat + stepLat;
        const newLng = currentLng + stepLng;

        // Actualizar la ubicación
        setDeviceLocation([newLat, newLng]);

        // Verificar si hemos llegado al destino
        if (Math.abs(diffLat) <= step && Math.abs(diffLng) <= step) {
            console.log("¡El dispositivo ha llegado al destino!");
            setError(null); // Opcional: Limpiar errores si los hay
        }
    }, [deviceLocation, envioCoords]);*/

    const updateDevicePath = useCallback(
        (latitude: number, longitude: number) => {
            setDevicePath((prevPath) => [...prevPath, [latitude, longitude]]);
        },
        []
    );

    /** Optiene la posision del dispositivo */
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
    /**Prueba borrar despues */

    const updateLocation = async (latitude: number, longitude: number) => {
        try {
            // Realiza la solicitud PUT para actualizar la ubicación
            const response = await axios.put(
                `/devices/${device.id}/location/${envio.id}`,
                {
                    latitude,
                    longitude,
                }
            );

            // Verifica si la respuesta fue exitosa
            if (response.status === 200) {
                setDeviceLocation([latitude, longitude]);
                console.log("Ubicación actualizada React:", {
                    latitude,
                    longitude,
                });
            } else {
                throw new Error("Error al actualizar la ubicación");
            }
        } catch (err) {
            console.error("Error en updateLocation:", err);
            setError("No se pudo actualizar la ubicación");
        }
    };

    /*useEffect(() => {
        let isMounted = true;
    
        const intervalId = setInterval(async () => {
          if (currentIndex < rutaCoordenadas.length && isMounted) {
            const [latitude, longitude] = rutaCoordenadas[currentIndex];
            
            await updateLocation(latitude, longitude);
            setCurrentIndex((prevIndex) => prevIndex + 1);
          } else {
            clearInterval(intervalId); // Detener el intervalo si se recorrieron todas las coordenadas
          }
        }, 30000);
    
        return () => {
          isMounted = false;
          clearInterval(intervalId);
        };
      }, [currentIndex]);*/ // Dependemos de `currentIndex`

    /** Actualiza la coordenadas del dispositivo en la base de datos */
    /*const updateLocation = useCallback(
        async (latitude: number, longitude: number) => {
            try {
                if (
                    !deviceLocation ||
                    Math.abs(deviceLocation[0] - latitude) > 0.0001 ||
                    Math.abs(deviceLocation[1] - longitude) > 0.0001
                ) {
                    await axios.put(`/devices/${device.id}/location/${envio.id}`, {
                        latitude,
                        longitude,
                    });
                    setDeviceLocation([latitude, longitude]);
                }
            } catch (err) {
                console.error("Error al actualizar la ubicación:", err);
                toast.error("Error al actualizar la ubicación.");
            }
        },
        [device.id, deviceLocation]
    );*/

    /*useEffect(() => {
        const intervalId = setInterval(simulateDeviceMovement, 1000);
        return () => clearInterval(intervalId);
    }, [simulateDeviceMovement]);*/

    /** Ejecuta el control de la ubicacion del dispositivo en comparacion a la geocerca */
    useEffect(() => {
        if (deviceLocation) {
            const [latitude, longitude] = deviceLocation;
            updateDevicePath(latitude, longitude);

            if (!checkInsideGeofence(deviceLocation)) {
                setError("¡El dispositivo está fuera de la geocerca!");
            } else {
                setError(null);
            }
        }
    }, [deviceLocation, updateDevicePath, checkInsideGeofence]);

    /** Ejecuta LA funcion para obtener la ubicacion del device y actualizar en la DB */
    /*useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            try {
                const coords = await getCurrentPosition();
                if (isMounted && coords) {
                    updateLocation(coords.latitude, coords.longitude);
                }
            } catch (err) {
                if (isMounted) setError("No se pudo obtener la ubicación");
            }
        }, 30000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [getCurrentPosition, updateLocation]);*/

    return (
        <Authenticated>
            <Head title="Show Mapa" />
            <h1 className="text-xl font-semibold text-gray-300">
                Mapa de Envío
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loading && <p>Cargando ubicación...</p>}
            {rutaEnvioDevice?.coordenadas}
            <div className="mt-4 w-full h-[500px]">
                <Map
                    center={origenCoords}
                    zoom={15}
                >
                    <Polygon
                        positions={memoizedGeocercaCoords}
                        color={geocerca.color}
                        weight={2}
                    />
                    {deviceLocation && (
                        <Marker position={deviceLocation} icon={deviceIcon}>
                            <Popup>Ubicación del vehículo</Popup>
                        </Marker>
                    )}
                    {/*<RoutingMachine
                        origenCoords={origenCoords}
                        destinoCoords={envioCoords}
                    />*/}
                    {rutaEnvioDevice &&
                        rutaEnvioDevice.coordenadas.length > 0 && (
                            <Polyline
                                positions={JSON.parse(rutaEnvioDevice.coordenadas)}
                                color={rutaEnvioDevice.color}
                            />
                        )}
                    {/*<Polyline positions={devicePath} color="green" />*/}
                    {/*<p>
                        Coordenadas actuales:{" "}
                        {JSON.stringify(
                            rutaCoordenadas[currentIndex - 1] || null
                        )}
                    </p>*/}
                </Map>
            </div>
        </Authenticated>
    );
}
