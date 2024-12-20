export interface ShipmentInterface {
    id: number;
    car_id: number;
    programming: number;
    matricula: string;
    client_id: number;
    full_name: string;
    peso: string;
    destino: string;
    status: string;
    fecha_envio: string;
    fecha_entrega: string;
    notas: string;
    geofence_id: number;
    geocerca_name: string;
    client_latitude: number;
    client_longitude: number;
    delete: boolean;
    [key: string]: unknown;
}
