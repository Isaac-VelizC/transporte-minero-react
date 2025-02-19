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

const token =
    "pk.eyJ1IjoiaXNhay0tanVseSIsImEiOiJjbTRobmJrY28wOTBxMndvZ2dpNnA0bTRuIn0.RU4IuqQPw1evHwaks9yxqA";

const Index: React.FC<Props> = ({
    envio,
    altercados = [],
    rutaEnvioDevices = [],
    vehicleSeleccionados = [],
    geocercas = [],
}) => {
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [rutasUpdated, setRutasUpdate] = useState<number[][][]>([]);

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
        setRutasUpdate(parsedRoutes);
    }, [rutaEnvioDevices]);

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
                        setRutasUpdate((prevRoutes) => [
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
        }, 30000);
        
        obtenerRutasOptimizadas(rutasUpdated, setRutasUpdate);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [envio.id, vehicleSeleccionados]);

    // Obtención de la ruta entre origen y destino
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
                    {/* Dibuja la ruta en el mapa */}
                    {routeCoordinates.length > 0 && (
                        <Polyline positions={routeCoordinates} color="red" />
                    )}
                    {/* Ruta del Camión o Dispositivo */}
                    {rutasUpdated.length > 0 &&
                        rutasUpdated.map((ruta, index) => (
                            <Polyline
                                key={index}
                                positions={ruta as [number, number][]}
                                color="green"
                            />
                        ))}
                </Map>
            </div>
        </Authenticated>
    );
};

export default Index;

const obtenerRutasOptimizadas = async (
    rutasOriginales: number[][][],
    setRutasUpdate: (rutas: number[][][]) => void
) => {
    try {
        if (!Array.isArray(rutasOriginales) || rutasOriginales.length === 0)
            return;
        const MAX_COORDS = 25; // Límite de Mapbox
        let nuevasRutas: number[][][] = [];

        for (const ruta of rutasOriginales) {
            if (!Array.isArray(ruta) || ruta.length < 2) continue;
            let nuevaRuta: number[][] = [];

            for (let i = 0; i < ruta.length; i += MAX_COORDS - 1) {
                const segmento = ruta.slice(i, i + MAX_COORDS);

                if (segmento.length < 2) break; // Evitar errores con segmentos menores a 2 puntos

                const coordenadasString = segmento
                    .map((coord) => `${coord[1]},${coord[0]}`)
                    .join(";");

                const response = await axios.get(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordenadasString}?geometries=geojson&overview=full&steps=false&access_token=${token}`
                );

                if (
                    !response.data.routes ||
                    response.data.routes.length === 0
                ) {
                    console.warn(
                        "⚠️ No se recibieron rutas de Mapbox para el segmento."
                    );
                    continue;
                }

                // Extraer coordenadas y convertirlas a [lat, lon]
                let subRuta = response.data.routes[0].geometry.coordinates.map(
                    (coord: number[]) => [coord[1], coord[0]]
                );

                nuevaRuta = [...nuevaRuta, ...subRuta]; // Acumular segmentos
            }

            nuevasRutas.push(nuevaRuta);
        }

        console.log("Rutas finales optimizadas:", nuevasRutas);
        setRutasUpdate(nuevasRutas);
    } catch (error) {
        console.error("Error obteniendo las rutas optimizadas:", error);
    }
};
