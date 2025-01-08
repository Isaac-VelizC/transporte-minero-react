import CardCount from "@/Components/Cards/CardCount";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

type Props = {
    usersCount: number;
    driverCount: number;
    clientesCount: number;
    vehicleCount: number;
    geocercasCount: number;
    enviosCount: number;
    enviosPendienteCount: number;
    enviosTransitoCount: number;
    enviosEntregadoCount: number;
};

export default function Dashboard({
    usersCount,
    driverCount,
    clientesCount,
    vehicleCount,
    geocercasCount,
    enviosCount,
    enviosPendienteCount,
    enviosTransitoCount,
    enviosEntregadoCount,
}: Props) {
    const { rol } = usePage().props.auth;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {(rol === "Admin" || rol === "Secretaria")  && (
                            <>
                                <CardCount
                                    icon="people"
                                    title="Usuarios"
                                    result={usersCount}
                                />
                                <CardCount
                                    icon="users"
                                    title="Conductores"
                                    result={driverCount}
                                />
                                <CardCount
                                    icon="users"
                                    title="Clientes"
                                    result={clientesCount}
                                />
                                <CardCount
                                    icon="truck"
                                    title="Camiones"
                                    result={vehicleCount}
                                />
                                <CardCount
                                    icon="geo-alt"
                                    title="Geocercas"
                                    result={geocercasCount}
                                />
                                <CardCount
                                    icon="box"
                                    title="Total de Envios"
                                    result={enviosCount}
                                />
                            </>
                        )}
                        {(rol === "Conductor" || rol === "Cliente")  && (
                            <>
                                <CardCount
                                    icon="box"
                                    title="Total de Envios"
                                    result={enviosCount}
                                />
                                <CardCount
                                    icon="clock"
                                    title="Envios Pendientes"
                                    result={enviosPendienteCount}
                                />
                                <CardCount
                                    icon="box"
                                    title="Envios en Transito"
                                    result={enviosTransitoCount}
                                />
                                <CardCount
                                    icon="clock"
                                    title="Envios Finalizados"
                                    result={enviosEntregadoCount}/>
                            </>
                        )}
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Hola Mundo, he vuelto!!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

