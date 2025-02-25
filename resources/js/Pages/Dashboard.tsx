import CardCount from "@/Components/Cards/CardCount";
import { MessageInterface } from "@/interfaces/Message";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import MensajesCliente from "./Client/mensajes";
import { RenunciaUser } from "@/interfaces/RenunciaUser";
import { useEffect, useState } from "react";
import ModalReasignacion from "./Admin/modalReasignacion";
import toast from "react-hot-toast";

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
    messages?: MessageInterface[];
    renuncias?: RenunciaUser[];
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
    messages,
    renuncias,
}: Props) {
    const { rol } = usePage().props.auth;

    const [openModalSchedule, setOpenModalSchedule] = useState(false);
    const [vehicleId, setVehicleId] = useState<number | null>(null);
    const [renunciaId, setrenunciaId] = useState<number | null>(null);

    const handleCreateSchedule = (id: number, idRenuncia: number) => {
        setVehicleId(id);
        setOpenModalSchedule(true);
        setrenunciaId(idRenuncia);
    };

    const closeModal = () => {
        setOpenModalSchedule(false);
        setVehicleId(null);
        setrenunciaId(null);
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

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
                        {(rol === "Admin" || rol === "Secretaria") && (
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
                        {(rol === "Conductor" || rol === "Cliente") && (
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
                                    result={enviosEntregadoCount}
                                />
                            </>
                        )}
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {rol === "Cliente" && (
                                <MensajesCliente messages={messages} />
                            )}
                            {rol === "Encargado_Control" && (
                                <>
                                    <div className="my-3 mb-4 text-center">
                                        <h2 className="font-semibold text-lg text-danger">
                                            Lista de Conductores que renunciaros
                                            a vehiculos con pedidos pendientes{" "}
                                        </h2>
                                    </div>
                                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                        <thead>
                                            <tr className="bg-gray-200 text-gray-700">
                                                <th className="py-3 px-4 text-left">
                                                    Conductor
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Vehiculo
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Fecha
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Mensaje
                                                </th>
                                                <th className="py-3 px-4 text-left">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(renuncias) &&
                                            renuncias.length > 0 ? (
                                                renuncias.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b hover:bg-gray-100"
                                                    >
                                                        <td className="py-2 px-4">
                                                            {item.conductor
                                                                .nombre +
                                                                " " +
                                                                item.conductor
                                                                    .ap_pat}
                                                        </td>
                                                        <td className="py-2 px-4 text-green-600">
                                                            {
                                                                item.schedule
                                                                    .vehicle
                                                                    .matricula
                                                            }
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {item.fecha}
                                                        </td>
                                                        <td>{item.message}</td>
                                                        <td>
                                                            <button
                                                                onClick={() =>
                                                                    handleCreateSchedule(
                                                                        item
                                                                            .schedule
                                                                            .vehicle
                                                                            .id,
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-calendar4-range"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="py-2 px-4 text-center text-gray-500"
                                                    >
                                                        No hay datos
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <ModalReasignacion
                                        show={openModalSchedule}
                                        id_car={vehicleId || undefined}
                                        onClose={closeModal}
                                        id_renuncia={renunciaId}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
