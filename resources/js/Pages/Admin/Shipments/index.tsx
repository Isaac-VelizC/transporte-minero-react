import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";
import toast from "react-hot-toast";

type Props = {
    envios: ShipmentInterface[];
};

function index({ envios }: Props) {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToSelect, setIdToSelect] = useState<number | null>(null);
    const [status, setStatus] = useState(false);
    const rol = usePage().props.auth.rol;
    const { flash } = usePage().props;
    const columns: TableColumn<ShipmentInterface>[] = [
        {
            name: "#",
            cell: (_: ShipmentInterface, index: number) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row: ShipmentInterface) =>
                row.client.nombre +
                " " +
                row.client.ap_pat +
                " " +
                row.client.ap_mat,
            sortable: true,
        },
        {
            name: "Fecha de Envio",
            cell: (row: ShipmentInterface) => row.fecha_envio,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row: ShipmentInterface) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Origén de envio",
            cell: (row: ShipmentInterface) => row.origen,
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
                    {row.status === "entregado" ||
                    rol == "Encargado_Control" ? (
                        <>
                            <Link href={route("view.map", row.id)}>
                                <i className="bi bi-geo-fill"></i>
                            </Link>
                            <Link href={route("altercados.list", row.id)}>
                                <i className="bi bi-exclamation-octagon"></i>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route("envios.show", row.id)}>
                                <i className="bi bi-geo-fill"></i>
                            </Link>
                            <Link href={route("envios.edit", row.id)}>
                                <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                                type="button"
                                onClick={() =>
                                    confirmUserDeletion(row.id, row.delete)
                                }
                            >
                                <i className="bi bi-trash2"></i>
                            </button>
                        </>
                    )}
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
            try {
                await router.patch(route("envios.delete", idToSelect), {
                    preserveScroll: true,
                });
                setStatus(false);
                closeModal();
                setIdToSelect(null);
            } catch (error) {
                console.log(error);
                toast.error("Error al cancelar el envío");
            }
        } else {
            toast.error("No hay un ID de envío seleccionado para cancelar.");
        }
    };

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <Authenticated>
            <Head title="Envios" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista de Envios" },
                ]}
            />
            <div className="flex justify-end my-4 gap-4">
                <LinkButton href={"all.map.envios"}>Mapa</LinkButton>
                {rol === "Encargado_Control" ? null : (
                    <LinkButton href={"envios.create.form"}>Nuevo</LinkButton>
                )}
            </div>
            <DataTableComponent columns={columns} data={envios} />
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
