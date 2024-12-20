import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useCallback, useMemo } from "react";

type Props = {
    geocercas: GeocercaInterface[];
};

export default function Index({ geocercas }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [itemIdToSelect, setItemIdToSelect] = useState<number | null>(null);
    const [ status, setStatus ] = useState<boolean>(false);
    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (row: GeocercaInterface, index: number) => index + 1,
            },
            {
                name: "Nombre de la Geocerca",
                selector: (row: GeocercaInterface) => row.name,
                sortable: true,
            },
            {
                name: "Tipo de Geocerca",
                selector: (row: GeocercaInterface) => row.type,
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: GeocercaInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 text-white ${
                            row.is_active ? "bg-green-400" : "bg-red-400"
                        }`}
                    >
                        {row.is_active ? "Activo" : "Inactivo"}
                    </span>
                )
            },
            {
                name: "Acciones",
                cell: (row: GeocercaInterface) => (
                    <div className="flex gap-4">
                        <Link href={route("geocerca.edit", row.id)}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                        <button onClick={() => confirmDeletion(row.id, row.is_active)}>
                            <i className="bi bi-trash2"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        []
    );

    const confirmDeletion = useCallback((id: number, status: boolean) => {
        setStatus(status);
        setItemIdToSelect(id);
        setOpenModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setOpenModal(false);
        setItemIdToSelect(null);
    }, []);

    const handleDelete = useCallback(async () => {
        if (itemIdToSelect !== null) {
            try {
                await router.delete(route("geocerca.delete", itemIdToSelect), {
                    preserveScroll: true,
                    onSuccess: closeModal,
                    onError: (errors) => {
                        console.error("Error al eliminar la geocerca:", errors);
                    },
                    onFinish: () => {
                        setItemIdToSelect(null);
                    },
                });
            } catch (error) {
                console.error("Error inesperado al eliminar:", error);
            }
        } else {
            console.warn(
                "No hay un ID de geocerca seleccionado para eliminar."
            );
        }
    }, [itemIdToSelect, closeModal]);

    return (
        <Authenticated>
            <Head title="Geocercas" />
            <Breadcrumb pageName="Geocercas" />
            <div>
                <div className="flex lg:flex-row flex-col items-center justify-between my-4">
                    <h1 className="text-lg font-semibold">
                        Geocercas Registrados
                    </h1>
                    <LinkButton href="geocerca.create">Nuevo</LinkButton>
                </div>
                <DataTableComponent columns={columns} data={geocercas} />
            </div>
            <ModalDelete
                title={`${ status ? 'Desactivar' : 'Activar' } Geocerca`}
                titleButton={ status ? 'Desactivar' : 'Activar' }
                show={openModal}
                children={
                    <p>Por favor, confirma tu decisión pulsando el botón de abajo.</p>
                }
                onClose={closeModal}
                onDelete={handleDelete}
            />
        </Authenticated>
    );
}
