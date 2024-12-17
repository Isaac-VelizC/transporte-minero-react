import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    envios: ShipmentInterface[];
};

function index({ envios }: Props) {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToSelect, setIdToSelect] = useState<number | null>(null);
    const [status, setStatus] = useState(false);
    const columns = [
        {
            name: "#",
            cell: (row: ShipmentInterface, index: number) => index + 1,
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
                    <Link href={route("envios.show", row.id)}>
                        <i className="bi bi-eye"></i>
                    </Link>
                    {!row.delete ? (
                        <i className="bi bi-x-lg text-red"></i>
                    ) : (
                        <Link href={route("envios.edit", row.id)}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={() => confirmUserDeletion(row.id, row.delete)}
                    >
                        <i className="bi bi-trash2"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    const confirmUserDeletion = (userId: number, estado: boolean) => {
        setStatus(estado);
        setIdToSelect(userId);
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setIdToSelect(null);
    };

    const cancelarEnvio = async () => {
        if (idToSelect !== null) {
            await router.delete(route("envios.delete", idToSelect), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error("Error al eliminar el usuario:", errors);
                },
                onFinish: () => {
                    setIdToSelect(null);
                },
            });
            setStatus(false);
        } else {
            console.warn("No hay un ID de usuario seleccionado para eliminar.");
        }
    };

    return (
        <Authenticated>
            <Head title="Envios" />
            <Breadcrumb pageName="Envios list" />
            <div>
                <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                    <h1 className="text-lg font-semibold">
                        Lista de envios registrados
                    </h1>
                    <LinkButton href={"envios.create.form"}>Nuevo</LinkButton>
                </div>
                <DataTableComponent columns={columns} data={envios} />
            </div>
            <ModalDelete
                title={`¿Estás seguro de que quieres ${
                    status ? "cancelar" : "reactivar"
                } el envio?`}
                titleButton="Continuar"
                show={confirmingDeletion}
                onClose={closeModal}
                onDelete={cancelarEnvio}
                children={
                    <p className="mt-1 text-sm text-gray-600">
                        {status
                            ? "Al cancelar el envio, no "
                            : "Al reactivar el envio "}
                        se le notificara al conductor sobre el envio pendiente.
                    </p>
                }
            />
        </Authenticated>
    );
}

export default index;
