import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { DeviceInterface } from "@/interfaces/Device";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Marker, Polygon, Polyline, Popup } from "react-leaflet";
import { customIcon, deviceIcon, HomeIcon } from "@/Components/IconMap";
import * as turf from "@turf/turf";
import Map from "@/Components/Maps/Map";
import toast from "react-hot-toast";
import ModalAlerta from "../Admin/Map/ModalAlerta";

type Props = {
    envio: ShipmentInterface;
    geocercas: GeocercaInterface[];
    device: DeviceInterface;
    rutaEnvioDevice?: number[][];
};

const token =
    "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA"; // Asegúrate de definirlo
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

// Función para calcular la distancia entre dos coordenadas en metros
const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371000; // Radio de la Tierra en metros
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
};

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
    const [rutaUpdated, setRutaUpdate] = useState<number[][]>(
        rutaEnvioDevice || []
    );
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
            type: geo.type
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
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origenCoords[1]},${origenCoords[0]};${envioCoords[1]},${envioCoords[0]}?geometries=geojson&overview=full&access_token=${token}`
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
                if (!navigator.geolocation) {
                    setLoading(false);
                    reject(
                        new Error(
                            "Geolocalización no es compatible en este navegador."
                        )
                    );
                    return;
                }

                navigator.permissions
                    .query({ name: "geolocation" })
                    .then((permission) => {
                        if (permission.state === "denied") {
                            setLoading(false);
                            reject(new Error("Permiso de ubicación denegado."));
                            return;
                        }

                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                setLoading(false);
                                resolve(position.coords);
                            },
                            (err) => {
                                setLoading(false);
                                reject(err);
                            },
                            {
                                enableHighAccuracy: true, // Usar GPS en lugar de torres de celular
                                timeout: 10000, // Esperar hasta 10s por mejor precisión
                                maximumAge: 0, // No usar caché de ubicación
                            }
                        );
                    })
                    .catch((err) => {
                        setLoading(false);
                        reject(err);
                    });
            });
        }, []);

    /*const getGoogleLocation = async (): Promise<{ lat: number; lng: number;} | null> => {
            try {
                const apiKey = "AIzaSyBkhbdloKALu7gJWvja0GT82-mtLvVFqWY"; // Reemplázalo con tu clave real
                const response = await fetch(
                    `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ considerIp: true }), // Esto usa la IP para obtener la ubicación
                    }
                );
        
                // Verifica si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
        
                const data = await response.json();
                if (data.location) {
                    return { lat: data.location.lat, lng: data.location.lng };
                } else {
                    console.error("No se encontró la ubicación en la respuesta de Google.");
                }
            } catch (error) {
                console.error("Error obteniendo la ubicación de Google:", error);
            }
        
            return null;
        };*/

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
                if (!deviceLocation) {
                    // Si no hay ubicación previa, guardamos la nueva
                    setDeviceLocation([latitude, longitude]);
                } else {
                    // Calculamos la distancia entre la nueva y la última ubicación registrada
                    const distancia = calcularDistancia(
                        deviceLocation[0],
                        deviceLocation[1],
                        latitude,
                        longitude
                    );

                    console.log(
                        `Distancia calculada: ${distancia.toFixed(2)} metros`
                    );

                    // Si la distancia es menor a 10m, no guardamos
                    if (distancia < 10) {
                        console.log(
                            "No se guarda la ubicación, sigue en el mismo lugar."
                        );
                        return;
                    }

                    // Guardamos la nueva ubicación solo si supera los 10m de distancia
                    const response = await axios.put(
                        `/devices/${device.id}/location/${envio.id}`,
                        { latitude, longitude }
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
        const intervalId = setInterval(async () => {
            try {
                const coords = await getCurrentPosition();
                if (coords) {
                    updateLocation(coords.latitude, coords.longitude);
                }
            } catch (err) {
                setError("No se pudo obtener la ubicación");
            }
        }, 30000);

        return () => {
            clearInterval(intervalId); // Limpieza del intervalo cuando el componente se desmonta
        };
    }, [getCurrentPosition, updateLocation]);

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    useEffect(() => {
        if (rutaUpdated.length > 1) {
            obtenerRutaOptimizada(rutaUpdated, setRutaUpdate);
        }
    }, [updateLocation]);

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
                <Map
                    center={deviceLocation ? deviceLocation : origenCoords}
                    zoom={13}
                >
                    {closedGeocercaCoords.map((geoData, index) => (
                        <Polygon
                            key={index}
                            positions={geoData.coords}
                            weight={2}
                            color={geoData.color}
                        >
                            <Popup>{geoData.type}</Popup>
                        </Polygon>
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
                    {rutaUpdated.length > 0 && (
                        <Polyline
                            positions={rutaUpdated as [number, number][]}
                            color={"green"}
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

const obtenerRutaOptimizada = async (
    rutaUpdated: number[][],
    setRutaUpdate: (ruta: number[][]) => void
) => {
    try {
        if (!Array.isArray(rutaUpdated) || rutaUpdated.length < 2) return;
        const MAX_COORDS = 25; // Límite de Mapbox
        let nuevaRuta: number[][] = [];

        for (let i = 0; i < rutaUpdated.length; i += MAX_COORDS - 1) {
            const segmento = rutaUpdated.slice(i, i + MAX_COORDS);

            if (segmento.length < 2) break; // Evitar errores con segmentos menores a 2 puntos

            const coordenadasString = segmento
                .map((coord) => `${coord[1]},${coord[0]}`)
                .join(";");

            console.log("📌 Coordenadas enviadas a Mapbox:", coordenadasString);

            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${coordenadasString}?geometries=geojson&overview=full&steps=false&access_token=${token}`
            );

            if (!response.data.routes || response.data.routes.length === 0) {
                console.warn(
                    "⚠️ No se recibieron rutas de Mapbox para el segmento."
                );
                continue;
            }

            // Extraer coordenadas y convertirlas a [lat, lon]
            let subRuta = response.data.routes[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]]
            );

            nuevaRuta = subRuta;
        }

        console.log("📌 Ruta final optimizada:", nuevaRuta);
        setRutaUpdate(nuevaRuta);
    } catch (error) {
        console.error("❌ Error obteniendo la ruta optimizada:", error);
    }
};
