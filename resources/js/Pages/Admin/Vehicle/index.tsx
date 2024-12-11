import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import FlashMessages from "@/Components/FlashMessages";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React from "react";
import { FlashMessages as FlashMessagesType } from "@/interfaces/FlashMessages";
import DataTableComponent from "@/Components/Table";

type Props = {
    vehicles: VehicleInterface[];
};

const index: React.FC<Props> = ({ vehicles }) => {
    const { props } = usePage();
    const flash: FlashMessagesType = props.flash || {};
    const { error, success } = flash;
    
    const columns = [
        {
            name: "#",
            cell: (row: VehicleInterface, index: number) => index + 1, // Enumerar filas
            width: "50px", // Ajustar el ancho de la columna si es necesario
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
            name: "Fecha de Compra",
            cell: (row: VehicleInterface) => row.fecha_compra,
            sortable: true,
        },
        {
            name: "Capacidad de Carga",
            cell: (row: VehicleInterface) => row.capacidad_carga,
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
                </div>
            ),
            ignoreRowClick: true,
            width: "90px",
        },
    ];

    return (
        <Authenticated>
            <Head title="Vehiculos" />
            <Breadcrumb pageName="Vehiculos" />
            <FlashMessages error={error} success={success} />
            <div className="flex justify-end my-10">
                <LinkButton href={"vehicle.create"}>Nuevo</LinkButton>
            </div>
            <DataTableComponent columns={columns} data={vehicles} />
        </Authenticated>
    );
};

export default index;
