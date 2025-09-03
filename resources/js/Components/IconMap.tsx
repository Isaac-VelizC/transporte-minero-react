import L from "leaflet";
const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" /></svg>
`;

export const svgIcon = L.divIcon({
    html: svgHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

export const customIcon = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const peopleIcon = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/shapes/man.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const deviceIcon = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/pal4/icon15.png",
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const deviceOffLine = L.icon({
    iconUrl: "./../assets/icons/icon15.png",
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const HomeIcon = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const AltercadoIcon = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const GeocercaIcon = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const GeocercaIconPeligro = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/pal3/icon34.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const GeocercaIconDescanso = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const GeocercaIconMantenimiento = L.icon({
    iconUrl: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export const GeocercaIconSeguridad = L.icon({
    iconUrl: "https://maps.google.com/mapfiles/kml/pal3/icon38.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});
