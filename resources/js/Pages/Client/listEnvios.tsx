import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { TableColumn } from "react-data-table-component";

type Props = {
    envios: ShipmentInterface[];
};

export default function listEnvios({ envios }: Props) {
    const columns: TableColumn<ShipmentInterface>[] = [
        {
            name: "#",
            cell: (_, index) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row) => row.full_name,
            sortable: true,
        },
        {
            name: "Fecha de Envio",
            cell: (row) => row.fecha_envio,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Destino de envio",
            cell: (row) => row.destino,
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row) => (
                <span className="rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5">
                    {row.status}
                </span>
            ),
            width: "150px",
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div className="flex gap-2">
                    <Link href={route("envios.show", row.id)}>
                        <i className="bi bi-geo-fill"></i>
                    </Link>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    return (
        <Authenticated>
            <Head title="Envios" />
            <div>
                <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                    <h1 className="text-lg font-semibold">Lista de Pedidos</h1>
                </div>
                <DataTableComponent<ShipmentInterface> columns={columns} data={envios} />
            </div>
        </Authenticated>
    );
}
