import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { TableColumn } from "react-data-table-component";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Modal from "@/Components/Modal/Modal";
import { useCallback, useState } from "react";
import { UserInterface } from "@/interfaces/User";
import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";

type Props = {
    envios: ShipmentInterface[];
    cliente: UserInterface
};

export default function historyList({ envios, cliente }: Props) {
    const [confirmingShow, setConfirmingShow] = useState(false);
    const [cargaData, setCargaData] = useState<ShipmentInterface | null>(null);

    const columns: TableColumn<ShipmentInterface>[] = [
        {
            name: "#",
            cell: (_, index) => index + 1,
            width: "50px",
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
                <button onClick={() => handleViewEnvio(row)}>
                    <i className="bi bi-info-circle"></i>
                </button>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    const handleViewEnvio = useCallback((row: ShipmentInterface) => {
        setCargaData(row);
        setConfirmingShow(true);
    }, []);

    const closeModal = useCallback(() => {
        setConfirmingShow(false);
        setCargaData(null);
    }, []);

    return (
        <Authenticated>
            <Head title="Envios" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/users/clients" },
                    { name: "Historial de Pedidos" },
                ]}
            />
            <div>
                <DataTableComponent<ShipmentInterface>
                    columns={columns}
                    data={envios}
                    title={`Cliente: ${cliente.nombre} ${cliente.ap_pat} - ${cliente.ci}`}
                />
            </div>
            <Modal show={confirmingShow} onClose={closeModal}>
                <div className="p-6">
                    <h1 className="font-medium text-base text-gray-900">
                        Datos de la carga
                    </h1>
                    <div className="py-2 pl-4 space-y-1">
                        <p>
                            <strong>Peso en toneldas: </strong>
                            {cargaData?.peso} t.
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {cargaData?.destino}
                        </p>
                        <p>
                            <strong>Notas: </strong>
                            {cargaData?.notas}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {cargaData?.fecha_entrega}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-medium text-base text-gray-900">
                            Estado de la carga
                        </h2>
                        <p>
                            <strong>Estado: </strong>
                            {cargaData?.status}
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={closeModal}
                        >
                            Cerrar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Authenticated>
    );
}
