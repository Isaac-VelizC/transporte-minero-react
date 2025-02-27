import React, { useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Marker, Polygon, Popup } from "react-leaflet";
import toast from "react-hot-toast";
import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Map from "@/Components/Maps/Map";
import {
    GeocercaIcon,
    GeocercaIconDescanso,
    GeocercaIconMantenimiento,
    GeocercaIconPeligro,
    GeocercaIconSeguridad,
} from "@/Components/IconMap";

// Mapeo de tipos de geocerca a iconos
const geocercaIconMap: { [key: string]: L.Icon } = {
    zona_de_trabajo: GeocercaIcon,
    zona_de_peligro: GeocercaIconPeligro,
    zona_de_descanso: GeocercaIconDescanso,
    Zonas_de_mantenimiento: GeocercaIconMantenimiento,
    Zonas_de_seguridad_y_emergencia: GeocercaIconSeguridad,
};

// Define props type
interface Props {
    geocercas: GeocercaInterface[];
}

const Index: React.FC<Props> = ({ geocercas }) => {
    const { flash } = usePage().props;
    // Display flash messages
    useEffect(() => {
        if (flash.error) toast.error(flash.error);
    }, [flash]);
    // Calculate polygon centroid
    const calculateCentroid = (coordinates: [number, number][]) => {
        if (!coordinates.length) return null;
        const centroid = coordinates.reduce(
            (acc, coord) => {
                acc[0] += coord[0];
                acc[1] += coord[1];
                return acc;
            },
            [0, 0]
        );
        return [
            centroid[0] / coordinates.length,
            centroid[1] / coordinates.length,
        ];
    };

    return (
        <Authenticated>
            <Head title="Geocercas" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Geocercas", path: "/geocerca" },
                ]}
            />
            <div>
                <div className="flex justify-end my-4">
                    <LinkButton href="geocerca.create">Nuevo</LinkButton>
                </div>
                <div className="h-150 w-full">
                    <Map zoom={13} center={[-19.58361, -65.75306]}>
                        {geocercas.map((geocerca) => {
                            const polygonCoordinates =
                                geocerca.polygon_coordinates
                                    ? JSON.parse(geocerca.polygon_coordinates)
                                    : [];
                            const centroid =
                                calculateCentroid(polygonCoordinates);

                            // Determinar el icono basado en el tipo de geocerca
                            const geocercaTypeIcon =
                                geocercaIconMap[geocerca.type] || GeocercaIcon; // Usa GeocercaIcon por defecto si no hay coincidencia

                            return (
                                <React.Fragment key={geocerca.id}>
                                    {polygonCoordinates.length > 0 && (
                                        <Polygon
                                            positions={polygonCoordinates}
                                            color={
                                                geocerca.is_active
                                                    ? geocerca.color
                                                    : "red"
                                            }
                                        >
                                            <Popup>{geocerca.name}</Popup>
                                        </Polygon>
                                    )}

                                    {centroid && centroid.length === 2 && (
                                        <Marker
                                            position={
                                                centroid as [number, number]
                                            }
                                            icon={geocercaTypeIcon}
                                        >
                                            <Popup>
                                                {`Centro de ${geocerca.name}`}{" "}
                                                <Link
                                                    href={route(
                                                        "geocerca.edit",
                                                        geocerca.id
                                                    )}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>
                                            </Popup>
                                        </Marker>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Map>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
