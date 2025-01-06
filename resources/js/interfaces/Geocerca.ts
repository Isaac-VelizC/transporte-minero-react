import { UserInterface } from "./User";

// Definición de la interfaz para geocerca
export interface GeocercaInterface {
    id: number;
    name: string;
    polygon_coordinates: string;
    type: string;
    description: string;
    is_active: boolean;
    creator: UserInterface;
    color: string;
    [key: string]: unknown;
}
