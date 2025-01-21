import { VehicleInterface } from "./Vehicle";

// Definición de la interfaz para geocerca
export interface MantenimientoInterface {
    id: number;
    vehicle: VehicleInterface;
    fecha_inicio: string;
    fecha_fin: string;
    observaciones: string;
    estado: string;
    taller: string;
    tipo: TipoMantenimientoInterface;
    [key: string]: unknown;
}

export interface TipoMantenimientoInterface {
    id: number;
    name: string;
}

export type FormMantenimientoType = {
    id: number;
    vehicle_id: number;
    taller: string;
    fecha_inicio: string;
    fecha_fin: string;
    observaciones: string;
    tipo: number;
    matricula: string;
}