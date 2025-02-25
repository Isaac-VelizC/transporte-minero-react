import { useState, useCallback } from "react";

const useOrigenDestino = () => {
    const [ruta, setRuta] = useState<{ lat: number; lng: number }[]>([]);

    const obtenerRuta = useCallback(
        (
            origenLat: number,
            origenLng: number,
            destinoLat: number,
            destinoLng: number
        ) => {
            if (!window.google || !window.google.maps) {
                console.error("Google Maps no está cargado.");
                return;
            }

            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: { lat: +origenLat, lng: +origenLng },
                    destination: { lat: +destinoLat, lng: +destinoLng },
                    travelMode: google.maps.TravelMode.DRIVING, // Otros: WALKING, BICYCLING, TRANSIT
                },
                (result, status) => {
                    if (status === "OK" && result?.routes[0]?.overview_path) {
                        setRuta(
                            result.routes[0].overview_path.map((point) => ({
                                lat: point.lat(),
                                lng: point.lng(),
                            }))
                        );
                    } else {
                        console.error("Error obteniendo la ruta:", status);
                    }
                }
            );
        },
        []
    );

    return { ruta, obtenerRuta };
};

export default useOrigenDestino;

{/**
    const [time, setTime] = useState("");

    const fetchTravelTime = async () => {
        const origin = "40.712776,-74.005974"; // Coordenadas de origen
        const destination = "34.052235,-118.243683"; // Coordenadas de destino

        try {
            const response = await axios.get(`/api/travel-time`, {
                params: { origin, destination },
            });

            const duration = response.data.rows[0].elements[0].duration.text;
            setTime(duration);
        } catch (error) {
            console.error("Error obteniendo el tiempo de ruta", error);
        }
    };

    <div>
                <div>
                    <button onClick={fetchTravelTime}>
                        Obtener Tiempo de Ruta
                    </button>
                    {time && <p>Tiempo estimado: {time}</p>}
                </div>
            </div>

    */}