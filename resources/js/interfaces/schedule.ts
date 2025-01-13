import { DriverInterface } from "./Driver";
import { VehicleInterface } from "./Vehicle";

// Definición de la interfaz para un usuario
export interface ScheduleInterface {
    id: number;
    vehicle: VehicleInterface;
    start_time: string;
    end_time: string;
    driver: DriverInterface;
    status: string;
    status_time: boolean;
    [key: string]: unknown;
}

export type FormScheduleType = {
    id: number;
    car_id: number;
    driver_id: number;
    conductor?: string;
    matricula?: string;
};
