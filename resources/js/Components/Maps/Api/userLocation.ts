import axios from "axios";
import { useEffect, useRef, useState } from "react";

// 🟢 Almacena ubicaciones en localStorage cuando no hay internet
const storeOfflineRoute = (latitude: number, longitude: number) => {
    const offlineRoutes = JSON.parse(localStorage.getItem("offline_routes") || "[]");
    offlineRoutes.push({
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
    });
    localStorage.setItem("offline_routes", JSON.stringify(offlineRoutes));
};

// 🟢 Sincroniza ubicaciones guardadas en localStorage con el backend
const syncOfflineRoutes = async (deviceId: number, envioId: number) => {
    const offlineRoutes = JSON.parse(localStorage.getItem("offline_routes") || "[]");
    
    if (offlineRoutes.length === 0) return;
    try {
        const response = await axios.post("/api/sync-route", {
            rutas: offlineRoutes,
            envioId,
            device: deviceId,
        });

        if (response.status === 200) {
            console.log("✅ Rutas sincronizadas con éxito");
            localStorage.removeItem("offline_routes");
        }
    } catch (error) {
        console.error("❌ Error al sincronizar rutas:", error);
    }
};

// 🟢 Hook para rastrear la ubicación del dispositivo en tiempo real
const useDeviceTracking = (envioId: number, deviceId: number, isTracking: boolean) => {
    const [deviceLocation, setDeviceLocation] = useState<[number, number] | null>(null);
    const lastLocationRef = useRef<[number, number] | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Referencia del intervalo

    useEffect(() => {
        if (!isTracking) return;

        let cancelTokenSource = axios.CancelToken.source();
        let watchId: number;

        const trackLocation = () => {
            if (!("geolocation" in navigator)) return;

            watchId = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation: [number, number] = [latitude, longitude];

                    if (
                        lastLocationRef.current &&
                        lastLocationRef.current[0] === latitude &&
                        lastLocationRef.current[1] === longitude
                    ) {
                        return; // Si la ubicación no ha cambiado, no hacer nada
                    }

                    lastLocationRef.current = newLocation;
                    setDeviceLocation(newLocation);

                    if (navigator.onLine) {
                        try {
                            await axios.post(
                                `/devices/${deviceId}/location/${envioId}`,
                                { latitude, longitude },
                                {
                                    withCredentials: true,
                                    cancelToken: cancelTokenSource.token,
                                }
                            );
                            console.log("✅ Ubicación enviada:", { latitude, longitude });
                        } catch (error: any) {
                            if (axios.isCancel(error)) {
                                console.log("⚠️ Petición cancelada:", error.message);
                            } else {
                                console.error("❌ Error enviando ubicación:", error);
                                storeOfflineRoute(latitude, longitude);
                            }
                        }
                    } else {
                        storeOfflineRoute(latitude, longitude); // Guardar offline si no hay conexión
                    }
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("El usuario negó el permiso para acceder a la ubicación.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("La ubicación no está disponible.");
                            break;
                        case error.TIMEOUT:
                            console.error("Tiempo de espera agotado para obtener la ubicación.");
                            break;
                        default:
                            console.error("Error desconocido al obtener la ubicación.");
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 15000,
                    timeout: 8000,
                }
            );
        };

        trackLocation();

        // 🟢 Evento para detectar cuándo vuelve la conexión y sincronizar datos
        const handleOnline = async () => {
            console.log("🌍 Conexión restablecida. Intentando sincronizar datos...");
            await syncOfflineRoutes(deviceId, envioId);
        };

        window.addEventListener("online", handleOnline);

        // 🟢 Guardar ubicación en localStorage cada 20 segundos si no hay internet
        intervalRef.current = setInterval(() => {
            if (!navigator.onLine && lastLocationRef.current) {
                const [latitude, longitude] = lastLocationRef.current;
                console.log("📌 Guardando ubicación offline:", { latitude, longitude });
                storeOfflineRoute(latitude, longitude);
            }
        }, 20000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            window.removeEventListener("online", handleOnline);
            cancelTokenSource.cancel("Componente desmontado, petición cancelada.");
            if (intervalRef.current) clearInterval(intervalRef.current); // Limpiar intervalo
        };
    }, [envioId, deviceId, isTracking]);

    return deviceLocation;
};

export default useDeviceTracking;
