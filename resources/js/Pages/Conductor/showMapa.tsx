import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { DeviceInterface } from "@/interfaces/Device";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Marker, Polygon, Polyline, Popup } from "react-leaflet";
import { RutaEnvioDeviceInterface } from "@/interfaces/RutaEnvioDevice";
import { customIcon, deviceIcon, HomeIcon } from "@/Components/IconMap";
import * as turf from "@turf/turf";
import Map from "@/Components/Maps/Map";
import toast from "react-hot-toast";
import ModalAlerta from "../Admin/Map/ModalAlerta";

type Props = {
    envio: ShipmentInterface;
    geocercas: GeocercaInterface[];
    device: DeviceInterface;
    rutaEnvioDevice?: RutaEnvioDeviceInterface;
};

/*const rutaCoordenadas = [
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
];*/

export default function ShowMapa({
    envio,
    geocercas,
    device,
    rutaEnvioDevice,
}: Props) {
    //const [currentIndex, setCurrentIndex] = useState(0); // Para rastrear el índice actual prueba borrar
    const [loading, setLoading] = useState(false);
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [alerta, setAlerta] = useState(false);

    const [rutaUpdated, setRutaUpdate] = useState(rutaEnvioDevice?.coordenadas);
    let token =
        "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";
    const [error, setError] = useState<string | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
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

    /*const memoizedGeocercaCoords = useMemo(
        () => JSON.parse(geocerca.polygon_coordinates),
        [geocerca.polygon_coordinates]
    );*/
    const closedGeocercaCoords = useMemo(() => {
        if (!geocercas.length) return [];

        return geocercas.map((geo) => ({
            coords: JSON.parse(geo.polygon_coordinates) as [number, number][],
            color: geo.color || "blue",
        }));
    }, [geocercas]);

    const checkInsideGeofence = useCallback(
        (coords: [number, number]) => {
            if (!closedGeocercaCoords.length) return false;
            const point = turf.point(coords);
            return closedGeocercaCoords.some(({ coords: geoCoords }) => {
                // Asegurar que el primer y último punto sean iguales
                const closedCoords =
                    geoCoords[0] !== geoCoords[geoCoords.length - 1]
                        ? [...geoCoords, geoCoords[0]]
                        : geoCoords;

                const polygon = turf.polygon([closedCoords]);
                return turf.booleanPointInPolygon(point, polygon);
            });
        },
        [closedGeocercaCoords]
    );

    // Verificación de ubicación del dispositivo en la geocerca
    useEffect(() => {
        if (!deviceLocation || closedGeocercaCoords.length === 0) return;

        if (!checkInsideGeofence(deviceLocation)) {
            if (!alertTriggered) {
                setAlerta(true);
                setAlertTriggered(true); // Aseguramos que la alerta solo se active una vez
            }
        } else {
            if (alertTriggered) {
                setAlerta(false);
                setAlertTriggered(false);
            }
        }
    }, [deviceLocation, closedGeocercaCoords, alertTriggered]);

    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
    ];
    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];

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
    }, []);

    /** Optiene la posision del dispositivo del navegador */
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
    /*const updateLocation = async (latitude: number, longitude: number) => {
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
                const { latitude, longitude, coordenadas } =
                            response.data;
                        setDeviceLocation([latitude, longitude]);
                        SetRutaUpdate(coordenadas);
                console.log("Ubicación actualizada React Prueba:", {
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

    useEffect(() => {
        let isMounted = true;

        const intervalId = setInterval(async () => {
            if (currentIndex < rutaCoordenadas.length && isMounted) {
                const [latitude, longitude] = rutaCoordenadas[currentIndex];

                await updateLocation(latitude, longitude);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(intervalId); // Detener el intervalo si se recorrieron todas las coordenadas
            }
        }, 20000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [currentIndex]); // Dependemos de `currentIndex`*/

    /** Actualiza la coordenadas del dispositivo en la base de datos */
    const updateLocation = useCallback(
        async (latitude: number, longitude: number) => {
            try {
                if (
                    !deviceLocation ||
                    Math.abs(deviceLocation[0] - latitude) > 0.0001 ||
                    Math.abs(deviceLocation[1] - longitude) > 0.0001
                ) {
                    const response = await axios.put(
                        `/devices/${device.id}/location/${envio.id}`,
                        {
                            latitude,
                            longitude,
                        }
                    );
                    if (response.status === 200) {
                        const { latitude, longitude, coordenadas } =
                            response.data;
                        setDeviceLocation([latitude, longitude]);
                        setRutaUpdate(coordenadas);
                    } else {
                        throw new Error("Error al actualizar la ubicación");
                    }
                }
            } catch (err) {
                console.error("Error al actualizar la ubicación:", err);
                toast.error("Error al actualizar la ubicación.");
            }
        },
        [device.id, deviceLocation]
    );

    /** Ejecuta LA funcion para obtener la ubicacion del device y actualizar en la DB */
    useEffect(() => {
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
        }, 20000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [getCurrentPosition, updateLocation]);

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    return (
        <Authenticated>
            <Head title="Show Mapa" />
            <h1 className="text-xl font-semibold text-gray-300">
                Mapa de Envío
            </h1>
            <ModalAlerta show={alerta} onClose={handleCloseAlert} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {loading && <p>Cargando ubicación...</p>}
            <div className="mt-4 w-full h-[500px]">
                <Map center={origenCoords} zoom={15}>
                    {closedGeocercaCoords.map((geoData, index) => (
                        <Polygon
                            key={index}
                            positions={geoData.coords}
                            weight={2}
                            color={geoData.color}
                        />
                    ))}
                    {deviceLocation && (
                        <Marker position={deviceLocation} icon={deviceIcon}>
                            <Popup>Ubicación del vehículo</Popup>
                        </Marker>
                    )}
                    {/* Coordenadas del destino */}
                    <Marker position={envioCoords} icon={customIcon}>
                        <Popup>{envio.destino}</Popup>
                    </Marker>
                    {/* Coordenadas del origen */}
                    <Marker position={origenCoords} icon={HomeIcon}>
                        <Popup>{envio.origen}</Popup>
                    </Marker>
                    {/** Ruta del Camion o dispositivo */}
                    {rutaUpdated && rutaUpdated.length > 0 && (
                        <Polyline
                            positions={JSON.parse(rutaUpdated)}
                            color={rutaEnvioDevice?.color}
                        />
                    )}
                    {/* Dibuja la ruta en el mapa */}
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="red" />
                    )}
                </Map>
            </div>
        </Authenticated>
    );
}
