import { GeocercaInterface } from "@/interfaces/Geocerca";
import { Marker, Polygon, useMapEvents } from "react-leaflet";
import { customIcon, HomeIcon } from "../IconMap";
import Map from "./Map";
import MapSeach from "./MapSearch";

type Props = {
    latitud: number | null;
    longitud: number | null;
    origenLatitud: number | null;
    origenLongitud: number | null;
    geocercas?: GeocercaInterface[];
    onChange: (lat: number, lon: number, type: "origen" | "destino") => void;
    selectionType: "origen" | "destino";
};

const SelectOrigenDestinoMap: React.FC<Props> = ({
    latitud,
    longitud,
    origenLatitud,
    origenLongitud,
    geocercas,
    onChange,
    selectionType,
}) => {
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const { lat, lng } = e.latlng;
                onChange(lat, lng, selectionType);
            },
        });
        return null;
    };

    return (
        <div className="w-full h-90">
            <MapSeach
                center={[latitud || -19.58361, longitud || -65.75306]}
                zoom={13}
            >
                <MapClickHandler />
                {/* Mostrar marcador del destino */}
                {latitud !== null && longitud !== null && (
                    <Marker position={[latitud, longitud]} icon={customIcon} />
                )}
                {/* Mostrar marcador del origen */}
                {origenLatitud !== null && origenLongitud !== null && (
                    <Marker
                        position={[origenLatitud, origenLongitud]}
                        icon={HomeIcon}
                    />
                )}
                {/* Mostrar geocercas */}
                {geocercas &&
                    geocercas.map((geocerca) => (
                        <Polygon
                            key={geocerca.id}
                            positions={JSON.parse(geocerca.polygon_coordinates)}
                            pathOptions={{ color: geocerca.color, weight: 2 }}
                        />
                    ))}
            </MapSeach>
        </div>
    );
};

export default SelectOrigenDestinoMap;
