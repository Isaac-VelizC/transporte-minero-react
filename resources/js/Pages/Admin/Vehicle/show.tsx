import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import { ScheduleInterface } from "@/interfaces/schedule";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import React, { useState } from "react";
import ModalFormSchedule from "./Programming/ModalFormSchedule";
import { DriverInterface } from "@/interfaces/Driver";
import Card from "@/Components/Card";
import { MantenimientoInterface } from "@/interfaces/Mantenimiento";
import ModalFormMantenimieto from "./Programming/ModalFormMantenimieto";


type Props = {
    vehicle: VehicleInterface;
    schedules: ScheduleInterface[];
    listMantenimientos: MantenimientoInterface[];
    drivers: DriverInterface[];
    statuSchedules: boolean;
};

const showVehicle: React.FC<Props> = ({
    vehicle,
    schedules,
    drivers,
    statuSchedules,
    listMantenimientos,
}) => {
    const [openModalSchedule, setOpenModalSchedule] = useState(false);
    const [openModalMantenimiento, setOpenModalMantenimiento] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [scheduleData, setScheduleData] = useState<ScheduleInterface | null>(
        null
    );
    const [mantenimientoData, setMantenimientoData] =
        useState<MantenimientoInterface | null>(null);

    const columnSchedule = [
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
        },
        {
            cell: (row: ScheduleInterface) => (
                <button onClick={() => handleEditSchedule(row)}>
                    <i className="bi bi-pencil"></i>
                </button>
            ),
            ignoreRowClick: true,
            width: "50px",
        },
    ];
    const columnMantenimiento = [
        {
            name: "Fecha de mantenimiento",
            cell: (row: MantenimientoInterface) => row.fecha,
            sortable: true,
        },
        {
            name: "Conductor Designado",
            cell: (row: MantenimientoInterface) => row.observaciones,
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
        },
        {
            cell: (row: MantenimientoInterface) => (
                <div className="gap-3">
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
    ];

    const handleEditMantenimiento = (row: MantenimientoInterface) => {
        setIsEditing(true);
        setMantenimientoData(row);
        setOpenModalMantenimiento(true);
    };

    const handleEditSchedule = (row: ScheduleInterface) => {
        setIsEditing(true);
        setScheduleData(row);
        setOpenModalSchedule(true);
    };

    const handleCreateSchedule = () => {
        setIsEditing(false);
        setScheduleData(null);
        setOpenModalSchedule(true);
    };

    const handleCreateMantenimiento = () => {
        setIsEditing(false);
        setScheduleData(null);
        setOpenModalMantenimiento(true);
    };

    const closeModal = () => {
        setOpenModalMantenimiento(false);
        setOpenModalSchedule(false);
        setScheduleData(null);
    };

    const deleteMantenimiento = async (id: number) => {
        try {
            await router.delete(route("mantenimiento.delete", id), {
                preserveScroll: true,
            });
        } catch (errors) {
            console.error("Error al eliminar el mantenimiento:", errors);
        }
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
                show={openModalSchedule}
                onClose={closeModal}
                drivers={drivers}
                cardId={vehicle.id}
                schecule={scheduleData || undefined}
                isEditing={isEditing}
            />

            <ModalFormMantenimieto
                show={openModalMantenimiento}
                onClose={closeModal}
                cardId={vehicle.id}
                infoData={mantenimientoData || undefined}
                isEditing={isEditing}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="p-4 flex justify-between">
                        <h1 className="text-xl font-semibold">
                            Historial de Programaciones
                        </h1>
                        {statuSchedules || vehicle.status != "activo" ? null : (
                            <PrimaryButton onClick={handleCreateSchedule}>
                                Nuevo
                            </PrimaryButton>
                        )}
                    </div>
                    <DataTableComponent
                        columns={columnSchedule}
                        data={schedules}
                    />
                </div>
                <div>
                    <div className="p-4 flex justify-between">
                        <h1 className="text-xl font-semibold">
                            Historial de Mantenimintos
                        </h1>
                        <PrimaryButton onClick={handleCreateMantenimiento}>
                            Programar
                        </PrimaryButton>
                    </div>
                    <DataTableComponent
                        columns={columnMantenimiento}
                        data={listMantenimientos}
                    />
                </div>
            </div>
        </Authenticated>
    );
};


export default showVehicle;
