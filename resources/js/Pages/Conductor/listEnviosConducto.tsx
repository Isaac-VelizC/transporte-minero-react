import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Modal from "@/Components/Modal/Modal";
import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useCallback, useState } from "react";

type Props = {
    envios: ShipmentInterface[];
};

export default function listEnviosConducto({ envios }: Props) {
    const [confirmingShow, setConfirmingShow] = useState(false);
    const [cargaData, setCargaData] = useState<ShipmentInterface | null>(null);

    const columns = [
        {
            name: "#",
            cell: (_: ShipmentInterface, index: number) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row: ShipmentInterface) => row.full_name,
            sortable: true,
        },
        {
            name: "Matricula de Vehiculo",
            cell: (row: ShipmentInterface) => row.matricula,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row: ShipmentInterface) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Destino de envio",
            cell: (row: ShipmentInterface) => row.destino,
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row: ShipmentInterface) => (
                <span
                    className={`rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5`}
                >
                    {row.status}
                </span>
            ),
            width: "150px",
        },
        {
            name: "Acciones",
            cell: (row: ShipmentInterface) => (
                <div className="flex gap-2">
                    <button onClick={() => handleViewEnvio(row)}>
                        <i className="bi bi-info-circle"></i>
                    </button>
                    {row.status === "entregado" ? null : (
                        <Link href={route("driver.envio.show", row.id)}>
                            <i className="bi bi-geo-fill"></i>
                        </Link>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    const handleViewEnvio = useCallback((row: ShipmentInterface) => {
        setCargaData(row);
        setConfirmingShow(true);
    }, []);

    const closeModal = useCallback(() => {
        setConfirmingShow(false);
        setCargaData(null);
    }, []);

    const handleConfirm = async () => {
        if (cargaData !== null) {
            try {
                // Realiza la solicitud para cambiar el estado del envío
                await router.get(route("driver.envios.status", cargaData.id), {
                    // Aquí puedes enviar cualquier dato adicional si es necesario
                });
            } catch (error) {
                console.error("Error al cambiar el estado del envío:", error);
            }
        } else {
            console.warn(
                "No hay un ID de envío seleccionado para cambiar el estado."
            );
        }
    };

    return (
        <Authenticated>
            <Head title="Envios" />
            <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                <h1 className="text-lg font-semibold">Envios Asigandos</h1>
            </div>
            <DataTableComponent columns={columns} data={envios} />
            <Modal show={confirmingShow} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Información del Envio
                    </h2>
                    <div className="py-2 pl-4">
                        <p>
                            <strong>Cliente: </strong>
                            {cargaData?.full_name}
                        </p>
                    </div>
                    <h3 className="font-medium text-base text-gray-900">
                        Datos de la carga
                    </h3>
                    <div className="py-2 pl-4 space-y-1">
                        <p>
                            <strong>Peso en toneldas: </strong>
                            {cargaData?.peso} t.
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {cargaData?.destino}
                        </p>
                        <p>
                            <strong>Notas: </strong>
                            {cargaData?.notas}
                        </p>
                        <p>
                            <strong>Matricula del vehiculo: </strong>
                            {cargaData?.matricula}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {cargaData?.fecha_entrega}
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={closeModal}
                        >
                            Cancel
                        </SecondaryButton>
                        {cargaData?.status !== "pendiente" ? null : (
                            <PrimaryButton
                                type="button"
                                className="mt-4"
                                onClick={handleConfirm}
                            >
                                Aceptar Carga
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
