import { DriverInterface } from "./Driver";
import { PersonaInterface } from "./Persona";
import { ScheduleInterface } from "./schedule";
import { ShipmentInterface } from "./Shipment";
import { VehicleInterface } from "./Vehicle";

export interface CargoShipmentVehicleScheduleInterface {
    id: number;
    cargoShipment: ShipmentInterface;
    vehicleSchedule: ScheduleInterface;
    vehicle: VehicleInterface;
    driver: DriverInterface;
    conductor?: PersonaInterface;
    [key: string]: unknown;
}