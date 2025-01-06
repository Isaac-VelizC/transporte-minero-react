import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React, { useEffect, useMemo } from "react";
import DataTableComponent from "@/Components/Table";
import toast from "react-hot-toast";

type Props = {
    vehicles: VehicleInterface[];
};

const index: React.FC<Props> = ({ vehicles }) => {
    
    const { flash } = usePage().props;

    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (_: VehicleInterface, index: number) => index + 1,
                width: "50px",
            },
            {
                name: "Matricula",
                cell: (row: VehicleInterface) => row.matricula,
                sortable: true,
            },
            {
                name: "Modelo",
                cell: (row: VehicleInterface) => row.modelo,
                sortable: true,
            },
            {
                name: "Color",
                cell: (row: VehicleInterface) => row.color,
                sortable: true,
            },
            {
                name: "Marca",
                cell: (row: VehicleInterface) => row.marca.name,
                sortable: true,
            },
            {
                name: "Fecha de Compra",
                cell: (row: VehicleInterface) => row.fecha_compra,
                sortable: true,
            },
            {
                name: "Capacidad de Carga",
                cell: (row: VehicleInterface) => row.capacidad_carga + " t.",
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: VehicleInterface) => (
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
                cell: (row: VehicleInterface) => (
                    <div className="flex gap-2">
                        <Link href={route("vehicle.show", row.id)}>
                            <i className="bi bi-eye"></i>
                        </Link>
                        <Link href={route("vehicle.edit", row.id)}>
                            <i className="bi bi-pencil"></i>
                        </Link>
                        <i className={`bi bi-phone ${row.device ? 'text-green-600':'text-red'}`}></i>
                    </div>
                ),
                ignoreRowClick: true,
                width: "90px",
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

    return (
        <Authenticated>
            <Head title="Vehiculos" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista Vehiculos" },
                ]}
            />
            <div className="flex justify-end items-center gap-4 my-10">
                <LinkButton
                    href="vehicle.create"
                    className="flex items-center gap-2"
                >
                    <i className="bi bi-plus"></i>
                    <span className="hidden lg:block">Nuevo Vehículo</span>
                </LinkButton>
            </div>
            <DataTableComponent columns={columns} data={vehicles} />
        </Authenticated>
    );
};

export default index;
