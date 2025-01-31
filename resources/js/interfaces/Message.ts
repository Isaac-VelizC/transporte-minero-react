import { PersonaInterface } from "./Persona";

// Definición de la interfaz para un usuario
export interface PersonaMessageInterface {
    id: number;
    nombre: string;
    ap_pat: string;
    ap_mat: string;
    numero: string;
    estado: boolean;
    rol: string;
    messages: MessageInterface[];
    [key: string]: unknown;
}


export interface MessageInterface {
    id: number;
    body: string;
    fecha: string;
    receptor: string;
    control: PersonaInterface;
    [key: string]: unknown;
}
