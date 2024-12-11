import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polygon,
    Circle,
    Polyline,
} from "react-leaflet";

type Props = {
    geocercas: GeocercaInterface[];
};

const Index: React.FC<Props> = ({ geocercas }) => {
    const pathCoordinates: [number, number][] = [
        [-19.572297, -65.769080], // Punto de inicio
        [-19.570911, -65.763407], // Punto intermedio
        [-19.574173, -65.754901], // Punto final
    ];    
    return (
        <Authenticated>
            <Head title="Map" />
            <Breadcrumb pageName="Map" />
            <div className=" h-150 w-full">
                <MapContainer
                    center={[51.505, -0.09]} // Coordenadas iniciales del mapa
                    zoom={13} // Nivel de zoom
                    style={{ height: "100%", width: "100%" }} // Tamaño del mapa
                >
                    {/* Agregar un TileLayer (capa base) */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/*Renderizar geocercas*/}
                    {geocercas.map((geocerca, index) => {
                        const polygonCoordinates = geocerca.polygon_coordinates
                            ? JSON.parse(geocerca.polygon_coordinates)
                            : [];

                        // Calcular el centroide del polígono
                        const centroid =
                            polygonCoordinates.length > 0
                                ? polygonCoordinates
                                      .reduce(
                                          (
                                              acc: [number, number],
                                              coord: [number, number]
                                          ) => {
                                              acc[0] += coord[0];
                                              acc[1] += coord[1];
                                              return acc;
                                          },
                                          [0, 0]
                                      )
                                      .map(
                                          (value: number) =>
                                              value / polygonCoordinates.length
                                      )
                                : null;

                        return geocerca.polygon_coordinates ? (
                            <React.Fragment key={index}>
                                {/* Geocerca poligonal */}
                                <Polygon
                                    positions={polygonCoordinates}
                                    pathOptions={{ color: "#0000FF" }} // Color dinámico
                                >
                                    <Popup>{geocerca.name}</Popup>
                                </Polygon>
                                {centroid && (
                                    <Marker position={centroid}>
                                        <Popup>{`Centro de ${geocerca.name}`}</Popup>
                                    </Marker>
                                )}
                            </React.Fragment>
                        ) : (
                            // Geocerca circular
                            <Circle
                                key={index}
                                center={[geocerca.latitude, geocerca.longitude]}
                                radius={geocerca.radius}
                                pathOptions={{ color: "#FF0000" }}
                            >
                                <Popup>{geocerca.name}</Popup>
                            </Circle>
                        );
                    })}


        <Polyline
            key={`route`}
            positions={pathCoordinates}
            pathOptions={{ color: "red", weight: 4 }}
        >
            <Popup>Ruta #{'index' + 1}</Popup>
        </Polyline>

                    {/* Agregar un marcador con un popup */}
                    {/*<Marker position={[51.505, -0.09]}>
                        <Popup>
                            Un marcador en Londres.
                            <br /> ¡Puedes hacer clic aquí!
                        </Popup>
                    </Marker>*/}
                </MapContainer>
            </div>
        </Authenticated>
    );
};

export default Index;
