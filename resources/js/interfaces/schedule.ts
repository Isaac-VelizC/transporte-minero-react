// Definición de la interfaz para un usuario
export interface ScheduleInterface {
    id: number;
    car_id: number;
    matricula_car: string;
    start_time: string;
    end_time: string;
    driver_id: string;
    conductor_name: string;
    status: string;
    status_time: boolean;
}
