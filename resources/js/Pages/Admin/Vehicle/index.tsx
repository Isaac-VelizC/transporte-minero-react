import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import FlashMessages from "@/Components/FlashMessages";
import { VehicleInterface } from "@/interfaces/Vehicle";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import customStyles from "@/styles/StylesTable";
import { Head, Link, usePage } from "@inertiajs/react";
import React from "react";
import DataTable from "react-data-table-component";
import { FlashMessages as FlashMessagesType } from "@/interfaces/FlashMessages";

type Props = {
    vehicles: VehicleInterface[];
};

const index: React.FC<Props> = ({ vehicles }) => {
    const { props } = usePage();

    // Asegúrate de que props.flash esté definido
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
            <div className="">
                <DataTable
                    columns={columns}
                    data={vehicles}
                    pagination
                    paginationPerPage={10} // Número de filas por página
                    paginationRowsPerPageOptions={[5, 10, 20]}
                    customStyles={customStyles}
                />
            </div>
        </Authenticated>
    );
};

export default index;
