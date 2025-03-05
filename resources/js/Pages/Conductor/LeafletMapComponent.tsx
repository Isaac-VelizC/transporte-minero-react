import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import { deviceOffLine } from "@/Components/IconMap";

interface LeafletMapProps {
    center: [number, number];
    markers: { lat: number; lng: number; label: string }[];
    polyline?: [number, number][];
}

const LeafletMapComponent: React.FC<LeafletMapProps> = ({ center, markers, polyline }) => {
    const [offlineRoutes, setOfflineRoutes] = useState<{ latitude: number; longitude: number }[]>([]);
    
    // Función para obtener las rutas desde localStorage
    const getOfflineRoutes = () => {
        const storedRoutes = JSON.parse(localStorage.getItem("offline_routes") || "[]");
        setOfflineRoutes(storedRoutes);
    };

    // Escucha cambios en localStorage y actualiza las rutas
    useEffect(() => {
        getOfflineRoutes();
        // Usamos un listener para detectar cuando localStorage cambia
        const handleStorageChange = () => {
            getOfflineRoutes();
        };
        
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Obtener la última ubicación guardada
    const lastStoredLocation = offlineRoutes.length > 0 ? offlineRoutes[offlineRoutes.length - 1] : null;
    const finalCenter: [number, number] = lastStoredLocation
        ? [lastStoredLocation.latitude, lastStoredLocation.longitude]
        : center; // Si no hay ubicación guardada, usa el valor predeterminado 'center'

    // 🟢 Función para almacenar rutas offline
    const storeOfflineRoute = (latitude: number, longitude: number) => {
        const newRoute = { latitude, longitude, timestamp: new Date().toISOString() };
        const updatedRoutes = [...offlineRoutes, newRoute];
        setOfflineRoutes(updatedRoutes); // Actualiza el estado con las nuevas rutas
        localStorage.setItem("offline_routes", JSON.stringify(updatedRoutes)); // Guarda en localStorage
    };

    // Intentar obtener la ubicación del usuario si hay conexión
    if (navigator.onLine && offlineRoutes.length === 0) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
                localStorage.setItem('userLocation', JSON.stringify(userLocation)); // Guardar ubicación
                storeOfflineRoute(position.coords.latitude, position.coords.longitude); // Guardar en offline_routes
            },
            (error) => {
                console.error("No se pudo obtener la ubicación:", error);
            }
        );
    }

    return (
        <MapContainer center={finalCenter} zoom={16} style={{ width: "100%", height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]} icon={deviceOffLine}>
                    <Popup>{marker.label}</Popup>
                </Marker>
            ))}
            {polyline && <Polyline positions={polyline} pathOptions={{ color: "red" }} />}
            {offlineRoutes.map((route, index) => (
                <Marker key={index} position={[route.latitude, route.longitude]}>
                    <Popup>Ubicación registrada en offline</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LeafletMapComponent;
