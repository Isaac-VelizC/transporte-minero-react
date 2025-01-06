import { DriverInterface } from "./Driver";
import { ShipmentInterface } from "./Shipment";
import { VehicleInterface } from "./Vehicle";

// Definición de la interfaz para devices
export interface AltercationReportInterface {
    id: number;
    vehiculo: VehicleInterface;
    envio: ShipmentInterface;
    driver: DriverInterface;
    description: string;
    fecha: string;
    last_latitude: string;
    last_longitude: string;
    [key: string]: unknown;
}
