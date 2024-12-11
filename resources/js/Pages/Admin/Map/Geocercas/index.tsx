import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import ModalDelete from "@/Components/Modal/ModalDelete";
import DataTableComponent from "@/Components/Table";
import { GeocercaInterface } from "@/interfaces/Geocerca";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState, useCallback, useMemo } from "react";

type Props = {
    geocercas: GeocercaInterface[];
};

export default function Index({ geocercas }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [itemIdToSelect, setItemIdToSelect] = useState<number | null>(null);

    // Memoize columns to prevent unnecessary re-renders
    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (row: GeocercaInterface, index: number) => index + 1,
                width: "50px",
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
                name: "Creado por ",
                selector: (row: GeocercaInterface) => row.email, // Cambié created_by por created_at
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
                ),
                width: "100px",
            },
            {
                name: "Acciones",
                cell: (row: GeocercaInterface) => (
                    <div className="flex gap-2">
                        <Link href={route("geocerca.edit", row.id)}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                        <button onClick={() => confirmDeletion(row.id)}>
                            <i className="bi bi-trash2"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
                width: "90px",
            },
        ],
        []
    ); // Dependencias vacías ya que no cambian

    // Usar useCallback para funciones que se pasan como props
    const confirmDeletion = useCallback((id: number) => {
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
                title="Dar de baja Geocerca"
                titleButton="Dar de baja"
                show={openModal}
                onClose={closeModal}
                onDelete={handleDelete}
            />
        </Authenticated>
    );
}
