import axios from "axios";
import { useEffect, useRef, useState } from "react";

// 🟢 Función para almacenar datos en localStorage si no hay conexión
const storeOfflineRoute = (latitude: number, longitude: number) => {
    const offlineRoutes = JSON.parse(
        localStorage.getItem("offline_routes") || "[]"
    );
    offlineRoutes.push({
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
    });
    localStorage.setItem("offline_routes", JSON.stringify(offlineRoutes));
};

// 🟢 Función para enviar las ubicaciones almacenadas en localStorage cuando haya conexión
const syncOfflineRoutes = async () => {
    if (navigator.onLine) {
        const offlineRoutes = JSON.parse(
            localStorage.getItem("offline_routes") || "[]"
        );
        if (offlineRoutes.length > 0) {
            try {
                /*await fetch("/api/sync-route", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rutas: offlineRoutes,
                        envioId: envio.id,
                    }),
                });*/

                localStorage.removeItem("offline_routes"); // Borrar datos después de sincronizar
            } catch (error) {
                console.error("Error al sincronizar rutas:", error);
            }
        }
    }
};

const useDeviceTracking = (envioId: number, deviceId: number) => {
    const [deviceLocation, setDeviceLocation] = useState<[number, number] | null>(null);
    const lastLocationRef = useRef<[number, number] | null>(null);

    useEffect(() => {
        let cancelTokenSource = axios.CancelToken.source();
        const trackLocation = () => {
            if (!("geolocation" in navigator)) return;

            const watchId = navigator.geolocation.watchPosition(
                
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation: [number, number] = [latitude, longitude];

                    // Evitar envíos innecesarios si la ubicación no ha cambiado
                    if (
                        lastLocationRef.current &&
                        lastLocationRef.current[0] === latitude &&
                        lastLocationRef.current[1] === longitude
                    ) {
                        return;
                    }
                    lastLocationRef.current = newLocation;
                    setDeviceLocation(newLocation);
                    if (navigator.onLine) {
                        try {
                            await axios.post(`/devices/${deviceId}/location/${envioId}`, { latitude, longitude },
                                {
                                    withCredentials: true,
                                    cancelToken: cancelTokenSource.token,
                                }
                            );
                            console.log("Ubicación enviada:", { latitude, longitude });
                        } catch (error: any) {
                            if (axios.isCancel(error)) {
                                console.log("Petición cancelada:", error.message);
                            } else {
                                console.error("Error enviando ubicación:", error);
                            }
                        }
                    } else {
                        storeOfflineRoute(latitude, longitude);
                    }
                },
                (error) => console.error("Error obteniendo ubicación:", error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000,
                }
            );

            return () => {
                navigator.geolocation.clearWatch(watchId);
                cancelTokenSource.cancel("Componente desmontado, petición cancelada.");
            };
        };

        trackLocation();

        // Sincronizar rutas cuando haya conexión
        window.addEventListener("online", syncOfflineRoutes);

        return () => {
            window.removeEventListener("online", syncOfflineRoutes);
            cancelTokenSource.cancel("Componente desmontado, petición cancelada.");
        };
    }, [envioId, deviceId]);

    return deviceLocation;
};

export default useDeviceTracking;
