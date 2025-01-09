import React, { useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import toast from "react-hot-toast";
import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { GeocercaInterface } from "@/interfaces/Geocerca";

// Define props type
interface Props {
    geocercas: GeocercaInterface[];
}

const Index: React.FC<Props> = ({ geocercas }) => {
    const { flash } = usePage().props;

    // Display flash messages
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
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
                    <MapContainer
                        center={[-19.58361, -65.75306]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {geocercas.map((geocerca) => {
                            const polygonCoordinates =
                                geocerca.polygon_coordinates
                                    ? JSON.parse(geocerca.polygon_coordinates)
                                    : [];
                            const centroid =
                                calculateCentroid(polygonCoordinates);

                            return (
                                <React.Fragment key={geocerca.id}>
                                    {polygonCoordinates.length > 0 && (
                                        <Polygon
                                            positions={polygonCoordinates}
                                            color={geocerca.is_active ? geocerca.color : 'red'}
                                        >
                                            <Popup>{geocerca.name}</Popup>
                                        </Polygon>
                                    )}

                                    {centroid && centroid.length === 2 && (
                                        <Marker
                                            position={
                                                centroid as [number, number]
                                            }
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
                    </MapContainer>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
