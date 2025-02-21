import { useEffect, useState, useMemo } from "react";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    GoogleMap,
    Marker,
    Polygon,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";
import useDeviceTracking from "@/Components/Maps/Api/userLocation";
import axios from "axios";

type Props = {
    envio: ShipmentInterface;
    geocercas: GeocercaInterface[];
    device: number;
    last_location: { latitude: number; longitude: number };
    origen: { latitude: number; longitude: number };
    destino: { latitude: number; longitude: number };
    status: string;
    googleMapsApiKey: string;
    mapBoxsApiKey: string;
};

type LatLngLiteral = {
    lat: number;
    lng: number;
};

type ProcessedGeocerca = {
    coords: LatLngLiteral[];
    color: string;
};

export default function ShowMapa({
    envio,
    geocercas,
    device,
    last_location,
    origen,
    destino,
    status,
    googleMapsApiKey,
    mapBoxsApiKey,
}: Props) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    //const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);
    //const [ruta, setRuta] = useState<google.maps.LatLngLiteral[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    //const [rutaEnvioDevice, setRutaEnvioDevice] = useState<number[][]>([]);
    //const [alertTriggered, setAlertTriggered] = useState(false);
    //const [alerta, setAlerta] = useState(false);
    //const { location, error } = useUserLocation();
    const [deviceLocation, setDeviceLocation] = useState<[number, number]>([
        last_location.latitude,
        last_location.longitude,
    ]);
    const [destinoLocation, setDestinoLocation] = useState<[number, number]>([
        destino.latitude,
        destino.longitude,
    ]);
    const [origenLocation, setOrigenLocation] = useState<[number, number]>([
        origen.latitude,
        origen.longitude,
    ]);
    /**Geocercas Listo se visualiza */
    const processedGeocercas = useMemo<ProcessedGeocerca[]>(() => {
        return geocercas.map((geo) => ({
            coords: (
                JSON.parse(geo.polygon_coordinates as unknown as string) as [
                    number,
                    number
                ][]
            ).map(([lat, lng]) => ({
                lat,
                lng,
            })),
            color: geo.color || "blue",
        }));
    }, [geocercas]);

    /** Creates a route from origin to destination */
    const fetchRoute = async () => {
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${envio.origen_longitude},${envio.origen_latitude};${envio.client_longitude},${envio.client_latitude}?geometries=geojson&access_token=${mapBoxsApiKey}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.data.routes || response.data.routes.length === 0) {
                throw new Error("No routes found");
            }

            const route = response.data.routes[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]]
            );

            setRouteCoordinates(route);
        } catch (err) {
            console.error("Error fetching route:", err);
        }
    };

    /**Api del Mapa */
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });

    /*const fetchRuta = async () => {
        try {
            const response = await axios.get(
                `/ruta_devices/${envio.id}/ruta/${device}`
            );
            if (response.data) {
                setRutaEnvioDevice(response.data);
            }
        } catch (error) {
            console.error("Error obteniendo la ruta del dispositivo:", error);
        }
    };*/

    /**Control de alertas* */
    /*const checkInsideGeofence = useCallback(
        (coords: [number, number]) => {
            if (!processedGeocercas.length) return false;
            const point = turf.point(coords);
            
            return processedGeocercas.some(({ coords: geoCoords }) => {
                // 🔹 Convertimos a [lng, lat]
                const closedCoords = [...geoCoords, geoCoords[0]].map(({ lat, lng }) => [lng, lat]);
                const polygon = turf.polygon([closedCoords]);
    
                return turf.booleanPointInPolygon(point, polygon);
            });
        },
        [processedGeocercas]
    );
    
    useEffect(() => {
        if (!deviceLocation || processedGeocercas.length === 0) return;
    
        const inside = checkInsideGeofence(deviceLocation);
    
        if (!inside) {
            if (!alertTriggered) {
                setAlerta(true);
                setAlertTriggered(true);
            }
        } else {
            if (alertTriggered) {
                setAlerta(false);
                setAlertTriggered(false);
            }
        }
    }, [deviceLocation, processedGeocercas, alertTriggered]);*/

    const deviceLocationNew = useDeviceTracking(envio.id, device);

    useEffect(() => {
        if (deviceLocationNew) {
            setDeviceLocation(deviceLocationNew);
            //fetchRuta();
        }
    }, [deviceLocationNew]);

    useEffect(() => {
        if (last_location) {
            setDeviceLocation([
                last_location.latitude,
                last_location.longitude,
            ]);
        }
        if (
            envio.origen_latitude &&
            envio.origen_longitude &&
            envio.client_latitude &&
            envio.client_longitude
        ) {
            fetchRoute();
        }
    }, [last_location, origen, destino]);

    return (
        <Authenticated>
            <Head title="Show Mapa" />
            <h1 className="text-xl font-semibold text-gray-300">
                Mapa de Envío
            </h1>
            <div className="w-full h-[500px]">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{
                            lat: +deviceLocation[0],
                            lng: +deviceLocation[1],
                        }}
                        zoom={16}
                        onLoad={(map) => setMap(map)}
                    >
                        {/* Marker del origen */}
                        <Marker
                            position={{
                                lat: +destinoLocation[0],
                                lng: +destinoLocation[1],
                            }}
                            title="O"
                        />
                        {/* Marker del origen */}
                        <Marker
                            position={{
                                lat: +origenLocation[0],
                                lng: +origenLocation[1],
                            }}
                            title="D"
                        />
                        {/* 📌 Marker del vehículo en tiempo real */}
                        <Marker
                            position={{
                                lat: +deviceLocation[0],
                                lng: +deviceLocation[1],
                            }}
                            icon={{
                                url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
                                scaledSize: new google.maps.Size(24, 24),
                            }}
                        />
                        {/* Dibuja la ruta en el mapa */}
                        {routeCoordinates.length > 0 && (
                            <Polyline
                                path={routeCoordinates.map(([lat, lng]) => ({
                                    lat,
                                    lng,
                                }))}
                                options={{
                                    strokeColor: "red",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                }}
                            />
                        )}
                        {/* 📌 Dibujar ruta del dispositivo */}
                        {/*rutaEnvioDevice && (
                            <Polyline
                                path={rutaEnvioDevice.map(([lat, lng]) => ({
                                    lat,
                                    lng,
                                }))}
                                options={{
                                    strokeColor: "green",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                }}
                            />
                        )*/}
                        {/* 📌 Dibujar geocercas */}
                        {processedGeocercas.map((geo, index) => (
                            <Polygon
                                key={index}
                                paths={geo.coords}
                                options={{
                                    fillColor: geo.color,
                                    fillOpacity: 0.3,
                                    strokeColor: geo.color,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                }}
                            />
                        ))}
                    </GoogleMap>
                ) : (
                    <p>Cargando mapa...</p>
                )}
            </div>
        </Authenticated>
    );
}
