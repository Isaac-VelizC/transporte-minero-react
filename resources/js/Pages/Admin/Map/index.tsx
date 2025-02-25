import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as turf from "@turf/turf";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import axios from "axios";
import ModalAlerta from "./ModalAlerta";
import { GeocercaInterface } from "@/interfaces/Geocerca";

import {
    GoogleMap,
    InfoWindow,
    Marker,
    Polygon,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";

type DatosLastLocation = {
    matricula: string;
    conductor: string;
    carga: string;
    tiempo: string;
    device_id: number;
    latitude: number;
    longitude: number;
};

type Props = {
    envio: ShipmentInterface;
    geocercas: GeocercaInterface[];
    vehicles: { vehicle: { id: number; device?: { id: number } } }[];
    rutasDevices: { device_id: number; ruta: number[][] }[];
    lastLocations: DatosLastLocation[];
    altercados: AltercationReportInterface[];
    googleMapsApiKey: string;
    mapBoxsApiKey: string;
};

const Index: React.FC<Props> = ({
    envio,
    geocercas,
    rutasDevices,
    lastLocations,
    altercados,
    googleMapsApiKey,
    mapBoxsApiKey,
}) => {
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        type: string;
    } | null>(null);

    const [selectedLocationVehicle, setSelectedLocationVehicle] = useState<{
        lat: number;
        lng: number;
        matricula: string;
        conductor: string;
        carga: string;
        tiempo: string;
    } | null>(null);

    const [alerta, setAlerta] = useState(false);
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const iconSize = new window.google.maps.Size(50, 50);
    //const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    /**Api del Mapa */
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
    });
    const [rutas, setRutas] =
        useState<{ device_id: number; ruta: number[][] }[]>(rutasDevices);
    const [ubicaciones, setUbicaciones] = useState(lastLocations);

    /** Vrea una ruta del origen al destino */
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
        if (ubicaciones.length === 0 || closedGeocercaCoords.length === 0)
            return;
        // Verificamos si al menos un dispositivo está fuera de la geocerca
        const anyDeviceOutside = ubicaciones.some(
            (location) =>
                !checkInsideGeofence([location.latitude, location.longitude])
        );

        if (anyDeviceOutside) {
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
    }, [ubicaciones, closedGeocercaCoords, alertTriggered]);

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    useEffect(() => {
        if (
            envio.origen_latitude &&
            envio.origen_longitude &&
            envio.client_latitude &&
            envio.client_longitude
        ) {
            fetchRoute();
        }
    }, [envio]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchRutas = async () => {
            try {
                const response = await axios.get(`/envios/${envio.id}/rutas`);
                if (response.data) {
                    setRutas(response.data.rutasDevices);
                    setUbicaciones(response.data.lastLocations);
                }
            } catch (error) {
                console.error("Error obteniendo rutas:", error);
            }
        };
        // Ejecutar la consulta inmediatamente al montar el componente
        fetchRutas();
        // Actualizar cada 5 segundos
        intervalId = setInterval(fetchRutas, 20000);

        return () => clearInterval(intervalId);
    }, [envio.id]);

    // Colores para las rutas de los vehículos
    const colors = ["blue", "green", "purple", "orange", "cyan"];

    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: +envio.origen_latitude,
        lng: +envio.origen_longitude,
    });

    useEffect(() => {
        setCenter((prevCenter) => {
            const newCenter = {
                lat: +envio.origen_latitude,
                lng: +envio.origen_longitude,
            };

            // Solo actualiza si realmente cambió
            return JSON.stringify(prevCenter) !== JSON.stringify(newCenter)
                ? newCenter
                : prevCenter;
        });
    }, [envio.origen_latitude, envio.origen_longitude]);

    // Función para mover el mapa manualmente
    const moveToLocation = (lat: number, lng: number) => {
        if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
        }
    };

    return (
        <Authenticated>
            <Head title="Mapa" />
            <ModalAlerta show={alerta} onClose={handleCloseAlert} />
            <div className="h-150 w-full">
                {isLoaded ? (
                    <>
                        <GoogleMap
                            mapContainerStyle={{
                                width: "100%",
                                height: "100%",
                            }}
                            center={center}
                            zoom={14}
                            onLoad={(map) => setMap(map)}
                        >
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
                            {/* 📍 Dibujar Geocercas */}
                            {geocercas.map((geo) => {
                                const paths = JSON.parse(
                                    geo.polygon_coordinates
                                ); // Convertir string a array de coordenadas
                                return (
                                    <Polygon
                                        key={geo.id}
                                        paths={paths.map(
                                            ([lat, lng]: [number, number]) => ({
                                                lat,
                                                lng,
                                            })
                                        )}
                                        options={{
                                            fillColor: geo.color || "#FF0000",
                                            fillOpacity: 0.3,
                                            strokeColor: geo.color || "#FF0000",
                                            strokeWeight: 2,
                                        }}
                                    />
                                );
                            })}

                            {/* 📌 Dibujar todas las rutas de los dispositivos */}
                            {rutas.map((ruta, index) => (
                                <Polyline
                                    key={ruta.device_id}
                                    path={ruta.ruta.map(([lat, lng]) => ({
                                        lat,
                                        lng,
                                    }))}
                                    options={{
                                        strokeColor:
                                            colors[index % colors.length],
                                        strokeOpacity: 0.8,
                                        strokeWeight: 4,
                                    }}
                                />
                            ))}

                            {/* 📍 Última ubicación de cada vehículo */}
                            {ubicaciones.map((ubicacion) => (
                                <Marker
                                    key={ubicacion.device_id}
                                    position={{
                                        lat: ubicacion.latitude,
                                        lng: ubicacion.longitude,
                                    }}
                                    icon={{
                                        url: "https://maps.google.com/mapfiles/kml/pal4/icon15.png",
                                        scaledSize: iconSize,
                                    }}
                                    onClick={() =>
                                        setSelectedLocationVehicle({
                                            lat: +ubicacion.latitude,
                                            lng: +ubicacion.longitude,
                                            matricula: ubicacion.matricula,
                                            conductor: ubicacion.conductor,
                                            carga: ubicacion.carga,
                                            tiempo: ubicacion.tiempo,
                                        })
                                    }
                                />
                            ))}

                            {/* 📍 Marcador del Origen */}
                            <Marker
                                position={{
                                    lat: +envio.origen_latitude,
                                    lng: +envio.origen_longitude,
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                }}
                                onClick={() =>
                                    setSelectedLocation({
                                        lat: +envio.origen_latitude,
                                        lng: +envio.origen_longitude,
                                        type: envio.origen,
                                    })
                                }
                            />

                            {/* Trayecto del dispositivo */}
                            {altercados.map((item, index) => (
                                <Marker
                                    key={index}
                                    position={{
                                        lat: +item.last_latitude,
                                        lng: +item.last_longitude,
                                    }}
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                        scaledSize: new window.google.maps.Size(
                                            20,
                                            20
                                        ),
                                    }}
                                    onClick={() =>
                                        setSelectedLocation({
                                            lat: +item.last_latitude,
                                            lng: +item.last_longitude,
                                            type: item.description,
                                        })
                                    }
                                ></Marker>
                            ))}

                            {/* 🎯 Marcador del Destino */}
                            <Marker
                                position={{
                                    lat: +envio.client_latitude,
                                    lng: +envio.client_longitude,
                                }}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                                }}
                                onClick={() =>
                                    setSelectedLocation({
                                        lat: +envio.client_latitude,
                                        lng: +envio.client_longitude,
                                        type: envio.destino,
                                    })
                                }
                            />

                            {/* 🏷️ Popup de Información */}
                            {selectedLocation && (
                                <InfoWindow
                                    position={{
                                        lat: selectedLocation.lat,
                                        lng: selectedLocation.lng,
                                    }}
                                    onCloseClick={() =>
                                        setSelectedLocation(null)
                                    }
                                >
                                    <div>
                                        <h3 className="font-bold">
                                            {selectedLocation.type}
                                        </h3>
                                    </div>
                                </InfoWindow>
                            )}
                            {/* 🏷️ Popup de Información del vehiculo */}
                            {selectedLocationVehicle && (
                                <InfoWindow
                                    position={{
                                        lat: selectedLocationVehicle.lat,
                                        lng: selectedLocationVehicle.lng,
                                    }}
                                    onCloseClick={() =>
                                        setSelectedLocationVehicle(null)
                                    }
                                >
                                    <div className="flex flex-col">
                                        <h3 className="font-bold mb-2">
                                            {selectedLocationVehicle.matricula}
                                        </h3>
                                        <ul>
                                            <li>
                                                Llega en:{" "}
                                                {selectedLocationVehicle.tiempo}
                                            </li>
                                            <li>
                                                Conductor:{" "}
                                                {
                                                    selectedLocationVehicle.conductor
                                                }
                                            </li>
                                            <li>
                                                Carga:{" "}
                                                {selectedLocationVehicle.carga}
                                            </li>
                                        </ul>
                                    </div>
                                </InfoWindow>
                            )}
                            {ubicaciones.map((ubic, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        moveToLocation(
                                            ubic.latitude,
                                            ubic.longitude
                                        )
                                    }
                                    className={
                                        "absolute bottom-4 left-4 px-4 py-2 bg-black text-white rounded-lg"
                                    }
                                >
                                    <i className="bi bi-truck"></i> {index + 1}
                                </button>
                            ))}
                        </GoogleMap>
                    </>
                ) : (
                    <p>Cargando mapa...</p>
                )}
            </div>
        </Authenticated>
    );
};

export default Index;
