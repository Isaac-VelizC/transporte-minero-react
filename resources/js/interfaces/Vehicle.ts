// Definición de la interfaz para un usuario
export interface VehicleInterface {
    id: number;
    matricula: string;
    modelo: string;
    type_id: string;
    mark_id: string;
    color: string;
    fecha_compra: string;
    status: string;
    responsable?: string;
    capacidad_carga: string;
    fecha_ultima_revision?: string;
}
