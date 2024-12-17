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
} from "react-leaflet";

type Props = {
    geocercas: GeocercaInterface[];
};

const Index: React.FC<Props> = ({ geocercas }) => {
    return (
        <Authenticated>
            <Head title="Map" />
            <Breadcrumb pageName="Map" />
            <div className=" h-150 w-full">
                <MapContainer
                    center={[-19.58361, -65.75306]} // Coordenadas iniciales del mapa
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
                            <div>No hay mapa</div>
                        );
                    })}
                </MapContainer>
            </div>
        </Authenticated>
    );
};

export default Index;

{
    /**
    <Circle
        key={index}
        center={[geocerca.latitude, geocerca.longitude]}
        radius={geocerca.radius}
        pathOptions={{ color: "#FF0000" }}
    >
        <Popup>{geocerca.name}</Popup>
    </Circle> */
}
