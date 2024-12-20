import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import { ScheduleInterface } from "@/interfaces/schedule";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import ModalFormSchedule from "./Programming/ModalFormSchedule";
import { DriverInterface } from "@/interfaces/Driver";
import Card from "@/Components/Card";

type Props = {
    vehicle: VehicleInterface;
    schedules: ScheduleInterface[];
    drivers: DriverInterface[];
    statuSchedules: boolean;
};

const showVehicle: React.FC<Props> = ({
    vehicle,
    schedules,
    drivers,
    statuSchedules,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [scheduleData, setScheduleData] = useState<ScheduleInterface | null>(
        null
    );

    const columns = [
        {
            name: "#",
            cell: (row: ScheduleInterface, index: number) => index + 1, // Enumerar filas
            width: "50px", // Ajustar el ancho de la columna si es necesario
        },
        {
            name: "Matricula Vehiculo",
            cell: (row: ScheduleInterface) => row.matricula_car,
            sortable: true,
        },
        {
            name: "Conductor Designado",
            cell: (row: ScheduleInterface) => row.conductor_name,
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
                    {row.status}
                </span>
            ),
            width: "150px",
        },
        {
            name: "Acciones",
            cell: (row: ScheduleInterface) => (
                <button onClick={() => handleEdit(row)}>
                    <i className="bi bi-pencil"></i>
                </button>
            ),
            ignoreRowClick: true,
            width: "90px",
        },
    ];

    const handleEdit = (row: ScheduleInterface) => {
        setIsEditing(true);
        setScheduleData(row);
        setOpenModal(true);
    };

    const handleCreate = () => {
        setIsEditing(false);
        setScheduleData(null);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setScheduleData(null);
    };

    return (
        <Authenticated>
            <Head title="Show" />
            <Breadcrumb pageName="Show Vehicle" />

            <Card classNames="mb-10">
                <div className="flex flex-col lg:flex-row lg:justify-between text-gray-500">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">
                            Información General
                        </h3>
                        <p className="text-sm">
                            Matricula:{" "}
                            <span className="font-medium">
                                {vehicle.matricula}
                            </span>
                        </p>
                        <p className="text-sm">
                            Color:{" "}
                            <span className="font-medium">{vehicle.color}</span>
                        </p>
                        <p className="text-sm">
                            Modelo:{" "}
                            <span className="font-medium">
                                {vehicle.modelo}
                            </span>
                        </p>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Especificaciones</h3>
                        <p className="text-sm">
                            Capacidad de Carga:{" "}
                            <span className="font-medium">
                                {vehicle.capacidad_carga} t.
                            </span>
                        </p>
                        <p className="text-sm">
                            Estado:{" "}
                            <span
                                className={`font-medium ${
                                    vehicle.status != "activo"
                                        ? "text-red-600"
                                        : ""
                                }`}
                            >
                                {vehicle.status}
                            </span>
                        </p>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg">
                            Fechas Importantes
                        </h3>
                        <p className="text-sm">
                            Fecha de Compra:{" "}
                            <span className="font-medium">
                                {vehicle.fecha_compra}
                            </span>
                        </p>
                        <p className="text-sm">
                            Última Revisión:{" "}
                            <span className="font-medium">
                                {vehicle.fecha_ultima_revision}
                            </span>
                        </p>
                    </div>
                </div>
            </Card>

            <ModalFormSchedule
                show={openModal}
                onClose={closeModal}
                drivers={drivers}
                cardId={vehicle.id}
                schecule={scheduleData || undefined}
                isEditing={isEditing}
            />

            <div className="p-4 flex justify-between">
                <h1 className="text-xl font-semibold">
                    Historial de Programaciones
                </h1>
                {statuSchedules || vehicle.status != "activo" ? null : (
                    <PrimaryButton onClick={handleCreate}>Nuevo</PrimaryButton>
                )}
            </div>
            <DataTableComponent columns={columns} data={schedules} />
        </Authenticated>
    );
};

export default showVehicle;
