import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import DataTableComponent from "@/Components/Table";
import toast from "react-hot-toast";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { VehicleInterface } from "@/interfaces/Vehicle";
import { FormScheduleType, ScheduleInterface } from "@/interfaces/schedule";
import ModalFormSchedule from "./ModalFormSchedule";
import { DriverInterface } from "@/interfaces/Driver";

type Props = {
    schedules: ScheduleInterface[];
    vehicles: VehicleInterface[];
    drivers: DriverInterface[];
};

const index: React.FC<Props> = ({ schedules, vehicles, drivers }) => {
    const [openModalSchedule, setOpenModalSchedule] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [scheduleData, setScheduleData] = useState<FormScheduleType | null>(
        null
    );
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
                cell: (row: ScheduleInterface) => row.end_time,
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: ScheduleInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5`}
                    >
                        {row.status_time ? row.status : 'Inactivo'}
                    </span>
                ),
            },
            {
                cell: (row: ScheduleInterface) => (
                    <>
                        <Link href={route("vehicle.programming.cancel", row.id)}>
                            <i className="bi bi-trash"></i>
                        </Link>
                        <button onClick={() => handleEditSchedule(row)}>
                            <i className="bi bi-pencil"></i>
                        </button>
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

    const handleEditSchedule = (row: ScheduleInterface) => {
        setIsEditing(true);
        const data = {
            id: row.id,
            car_id: row.vehicle.id,
            start_time: row.start_time,
            end_time: row.end_time,
            driver_id: row.driver.id,
        };
        setScheduleData(data);
        setOpenModalSchedule(true);
    };

    const handleCreateSchedule = () => {
        setIsEditing(false);
        setScheduleData(null);
        setOpenModalSchedule(true);
    };

    const closeModal = () => {
        setOpenModalSchedule(false);
        setScheduleData(null);
    };

    return (
        <Authenticated>
            <Head title="Mantenimiento" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista Vehiculos en Mantenimiento" },
                ]}
            />
            <div className="flex justify-end items-center gap-4 my-10">
                <SecondaryButton onClick={() => handleCreateSchedule()}>
                    <i className="bi bi-plus"></i>
                    <span className="hidden lg:block">Programar Nuevo</span>
                </SecondaryButton>
            </div>
            <DataTableComponent columns={columnSchedule} data={schedules} />
            <ModalFormSchedule
                show={openModalSchedule}
                onClose={closeModal}
                drivers={drivers}
                vehicles={vehicles}
                schecule={scheduleData || undefined}
                isEditing={isEditing}
            />
        </Authenticated>
    );
};

export default index;
