import { DeviceInterface } from "./Device";
import { MarksInterface, TypeInterface } from "./Modelo";
import { PersonaInterface } from "./Persona";

// Definición de la interfaz para un usuario
export interface VehicleInterface {
    id: number;
    matricula: string;
    modelo: string;
    tipo: TypeInterface;
    marca: MarksInterface;
    color: string;
    fecha_compra: string;
    image?: string;
    status: string;
    driver?: PersonaInterface;
    responsable_id: number;
    kilometrage: number;
    capacidad_carga: string;
    device?: DeviceInterface;
    [key: string]: unknown;
}

export type FormVehicleType = {
    id: number;
    matricula: string;
    modelo: string;
    type_id: number;
    mark_id: number;
    device_id: number;
    color: string;
    fecha_compra: string;
    status: string;
    kilometrage: number;
    capacidad_carga: number;
    image?: File;
}