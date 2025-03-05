import { useEffect, useState, useMemo, useCallback } from "react";
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
import * as turf from "@turf/turf";
import axios from "axios";
import ShowEnvio from "./showEnvio";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import ModalAlerta from "../Admin/Map/ModalAlerta";
import LeafletMapComponent from "./LeafletMapComponent";

type Props = {
    envio: ShipmentInterface;
    geocercas: GeocercaInterface[];
    altercados: AltercationReportInterface[];
    device: number;
    last_location: { latitude: number; longitude: number };
    origen: { latitude: number; longitude: number };
    destino: { latitude: number; longitude: number };
    status: string;
    googleMapsApiKey: string;
    mapBoxsApiKey: string;
    vehicleId: number | null;
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
    altercados,
    vehicleId,
}: Props) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const iconSize = new window.google.maps.Size(50, 50);
    //const [ruta, setRuta] = useState<google.maps.LatLngLiteral[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    const [rutaEnvioDevice, setRutaEnvioDevice] = useState<number[][]>([]);
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [alerta, setAlerta] = useState(false);
    //const { location, error } = useUserLocation();
    const [isTracking, setIsTracking] = useState(false);
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

    /** Creates a route from origin to destination */
    const fetchRoute = async () => {
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${envio.origen_longitude},${envio.origen_latitude};${envio.client_longitude},${envio.client_latitude}?geometries=geojson&overview=full&access_token=${mapBoxsApiKey}`,
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

    const fetchRuta = async () => {
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
    };
    /**Control de alertas* */
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

    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (!deviceLocation || closedGeocercaCoords.length === 0) return;

        const isInside = checkInsideGeofence(deviceLocation);
        const lastStatus = localStorage.getItem("geofence_status") || "outside";

        if (isInside && lastStatus === "outside") {
            // 🚨 Entró en la geocerca (pero solo muestra la alerta una vez)
            if (!alertTriggered) {
                setAlertMessage("¡El dispositivo ha entrado a la geocerca!");
                setAlerta(true);
                setAlertTriggered(true);
            }
            localStorage.setItem("geofence_status", "inside");
        } else if (!isInside && lastStatus === "inside") {
            // 🚨 Salió de la geocerca
            setAlertMessage("¡El dispositivo ha salido de la geocerca!");
            setAlerta(true);
            setAlertTriggered(true);
            localStorage.setItem("geofence_status", "outside");
        }
    }, [deviceLocation, closedGeocercaCoords, alertTriggered]);

    useEffect(() => {
        if (deviceLocation) {
            localStorage.setItem("last_device_location", JSON.stringify(deviceLocation));
        }
    }, [deviceLocation]);

    useEffect(() => {
        const savedLocation = localStorage.getItem("last_device_location");
        if (savedLocation) {
            setDeviceLocation(JSON.parse(savedLocation));
        }
    }, []);    

    const deviceLocationNew = useDeviceTracking(envio.id, device, isTracking);

    useEffect(() => {
        if (isTracking && deviceLocationNew) {
            setDeviceLocation(deviceLocationNew);
            fetchRuta();
        }
    }, [deviceLocationNew, isTracking]);

    const toggleTracking = () => {
        setIsTracking(!isTracking);
    };

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

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <Authenticated>
            <Head title="Ver Mapa" />
            <ShowEnvio
                dataCarga={envio}
                device_id={device}
                altercados={altercados}
                vehicleId={vehicleId}
            />
            <ModalAlerta
                show={alerta}
                onClose={handleCloseAlert}
                message={alertMessage}
            />
            <div className="my-10">
                <h1 className="text-xl font-semibold text-gray-300">
                    Mapa de Envío
                </h1>
                {status == "en_transito" && (
                    <button
                        onClick={toggleTracking}
                        className="my-3 text-white border-none rounded-md py-2 px-3"
                        style={{
                            backgroundColor: isTracking ? "red" : "green",
                        }}
                    >
                        {isTracking ? "Detener Monitoreo" : "Iniciar Monitoreo"}
                    </button>
                )}
                <div className="w-full h-[500px]">
                    {isOnline ? (
                        <>
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{
                                        width: "100%",
                                        height: "100%",
                                    }}
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
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                            scaledSize: iconSize,
                                        }}
                                    />
                                    {/* Marker del origen */}
                                    <Marker
                                        position={{
                                            lat: +origenLocation[0],
                                            lng: +origenLocation[1],
                                        }}
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                            scaledSize: iconSize,
                                        }}
                                    />
                                    {/* 📌 Marker del vehículo en tiempo real */}
                                    <Marker
                                        position={{
                                            lat: +deviceLocation[0],
                                            lng: +deviceLocation[1],
                                        }}
                                        icon={{
                                            url: "https://maps.google.com/mapfiles/kml/pal4/icon15.png",
                                            scaledSize: new google.maps.Size(
                                                24,
                                                24
                                            ),
                                        }}
                                    />
                                    {/* Dibuja la ruta en el mapa */}
                                    {routeCoordinates.length > 0 && (
                                        <Polyline
                                            path={routeCoordinates.map(
                                                ([lat, lng]) => ({
                                                    lat,
                                                    lng,
                                                })
                                            )}
                                            options={{
                                                strokeColor: "red",
                                                strokeOpacity: 0.8,
                                                strokeWeight: 4,
                                            }}
                                        />
                                    )}
                                    {/* 📌 Dibujar ruta del dispositivo */}
                                    {rutaEnvioDevice && (
                                        <Polyline
                                            path={rutaEnvioDevice.map(
                                                ([lat, lng]) => ({
                                                    lat,
                                                    lng,
                                                })
                                            )}
                                            options={{
                                                strokeColor: "green",
                                                strokeOpacity: 0.8,
                                                strokeWeight: 4,
                                            }}
                                        />
                                    )}
                                    {/* 📌 Dibujar geocercas */}
                                    {geocercas.map((geo) => {
                                        const paths = JSON.parse(
                                            geo.polygon_coordinates
                                        ); // Convertir string a array de coordenadas
                                        return (
                                            <Polygon
                                                key={geo.id}
                                                paths={paths.map(
                                                    ([lat, lng]: [
                                                        number,
                                                        number
                                                    ]) => ({
                                                        lat,
                                                        lng,
                                                    })
                                                )}
                                                options={{
                                                    fillColor:
                                                        geo.color || "#FF0000",
                                                    fillOpacity: 0.3,
                                                    strokeColor:
                                                        geo.color || "#FF0000",
                                                    strokeWeight: 2,
                                                }}
                                            />
                                        );
                                    })}
                                </GoogleMap>
                            ) : (
                                <p>Cargando mapa...</p>
                            )}
                        </>
                    ) : (
                        <LeafletMapComponent
                        center={[deviceLocation[0], deviceLocation[1]]}
                        markers={[{ lat: deviceLocation[0], lng: deviceLocation[1], label: "Ubicación" }]}
                        polyline={routeCoordinates}
                    />
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
