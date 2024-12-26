// Definición de la interfaz para geocerca
export interface MantenimientoInterface {
    id: number;
    vehicle_id: string;
    matricula: string;
    conductor: string;
    fecha: string;
    observaciones: string;
    estado: string;
    driver_id: number;
    [key: string]: unknown;
}
