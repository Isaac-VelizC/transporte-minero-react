import { UserInterface } from "./User";
import { VehicleInterface } from "./Vehicle";

export interface ReportsInterface {
    id: number; // Identificador único del reporte
    vehicle: VehicleInterface; // Objeto del vehículo asociado al reporte
    client: UserInterface; // Objeto del cliente asociado al reporte
    conductor: UserInterface; // Objeto del cliente asociado al reporte
    peso: string; // Peso asociado al reporte
    destino: string; // Destino del envío
    status: string; // Estado del reporte (por ejemplo, 'pendiente', 'completado', etc.)
    [key: string]: unknown; // Permite propiedades adicionales no definidas explícitamente
}
