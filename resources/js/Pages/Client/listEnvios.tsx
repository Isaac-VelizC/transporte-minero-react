import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { TableColumn } from "react-data-table-component";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Modal from "@/Components/Modal/Modal";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    envios: ShipmentInterface[];
};

export default function listEnvios({ envios }: Props) {
    const [confirmingShow, setConfirmingShow] = useState(false);
    const [cargaData, setCargaData] = useState<ShipmentInterface | null>(null);

    const columns: TableColumn<ShipmentInterface>[] = [
        {
            name: "#",
            cell: (_, index) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row) => row.full_name,
            sortable: true,
        },
        {
            name: "Fecha de Envio",
            cell: (row) => row.fecha_envio,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Destino de envio",
            cell: (row) => row.destino,
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row) => (
                <span className="rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5">
                    {row.status}
                </span>
            ),
            width: "150px",
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="flex gap-2">
                    {row.status == "en_transito" ? (
                        <button onClick={() => handleViewEnvio(row)}>
                            <i className="bi bi-info-circle"></i>
                        </button>
                    ) : null}
                    <Link href={route("client.envio.show", row.id)}>
                        <i className="bi bi-eye"></i>
                    </Link>
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
                await router.patch(
                    route("client.envios.status", cargaData.id),
                    {
                        preserveScroll: true,
                        
                    }
                );
                closeModal();
            } catch (error) {
                toast.error("Error al cancelar el envío");
                // Aquí puedes mostrar un mensaje al usuario si es necesario
            }
        } else {
            toast.error("No hay un ID de envío seleccionado para cancelar.");
        }
    };

    return (
        <Authenticated>
            <Head title="Envios" />
            <div>
                <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                    <h1 className="text-lg font-semibold text-gray-200">Lista de Pedidos</h1>
                </div>
                <DataTableComponent<ShipmentInterface>
                    columns={columns}
                    data={envios}
                />
            </div>
            <Modal show={confirmingShow} onClose={closeModal}>
                <div className="p-6">
                    <h1 className="font-medium text-base text-gray-900">
                        Datos de la carga
                    </h1>
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
                        {cargaData?.status === "en_transito" ? (
                            <PrimaryButton
                                type="button"
                                className="mt-4"
                                onClick={handleConfirm}
                            >
                                Confirmar Entrega
                            </PrimaryButton>
                        ) : null}
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
