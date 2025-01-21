import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "react-hot-toast";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { router, usePage } from "@inertiajs/react";
import { DeviceInterface } from "@/interfaces/Device";
import axios from "axios"; // Usa axios para realizar la petición correctamente

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [devicePermiso, setDevicePermiso] = useState(false);
    const [devices, setDevices] = useState<DeviceInterface[]>([]);
    const { rol } = usePage().props.auth;

    // Función para obtener dispositivos activos si el usuario es Conductor
    const fetchDevices = async () => {
        if (rol === "Conductor") {
            try {
                const { data } = await axios.get("/list/devices/actives"); // Corregido: Usar axios en lugar de router.get
                setDevices(data); // Almacenar los dispositivos obtenidos
            } catch (error) {
                console.error("Error al obtener dispositivos:", error);
            }
        }
    };

    // Llamar a fetchDevices cuando el componente se monta o rol cambia
    useEffect(() => {
        fetchDevices();
    }, [rol]);

    useEffect(() => {
        if (rol === "Conductor") {
            const loadFingerprint = async () => {
                try {
                    const fp = await FingerprintJS.load();
                    const result = await fp.get();
                    const deviceId = result.visitorId;
                    // Verificar si el dispositivo está permitido
                    const isDeviceAllowed = devices?.some(
                        (device) => device.visorID === deviceId
                    );

                    if (isDeviceAllowed) {
                        setDevicePermiso(true);
                        console.log("Permitido");
                    } else {
                        setDevicePermiso(false);
                        console.log("No permitido");
                        router.visit("/error");
                    }
                } catch (error) {
                    console.error("Error obteniendo huella digital:", error);
                }
                if (devices.length > 0) {
                    loadFingerprint();
                }
            };
        } else {
            setDevicePermiso(true);
        }
    }, [devices]); // Ejecutar cada vez que `devices` cambie

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            {!devicePermiso ? (
                <div className="h-screen w-screen flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        <Header
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                            />
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                {children}
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
            )}
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </div>
    );
}
