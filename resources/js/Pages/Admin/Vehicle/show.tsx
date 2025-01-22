import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import DataTableComponent from "@/Components/Table";
import { ScheduleInterface } from "@/interfaces/schedule";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import Card from "@/Components/Cards/Card";
import { MantenimientoInterface } from "@/interfaces/Mantenimiento";

type Props = {
    vehicle: VehicleInterface;
    schedules: ScheduleInterface[];
    listMantenimientos: MantenimientoInterface[];
};

const showVehicle: React.FC<Props> = ({
    vehicle,
    schedules,
    listMantenimientos,
}) => {
    const columnSchedule = [
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
    ];
    const columnMantenimiento = [
        {
            name: "Fecha",
            cell: (row: MantenimientoInterface) => row.fecha_inicio,
            sortable: true,
        },
        {
            name: "Fecha Fin",
            cell: (row: MantenimientoInterface) =>
                row.fecha_fin ? row.fecha_fin : "unknown",
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
        /*{
            cell: (_: MantenimientoInterface) => (
                <div className="gap-3">
                    <button>
                        <i className="bi bi-eye"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "80px",
        },*/
    ];

    return (
        <Authenticated>
            <Head title="Show" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/vehicle" },
                    { name: vehicle.matricula },
                ]}
            />

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
                            Marca:{" "}
                            <span className="font-medium">
                                {vehicle.marca.name}
                            </span>
                        </p>
                        <p className="text-sm">
                            Modelo:{" "}
                            <span className="font-medium">
                                {vehicle.modelo}
                            </span>
                        </p>
                        <p className="text-sm">
                            tipo:{" "}
                            <span className="font-medium">
                                {vehicle.tipo.name}
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
                            Información del dispositivo
                        </h3>
                        <div>
                            {vehicle.device ? (
                                <p className="text-sm">
                                    <strong>IMEI</strong> {vehicle.device.num_serial} <br />
                                    {vehicle.device.name_device} <br />
                                    {vehicle.device.type}
                                </p>
                            ) : (
                                <p>Dispositivo no seleccionado</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="p-4 flex justify-between">
                        <h1 className="text-xl font-semibold text-gray-300">
                            Historial de Programaciones
                        </h1>
                    </div>
                    <DataTableComponent
                        columns={columnSchedule}
                        data={schedules}
                    />
                </div>
                <div>
                    <div className="p-4 flex justify-between">
                        <h1 className="text-xl font-semibold text-gray-300">
                            Historial de Mantenimintos
                        </h1>
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
