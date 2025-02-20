import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { ShipmentInterface } from "@/interfaces/Shipment";
import { GeocercaInterface } from "@/interfaces/Geocerca";
//import { DeviceInterface } from "@/interfaces/Device";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
//import { customIcon, deviceIcon, HomeIcon } from "@/Components/IconMap";
//import * as turf from "@turf/turf";
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
    const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);
    const [rutaEnvioDevice, setRutaEnvioDevice] = useState<number[][]>([]);
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
    /** Vrea una ruta del origen al destino */
    const obtenerRuta = (
        origenLat: number,
        origenLng: number,
        destinoLat: number,
        destinoLng: number
    ) => {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: { lat: +origenLat, lng: +origenLng },
                destination: { lat: +destinoLat, lng: +destinoLng },
                travelMode: google.maps.TravelMode.DRIVING, // Puede ser WALKING, BICYCLING, TRANSIT
            },
            (result, status) => {
                if (status === "OK" && result?.routes[0]?.overview_path) {
                    setRuta(
                        result.routes[0].overview_path.map((point) => ({
                            lat: point.lat(),
                            lng: point.lng(),
                        }))
                    );
                } else {
                    console.error("Error obteniendo la ruta:", status);
                }
            }
        );
    };
    /**Api del Mapa */
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCxdnXI9ynUVZZrYRISuq2Tn04IO50a_64",
    });
    
    const fetchRuta = async () => {
        try {
            const response = await axios.get(`/ruta_devices/${envio.id}/ruta/${device}`);
            if (response.data) {
                setRutaEnvioDevice(response.data);
            }
        } catch (error) {
            console.error("Error obteniendo la ruta del dispositivo:", error);
        }
    };

    //const { isLoaded } = useLoadScript({ googleMapsApiKey: "AIzaSyBo-dWYW5JkpbSRrgtOSipl2P5rTX8mlJA" });
    /*const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCxdnXI9ynUVZZrYRISuq2Tn04IO50a_64",
        libraries: ["places"],
    });*/

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
            fetchRuta();
        }
    }, [deviceLocationNew]);

    useEffect(() => {
        if (last_location) {
            setDeviceLocation([
                last_location.latitude,
                last_location.longitude,
            ]);
        }
        obtenerRuta(
            origen.latitude,
            origen.longitude,
            destino.latitude,
            destino.longitude
        );
    }, [last_location]);

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
                        zoom={14}
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
                                    strokeWeight: 4,
                                }}
                            />
                        )}
                        {/* 📌 Dibujar ruta del dispositivo */}
                        {rutaEnvioDevice && (
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
                        )}
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
