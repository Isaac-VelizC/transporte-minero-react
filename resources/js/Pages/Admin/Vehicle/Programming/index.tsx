import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import DataTableComponent from "@/Components/Table";
import toast from "react-hot-toast";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { FormScheduleType, ScheduleInterface } from "@/interfaces/schedule";
import ModalFormSchedule from "./ModalFormSchedule";
import Modal from "@/Components/Modal/Modal";
import DangerButton from "@/Components/Buttons/DangerButton";

type Props = {
    schedules: ScheduleInterface[];
};

const index: React.FC<Props> = ({ schedules }) => {
    const [openModalSchedule, setOpenModalSchedule] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [scheduleData, setScheduleData] = useState<FormScheduleType | null>(
        null
    );
    const [scheduleId, setScheduleId] = useState<number | null>(null);
    const { flash } = usePage().props;

    const columnSchedule = useMemo(
        () => [
            {
                name: "Matricula Vehiculo",
                cell: (row: ScheduleInterface) => row.vehicle.matricula,
                sortable: true,
            },
            {
                name: "Conductor Designado",
                cell: (row: ScheduleInterface) =>
                    row.driver.persona.nombre + " " + row.driver.persona.ap_pat,
                sortable: true,
            },
            {
                name: "Inicio",
                cell: (row: ScheduleInterface) => row.start_time,
                sortable: true,
            },
            {
                name: "Fin",
                cell: (row: ScheduleInterface) =>
                    row.end_time ? row.end_time : "undefined",
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: ScheduleInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5`}
                    >
                        {row.status_time ? row.status : "Inactivo"}
                    </span>
                ),
            },
            {
                cell: (row: ScheduleInterface) => (
                    <>
                        {row.status_time ? (
                            <>
                                <button
                                    onClick={() => modaldeleteStatus(row.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                                <button onClick={() => handleEditSchedule(row)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleDelete(row.id)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </>
                ),
                ignoreRowClick: true,
                width: "50px",
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

    const modaldeleteStatus = (id: number) => {
        setOpenModalDelete(true);
        setScheduleId(id);
    };

    const handleEditSchedule = (row: ScheduleInterface) => {
        setIsEditing(true);
        const data = {
            id: row.id,
            car_id: row.vehicle.id,
            start_time: row.start_time,
            end_time: row.end_time,
            driver_id: row.driver.id,
            conductor:
                row.driver.persona.nombre + " " + row.driver.persona.ap_pat,
            matricula: row.vehicle.matricula,
        };
        setScheduleData(data);
        setOpenModalSchedule(true);
    };

    const handleDelete = (IdDelete: number) => {
        if (IdDelete) {
            // Asegúrate de que la ruta esté correctamente definida
            router.delete(route("vehicle.programming.delete", IdDelete), {
                onSuccess: () => {
                    closeModal();
                },
                onError: (error) => {
                    toast.error(
                        "Ocurrió un error al eliminar la programación."
                    );
                    console.error("Error al eliminar:", error);
                },
            });
        } else {
            toast.error(
                "Error: no se tiene el código del elemento a eliminar."
            );
        }
    };

    const closeModal = () => {
        setOpenModalSchedule(false);
        setOpenModalDelete(false);
        setScheduleData(null);
        setScheduleId(null);
    };

    return (
        <Authenticated>
            <Head title="Asignados" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Vehiculos", path: "/vehicle" },
                    { name: "Lista Vehiculos asignados" },
                ]}
            />
            <DataTableComponent columns={columnSchedule} data={schedules} />
            <ModalFormSchedule
                show={openModalSchedule}
                onClose={closeModal}
                schedule={scheduleData || undefined}
                isEditing={isEditing}
            />
            <Modal show={openModalDelete} onClose={closeModal}>
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-2">
                        Eliminar o Desactivar Programación de Conductor
                    </h2>
                    <p className="mb-4">
                        ¿Está seguro de que desea eliminar o desactivar esta
                        programación? Una vez que lo haga, no podrá volver a
                        activarla si elige eliminarla.
                    </p>
                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <DangerButton
                            onClick={() => handleDelete(scheduleId || 0)}
                        >
                            Eliminar
                        </DangerButton>
                        <Link
                            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700"
                            href={route(
                                "vehicle.programming.cancel",
                                scheduleId || 0
                            )}
                        >
                            Desactivar
                        </Link>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
};

export default index;
