import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

type Props = {
    envios: ShipmentInterface[];
};

export default function listEnviosConducto({ envios }: Props) {
    const columns = [
        {
            name: "#",
            cell: (row: ShipmentInterface, index: number) => index + 1,
            width: "50px",
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
                    <h1 className="text-lg font-semibold">
                        Envios Asigandos
                    </h1>
                </div>
                <DataTableComponent columns={columns} data={envios} />
            </div>
        </Authenticated>
    );
}
