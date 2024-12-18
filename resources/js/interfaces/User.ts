// Definición de la interfaz para un usuario
export interface UserInterface {
    id: number;
    user_id: number;
    full_name: string;
    nombre: string;
    ap_pat: string;
    ap_mat: string;
    ci: string;
    email: string;
    genero: string;
    numero: string;
    estado: boolean;
    rol: string;
    [key: string]: unknown;
}
