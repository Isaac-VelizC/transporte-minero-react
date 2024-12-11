import { MapContainer, TileLayer, Polygon, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect, useState } from "react";

interface GeofenceMapProps {
    initialCoordinates?: number[][]; // Coordenadas iniciales del polígono
    onPolygonUpdated: (coordinates: number[][]) => void; // Callback para actualizar el polígono
}

const GeofenceMap: React.FC<GeofenceMapProps> = ({
    initialCoordinates = [],
    onPolygonUpdated,
}) => {
    const [polygon, setPolygon] = useState<[number, number][]>([]);

    const handleCreated = (e: any) => {
        const layer = e.layer;
        if (layer && layer._latlngs) {
            const coordinates = layer._latlngs[0].map((latlng: any) => [
                latlng.lat,
                latlng.lng,
            ]);
            setPolygon(coordinates);
            onPolygonUpdated(coordinates);
        }
    };

    const handleEdited = (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
            if (layer && layer._latlngs) {
                const coordinates = layer._latlngs[0].map((latlng: any) => [
                    latlng.lat,
                    latlng.lng,
                ]);
                setPolygon(coordinates);
                onPolygonUpdated(coordinates);
            }
        });
    };

    useEffect(() => {
        // Convierte `initialCoordinates` a `[number, number][]` si no lo es
        if (initialCoordinates.length > 0) {
            const formattedCoordinates = initialCoordinates.map(coord => {
                if (coord.length === 2) {
                    return [coord[0], coord[1]] as [number, number];
                }
                throw new Error(
                    "Las coordenadas iniciales deben tener exactamente dos valores: latitud y longitud."
                );
            });
            setPolygon(formattedCoordinates);
        }
    }, [initialCoordinates]);

    return (
        <div style={{ height: "400px", width: "100%" }}>
            <MapContainer
                center={
                    initialCoordinates.length > 0 && initialCoordinates[0].length === 2
                        ? (initialCoordinates[0] as [number, number])
                        : [-19.58361, -65.75306]
                }
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        onEdited={handleEdited}
                        draw={{
                            rectangle: false,
                            circle: false,
                            marker: false,
                            circlemarker: false,
                            polyline: false,
                            polygon: true,
                        }}
                        edit={{
                            featureGroup: undefined,
                            remove: true,
                        }}
                    />
                    {polygon.length > 0 && (
                        <Polygon
                            positions={polygon}
                            pathOptions={{ color: "blue", weight: 4 }}
                        />
                    )}
                </FeatureGroup>
            </MapContainer>
        </div>
    );
};

export default GeofenceMap;
