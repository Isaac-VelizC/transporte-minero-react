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
}: Props) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    //const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);
    const [ruta, setRuta] = useState<google.maps.LatLngLiteral[]>([]);
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
    const obtenerRuta = (
        origenLat: any,
        origenLng: any,
        destinoLat: any,
        destinoLng: any,
        waypoints: google.maps.DirectionsWaypoint[] = []
    ) => {
        // Asegurar que sean números
        const origen = { lat: Number(origenLat), lng: Number(origenLng) };
        const destino = { lat: Number(destinoLat), lng: Number(destinoLng) };
    
        if (isNaN(origen.lat) || isNaN(origen.lng) || isNaN(destino.lat) || isNaN(destino.lng)) {
            console.error("Error: Las coordenadas no son válidas", origen, destino);
            return;
        }
    
        //console.log("Calculando ruta desde", origen, "hasta", destino);
    
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origen,
                destination: destino,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints,
                optimizeWaypoints: true,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result?.routes[0]?.legs) {
                    const detailedPath: google.maps.LatLngLiteral[] = [];
    
                    result.routes[0].legs.forEach((leg) => {
                        leg.steps.forEach((step) => {
                            if (step.polyline && step.polyline.points) {
                                const stepPath = google.maps.geometry.encoding.decodePath(step.polyline.points);
                                stepPath.forEach((point) => {
                                    detailedPath.push({ lat: point.lat(), lng: point.lng() });
                                });
                            }
                        });
                    });
                    //console.log("Ruta generada correctamente", detailedPath);
                    setRuta(detailedPath);
                } else {
                    console.error("Error obteniendo la ruta:", status);
                }
            }
        );
    };
    

    /**Api del Mapa */
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.GOOGLE_KEY_MAPS,
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
        // Check if origen and destino are defined and have valid latitude and longitude properties
        if (origen && origen.latitude && origen.longitude && destino && destino.latitude && destino.longitude) {
            obtenerRuta(
                origen.latitude,
                origen.longitude,
                destino.latitude,
                destino.longitude
            );
        } else {
            console.warn("Origen or destino is missing latitude or longitude properties.");
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
                        {ruta.length > 0 && (
                            <Polyline
                                path={ruta}
                                options={{
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 1,
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
