import { PersonaInterface } from "./Persona";

// Definición de la interfaz para geocerca
export interface DriverInterface {
    id: number;
    persona: PersonaInterface;
    hiring_date: string;
    license_number: string;
    status: boolean;
    experiencia: number;
    direccion: string;
}
