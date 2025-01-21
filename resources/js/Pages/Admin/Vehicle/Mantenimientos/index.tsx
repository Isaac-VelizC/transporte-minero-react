import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import DataTableComponent from "@/Components/Table";
import toast from "react-hot-toast";
import {
    FormMantenimientoType,
    MantenimientoInterface,
    TipoMantenimientoInterface,
} from "@/interfaces/Mantenimiento";
import FormModalMantenimieto from "./formModal";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { VehicleInterface } from "@/interfaces/Vehicle";

type Props = {
    mantenimientos: MantenimientoInterface[];
    tipos: TipoMantenimientoInterface[];
    vehicles: VehicleInterface[];
};

const index: React.FC<Props> = ({ mantenimientos, tipos, vehicles }) => {
    const { flash } = usePage().props;
    const [openModalMantenimiento, setOpenModalMantenimiento] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mantenimientoData, setMantenimientoData] =
        useState<FormMantenimientoType | null>(null);

    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (_: MantenimientoInterface, index: number) => index + 1,
                width: "50px",
            },
            {
                name: "Matricula",
                cell: (row: MantenimientoInterface) => row.vehicle.matricula,
                sortable: true,
            },
            {
                name: "Modelo",
                cell: (row: MantenimientoInterface) => row.vehicle.modelo,
                sortable: true,
            },
            {
                name: "Fecha de mantenimiento",
                cell: (row: MantenimientoInterface) => row.fecha_inicio,
                sortable: true,
            },
            {
                name: "Fecha a recoger",
                cell: (row: MantenimientoInterface) =>
                    row.fecha_fin ? row.fecha_fin : "unknown",
                sortable: true,
            },
            {
                name: "Marca",
                cell: (row: MantenimientoInterface) => row.tipo.name,
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: MantenimientoInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5`}
                    >
                        {row.estado}
                    </span>
                ),
                width: "150px",
            },
            {
                cell: (row: MantenimientoInterface) => (
                    <div className="gap-4">
                        {row.estado == "pendiente" ? (
                            <button onClick={() => deleteMantenimiento(row.id)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        ) : null}
                        <button onClick={() => handleEditMantenimiento(row)}>
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
                width: "80px",
            },
        ],
        []
    );

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleEditMantenimiento = (row: MantenimientoInterface) => {
        setIsEditing(true);
        const data = {
            id: row.id,
            vehicle_id: row.vehicle.id,
            taller: row.taller,
            fecha_inicio: row.fecha_inicio,
            fecha_fin: row.fecha_fin,
            observaciones: row.observaciones,
            tipo: row.tipo.id,
            matricula: row.vehicle.matricula
        };

        setMantenimientoData(data);
        setOpenModalMantenimiento(true);
    };

    const handleCreateMantenimiento = () => {
        setIsEditing(false);
        setOpenModalMantenimiento(true);
    };

    const closeModal = () => {
        setOpenModalMantenimiento(false);
        setMantenimientoData(null);
    };

    const deleteMantenimiento = async (id: number) => {
        try {
            await router.delete(route("mantenimiento.delete", id), {
                preserveScroll: true,
            });
        } catch (errors) {
            console.log("Error al eliminar el mantenimiento:", errors);
            toast.error("Error al eliminar el mantenimiento");
        }
    };

    return (
        <Authenticated>
            <Head title="Mantenimientos" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista Vehiculos en Mantenimiento" },
                ]}
            />
            <div className="flex justify-end items-center gap-4 my-10">
                <SecondaryButton onClick={() => handleCreateMantenimiento()}>
                    <i className="bi bi-plus"></i>
                    <span className="hidden lg:block">Programar Nuevo</span>
                </SecondaryButton>
            </div>
            <DataTableComponent columns={columns} data={mantenimientos} />
            <FormModalMantenimieto
                show={openModalMantenimiento}
                onClose={closeModal}
                vehicles={vehicles}
                tipos={tipos}
                infoData={mantenimientoData || undefined}
                isEditing={isEditing}
            />
        </Authenticated>
    );
};

export default index;
