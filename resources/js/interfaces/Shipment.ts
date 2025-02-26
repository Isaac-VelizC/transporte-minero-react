import { AltercationReportInterface } from "./AltercationReport";
import { CargoShipmentVehicleScheduleInterface } from "./CargoShipmentVehicleSchedule";
import { PersonaInterface } from "./Persona";
import { TipoMineralInterface } from "./TipoMineral";

export interface ShipmentInterface {
    id: number;
    vehicle_schedules: CargoShipmentVehicleScheduleInterface[];
    altercado_reports?: AltercationReportInterface[];
    client: PersonaInterface;
    mineral: TipoMineralInterface;
    programming: number[];
    peso: string;
    origen: string;
    destino: string;
    status: string;
    fecha_envio: string;
    fecha_entrega: string;
    notas: string;
    sub_total: number;
    total: number;
    client_latitude: number;
    client_longitude: number;
    origen_latitude: number;
    origen_longitude: number;
    delete: boolean;
    [key: string]: unknown;
}

export type FormShipmentType = {
    id: number;
    programming: number[];
    client_id: number;
    mineral_id: number;
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
