import { PersonaInterface } from "./Persona";
import { ScheduleInterface } from "./schedule";

export interface RenunciaUser {
    id: number;
    message: string;
    vehicle: number;
    envio: number;
    fecha: string;
    conductor: PersonaInterface;
    schedule: ScheduleInterface;
}
