import { CargoShipmentVehicleScheduleInterface } from "./CargoShipmentVehicleSchedule";
import { UserInterface } from "./User";

export interface ReportsInterface {
    id: number;
    vehicle_schedules: CargoShipmentVehicleScheduleInterface[]; // Objeto del vehículo asociado al reporte
    client: UserInterface; // Objeto del cliente asociado al reporte
    //conductor: UserInterface; // Objeto del cliente asociado al reporte
    peso: string; // Peso asociado al reporte
    destino: string; // Destino del envío
    status: string;
    fecha_envio: string;
    [key: string]: unknown; // Permite propiedades adicionales no definidas explícitamente
}
