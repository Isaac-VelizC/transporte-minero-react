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
import { Marker, Popup, Polygon, Polyline } from "react-leaflet";
import * as turf from "@turf/turf";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Map from "@/Components/Maps/Map";
import { RutaEnvioDeviceInterface } from "@/interfaces/RutaEnvioDevice";
import axios from "axios";
import ModalAlerta from "./ModalAlerta";
import { CargoShipmentVehicleScheduleInterface } from "@/interfaces/CargoShipmentVehicleSchedule";
import { GeocercaInterface } from "@/interfaces/Geocerca";

type Props = {
    envio: ShipmentInterface;
    altercados?: AltercationReportInterface[];
    rutaEnvioDevices?: RutaEnvioDeviceInterface[];
    vehicleSeleccionados: CargoShipmentVehicleScheduleInterface[];
    geocercas: GeocercaInterface[];
};

interface ResponseDevice {
    id: number;
    latitude: number;
    longitude: number;
    coordenadas: [number, number][];
}

const Index: React.FC<Props> = ({
    envio,
    altercados = [],
    rutaEnvioDevices = [],
    vehicleSeleccionados = [],
    geocercas = [],
}) => {
    const [alertTriggered, setAlertTriggered] = useState(false);

    const [rutaUpdated, setRutaUpdate] = useState<[number, number][][]>([]);

    useEffect(() => {
        // Mapeamos los datos de rutaEnvioDevices para parsear las coordenadas
        const parsedRoutes =
            rutaEnvioDevices?.map((rutaEnvioDevice) => {
                try {
                    // Convertimos la cadena JSON en un array de arrays
                    const parsedCoords = JSON.parse(
                        rutaEnvioDevice.coordenadas
                    );
                    return parsedCoords; // Esto ya es un array de coordenadas
                } catch (error) {
                    console.warn("Error al parsear las coordenadas:", error);
                    return []; // Si hay un error, devolvemos un array vacío
                }
            }) || [];

        // Actualizamos el estado con las rutas parseadas
        setRutaUpdate(parsedRoutes);
    }, [rutaEnvioDevices]); // Solo ejecutamos cuando rutaEnvioDevices cambie

    const token =
        "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    const [alerta, setAlerta] = useState(false);

    const envioCoords: [number, number] = [
        envio.client_latitude,
        envio.client_longitude,
    ];
    const origenCoords: [number, number] = [
        envio.origen_latitude,
        envio.origen_longitude,
    ];

    const [deviceLocations, setDeviceLocations] = useState<[number, number][]>(
        () => {
            return vehicleSeleccionados
                ? vehicleSeleccionados
                      .filter(
                          (vehicle) =>
                              vehicle.vehicle.device?.last_latitude &&
                              vehicle.vehicle.device?.last_longitude
                      )
                      .map((vehicle) => {
                          const lastLatitude =
                              vehicle.vehicle.device?.last_latitude;
                          const lastLongitude =
                              vehicle.vehicle.device?.last_longitude;

                          // Asegúrate de que lastLatitude y lastLongitude sean cadenas antes de analizarlas
                          return [
                              lastLatitude ? JSON.parse(lastLatitude) : 0, // Valor por defecto si es undefined
                              lastLongitude ? JSON.parse(lastLongitude) : 0, // Valor por defecto si es undefined
                          ];
                      })
                : [];
        }
    );

    // Manejo de geocercas correctamente
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
        if (deviceLocations.length === 0 || closedGeocercaCoords.length === 0)
            return;

        // Verificamos si al menos un dispositivo está fuera de la geocerca
        const anyDeviceOutside = deviceLocations.some(
            (location) => !checkInsideGeofence(location)
        );

        if (anyDeviceOutside) {
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
    }, [deviceLocations, closedGeocercaCoords, alertTriggered]);

    const handleCloseAlert = () => {
        setAlerta(false);
        setAlertTriggered(true);
    };

    const updateRutasDevices = async (deviceId: number[], envioId: number) => {
        try {
            const response = await axios.post("/update-devices-ruta", {
                device_ids: deviceId,
                envio_id: envioId,
            });
            if (response.status === 200) {
                const updatedDevices = response.data;

                if (Array.isArray(updatedDevices)) {
                    updatedDevices.forEach((device) => {
                        const { latitude, longitude, coordenadas } = device;

                        // Actualizar las ubicaciones del dispositivo
                        setDeviceLocations((prevLocations) => [
                            ...prevLocations,
                            [latitude, longitude],
                        ]);

                        // Actualizar la ruta con las coordenadas del dispositivo
                        setRutaUpdate((prevRoutes) => [
                            ...prevRoutes,
                            ...coordenadas,
                        ]);
                    });
                }
            } else {
                throw new Error("Error al actualizar la ubicación");
            }
            // Manejar la respuesta si es necesario
        } catch (error) {
            console.error("Error actualizando la ruta del dispositivo:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const intervalId = setInterval(async () => {
            if (isMounted && vehicleSeleccionados.length > 0) {
                const deviceIds = vehicleSeleccionados
                    .map((device) => device.vehicle.device?.id)
                    .filter((id): id is number => id !== undefined); // Filtrar IDs válidos y asegurar que son números

                if (deviceIds.length > 0) {
                    await updateRutasDevices(deviceIds, envio.id); // Pasar el array completo
                }
            }
        }, 20000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [envio.id, vehicleSeleccionados]);

    // Obtención de la ruta entre origen y destino
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
        }
    };

    useEffect(() => {
        fetchRoute();
    }, []);

    return (
        <Authenticated>
            <Head title="Mapa" />
            <ModalAlerta show={alerta} onClose={handleCloseAlert} />
            <div className="h-150 w-full">
                <Map center={envioCoords} zoom={15}>
                    {/* Renderizar geocercas */}
                    {closedGeocercaCoords.map((geoData, index) => (
                        <Polygon
                            key={index}
                            positions={geoData.coords}
                            weight={2}
                            color={geoData.color}
                        />
                    ))}

                    {/* Coordenadas del destino */}
                    <Marker position={envioCoords} icon={customIcon}>
                        <Popup>{envio.destino}</Popup>
                    </Marker>

                    {/* Coordenadas del origen */}
                    <Marker position={origenCoords} icon={HomeIcon}>
                        <Popup>{envio.origen}</Popup>
                    </Marker>

                    {/* Trayecto del dispositivo */}
                    {altercados.map((item, index) => (
                        <Marker
                            key={index}
                            position={[item.last_latitude, item.last_longitude]}
                            icon={AltercadoIcon}
                        >
                            <Popup>{item.description}</Popup>
                        </Marker>
                    ))}

                    {/* Ubicación del dispositivo */}
                    {deviceLocations.map((location, index) => (
                        <Marker
                            key={index}
                            position={location}
                            icon={deviceIcon}
                        >
                            <Popup>Vehículo {index + 1}</Popup>
                        </Marker>
                    ))}

                    {/* Ruta del Camión o Dispositivo */}
                    {rutaUpdated.length > 0 &&
                        rutaUpdated.map((coords, index) => (
                            <Polyline
                                key={index}
                                positions={coords}
                                color={'green'}
                            />
                        ))}
                    {/* Dibuja la ruta en el mapa */}
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="red" />
                    )}
                </Map>
            </div>
        </Authenticated>
    );
};

export default Index;
