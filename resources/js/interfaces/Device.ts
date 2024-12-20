// Definición de la interfaz para devices
export interface DeviceInterface {
    id: number;
    num_serial: string;
    name_device: string;
    type: string;
    car_id: number;
    status: string;
    last_latitude: string;
    last_longitude: string;
    last_updated_at: string;
    update_interval: string;
    [key: string]: unknown;
}
