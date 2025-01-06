import { DriverInterface } from "./Driver";
import { UserInterface } from "./User";

// Definición de la interfaz para un usuario
export interface PersonaInterface {
    id: number;
    user: UserInterface;
    full_name: string;
    nombre: string;
    ap_pat: string;
    ap_mat: string;
    ci: string;
    genero: string;
    numero: string;
    estado: boolean;
    driver?: DriverInterface;
    rol: string;
    [key: string]: unknown;
}
