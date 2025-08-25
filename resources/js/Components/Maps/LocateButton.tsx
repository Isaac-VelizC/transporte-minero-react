import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const LocateButton = () => {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useEffect(() => {
    map.on("locationfound", (e) => {
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("📍 Estás aquí")
        .openPopup();

      L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
    });

    map.on("locationerror", (e) => {
      alert("No se pudo obtener tu ubicación: " + e.message);
    });
  }, [map]);

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 z-[1000] bg-white shadow-lg rounded-full p-3 hover:bg-gray-200"
    >
      <i className="bi bi-geo-alt-fill text-xl text-blue-600"></i>
    </button>
  );
};

export default LocateButton;
