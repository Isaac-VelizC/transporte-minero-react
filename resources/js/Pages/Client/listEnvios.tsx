import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { TableColumn } from "react-data-table-component";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Modal from "@/Components/Modal/Modal";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import InputLabel from "@/Components/Forms/InputLabel";
import InputError from "@/Components/Forms/InputError";

type Props = {
    envios: ShipmentInterface[];
};

export default function listEnvios({ envios }: Props) {
    const initialData = {
        body: "",
    };
    const [confirmingShow, setConfirmingShow] = useState(false);
    const [modalMessage, setModalMessage] = useState(false);
    const [cargaData, setCargaData] = useState<ShipmentInterface | null>(null);

    const { data, setData, post, errors, processing, reset } = useForm(initialData);

    const columns: TableColumn<ShipmentInterface>[] = [
        {
            name: "#",
            cell: (_, index) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row) => row.client.nombre + " " + row.client.ap_pat,
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
            name: "Origén de envio",
            cell: (row) => row.origen,
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
                    {row.status == "en_transito" ? (
                        <button onClick={() => handleViewEnvio(row)}>
                            <i className="bi bi-info-circle"></i>
                        </button>
                    ) : null}
                    <Link href={route("client.envio.show", row.id)}>
                        <i className="bi bi-eye"></i>
                    </Link>
                    <button onClick={handleSendMessage}>
                        <i className="bi bi-whatsapp"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    const handleViewEnvio = useCallback((row: ShipmentInterface) => {
        setCargaData(row);
        setConfirmingShow(true);
    }, []);

    const handleSendMessage = useCallback(() => {
        setModalMessage(true);
    }, []);

    const closeModal = useCallback(() => {
        setConfirmingShow(false);
        setCargaData(null);
        setModalMessage(false);
    }, []);

    const handleConfirm = async () => {
        if (cargaData !== null) {
            try {
                await router.patch(
                    route("client.envios.status", cargaData.id),
                    {
                        preserveScroll: true,
                    }
                );
                closeModal();
            } catch (error) {
                toast.error("Error al cancelar el envío");
            }
        } else {
            toast.error("No hay un ID de envío seleccionado para cancelar.");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("send.message"), {
            data: data,
            onSuccess: ({ props: { flash } }) => {
                if (flash.error) toast.error(flash.error);
                if (flash.success) toast.success(flash.success);
                closeModal();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
        reset();
    };

    return (
        <Authenticated>
            <Head title="Envios" />
            <div>
                <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                    <h1 className="text-lg font-semibold text-gray-200">
                        Lista de Pedidos
                    </h1>
                </div>
                <DataTableComponent<ShipmentInterface>
                    columns={columns}
                    data={envios}
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

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={closeModal}
                        >
                            Cancel
                        </SecondaryButton>
                        {cargaData?.status === "en_transito" ? (
                            <PrimaryButton
                                type="button"
                                className="mt-4"
                                onClick={handleConfirm}
                            >
                                Confirmar Entrega
                            </PrimaryButton>
                        ) : null}
                    </div>
                </div>
            </Modal>
            <Modal show={modalMessage} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-2">
                        Enviar mensaje al encargado
                    </h2>
                    <div>
                        <InputLabel
                            htmlFor="body"
                            value="Hablar con el encargado"
                        />
                        <textarea
                            id="body"
                            rows={4}
                            className="mt-1 block w-full rounded-md"
                            value={data.body}
                            onChange={(e) => setData("body", e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.body} />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {processing ? "Enviando..." : "Enviar"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </Authenticated>
    );
}
