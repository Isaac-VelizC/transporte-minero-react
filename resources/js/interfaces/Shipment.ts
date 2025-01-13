import { GeocercaInterface } from "./Geocerca";
import { PersonaInterface } from "./Persona";
import { ScheduleInterface } from "./schedule";
import { VehicleInterface } from "./Vehicle";

export interface ShipmentInterface {
    id: number;
    vehicle: VehicleInterface;
    schedule: ScheduleInterface;
    client: PersonaInterface;
    conductor: PersonaInterface;
    peso: string;
    origen: string;
    destino: string;
    status: string;
    fecha_envio: string;
    fecha_entrega: string;
    notas: string;
    sub_total: number;
    total: number;
    geocerca?: GeocercaInterface;
    client_latitude: number;
    client_longitude: number;
    origen_latitude: number;
    origen_longitude: number;
    delete: boolean;
    [key: string]: unknown;
}

export type FormShipmentType = {
    id: number;
    programming: number;
    client_id: number;
    geofence_id: number;
    peso: string;
    origen: string;
    destino: string;
    fecha_envio: string;
    fecha_entrega: string;
    notas: string;
    sub_total: number;
    total: number;
    client_latitude: number;
    client_longitude: number;
    origen_latitude: number;
    origen_longitude: number;
};
