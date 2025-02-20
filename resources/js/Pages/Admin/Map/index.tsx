import {
    AltercadoIcon,
    customIcon,
    deviceIcon,
    HomeIcon,
} from "@/Components/IconMap";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as turf from "@turf/turf";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";
import { RutaEnvioDeviceInterface } from "@/interfaces/RutaEnvioDevice";
import axios from "axios";
import ModalAlerta from "./ModalAlerta";
import { CargoShipmentVehicleScheduleInterface } from "@/interfaces/CargoShipmentVehicleSchedule";
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
    telefono: string;
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
};

const Index: React.FC<Props> = ({
    envio,
    geocercas,
    vehicles,
    rutasDevices,
    lastLocations,
    altercados,
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
        telefono: string;
    } | null>(null);

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const iconSize = new window.google.maps.Size(50, 50);
    const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);
    /**Api del Mapa */
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCxdnXI9ynUVZZrYRISuq2Tn04IO50a_64",
    });
    const [rutas, setRutas] =
        useState<{ device_id: number; ruta: number[][] }[]>(rutasDevices);
    const [ubicaciones, setUbicaciones] = useState(lastLocations);

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

    useEffect(() => {
        obtenerRuta(
            envio.origen_latitude,
            envio.origen_longitude,
            envio.client_latitude,
            envio.client_longitude
        );
    }, []);

    useEffect(() => {
        // Obtener rutas de todos los dispositivos en tiempo real
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

        fetchRutas();
    }, [envio.id]);

    // Colores para las rutas de los vehículos
    const colors = ["blue", "green", "purple", "orange", "cyan"];

    useEffect(() => {
        if (!map || !window.google?.maps?.geometry) return;

        ubicaciones.forEach((ubicacion) => {
            geocercas.forEach((geo) => {
                const paths = JSON.parse(geo.polygon_coordinates).map(
                    ([lat, lng]: [number, number]) =>
                        new google.maps.LatLng(lat, lng)
                );

                const geocercaPolygon = new google.maps.Polygon({ paths });

                const position = new google.maps.LatLng(
                    ubicacion.latitude,
                    ubicacion.longitude
                );

                const isInside = google.maps.geometry.poly.containsLocation(
                    position,
                    geocercaPolygon
                );

                if (!isInside) {
                    alert(
                        `🚛 Dispositivo ${ubicacion.device_id} está fuera de la geocerca ${geo.name}`
                    );
                    // alert(`📍 Dispositivo ${ubicacion.device_id} está dentro de la geocerca ${geo.name}`);
                }
            });
        });
    }, [ubicaciones, geocercas, map]);

    return (
        <Authenticated>
            <Head title="Mapa" />
            <div className="h-150 w-full">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{
                            lat: +envio.origen_latitude,
                            lng: +envio.origen_longitude,
                        }}
                        zoom={14}
                        onLoad={(map) => setMap(map)}
                    >
                        {ruta.length > 0 && (
                            <Polyline
                                path={ruta}
                                options={{
                                    strokeColor: "red",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 4,
                                }}
                            />
                        )}
                        {/* 📍 Dibujar Geocercas */}
                        {geocercas.map((geo) => {
                            const paths = JSON.parse(geo.polygon_coordinates); // Convertir string a array de coordenadas
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
                                    strokeColor: colors[index % colors.length],
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
                                title={`🚚 Vehículo ${ubicacion.device_id}`}
                                icon={{
                                    url: "https://cdn-icons-png.flaticon.com/512/1514/1514801.png",
                                    scaledSize: iconSize,
                                }}
                                onClick={() =>
                                    setSelectedLocationVehicle({
                                        lat: +ubicacion.latitude,
                                        lng: +ubicacion.longitude,
                                        matricula: ubicacion.matricula,
                                        conductor: ubicacion.conductor,
                                        telefono: ubicacion.telefono,
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
                                    url: "https://cdn-icons-png.flaticon.com/512/814/814108.png",
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
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
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
                                onCloseClick={() => setSelectedLocation(null)}
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
                                    <h3 className="font-bold">
                                        {selectedLocationVehicle.matricula}
                                    </h3>
                                    <ul>
                                        <li>Conductor: {selectedLocationVehicle.conductor}</li>
                                        <li>Teléfono: {selectedLocationVehicle.telefono}</li>
                                    </ul>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                ) : (
                    <p>Cargando mapa...</p>
                )}
            </div>
        </Authenticated>
    );
};

export default Index;
