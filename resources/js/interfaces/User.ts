import { PersonaInterface } from "./Persona";
import { RolesInterface } from "./Roles";

// Definición de la interfaz para un usuario
export interface UserInterface {
    id: number;
    name: string;
    email: string;
    persona: PersonaInterface;
    role: RolesInterface;
    [key: string]: unknown;
}
