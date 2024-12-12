import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import LinkButton from "@/Components/Buttons/LinkButton";
import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

type Props = {
    envios: ShipmentInterface[];
};

function index({ envios }: Props) {
    const columns = [
        {
            name: "ID",
            cell: (row: ShipmentInterface, index: number) => index + 1, // Enumerar filas
            width: "50px", // Ajustar el ancho de la columna si es necesario
        },
        {
            name: "Cliente",
            cell: (row: ShipmentInterface) => row.full_name,
            sortable: true,
        },
        {
            name: "Matricula de Vehiculo",
            cell: (row: ShipmentInterface) => row.matricula,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row: ShipmentInterface) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Destino de envio",
            cell: (row: ShipmentInterface) => row.destino,
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row: ShipmentInterface) => (
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
            cell: (row: ShipmentInterface) => (
                <div className="flex gap-2">
                    <Link href={route("envios.show", row.id)}>
                        <i className="bi bi-eye"></i>
                    </Link>
                    <Link href={route("envios.edit", row.id)}>
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
            <Head title="Envios" />
            <Breadcrumb pageName="Envios list" />
            <div>
                <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                    <h1 className="text-lg font-semibold">
                        Lista de envios registrados
                    </h1>
                    <LinkButton href={"envios.create.form"}>Nuevo</LinkButton>
                </div>
                <DataTableComponent columns={columns} data={envios} />
            </div>
        </Authenticated>
    );
}

export default index;
