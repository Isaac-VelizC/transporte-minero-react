import DangerButton from "@/Components/Buttons/DangerButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import Modal from "@/Components/Modal/Modal";
import DataTableComponent from "@/Components/Table";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    envios: ShipmentInterface[];
    vehicleId?: number | null;
};

export default function listEnviosConducto({ envios, vehicleId }: Props) {
    const [confirmingShow, setConfirmingShow] = useState(false);
    const [cargaData, setCargaData] = useState<ShipmentInterface | null>(null);
    const initialData = {
        message: "",
        vehicle: vehicleId,
        envio: cargaData?.id,
    };

    const { data, setData, post, errors, processing } = useForm(initialData);

    const columns = [
        {
            name: "#",
            cell: (_: ShipmentInterface, index: number) => index + 1,
            width: "50px",
        },
        {
            name: "Cliente",
            cell: (row: ShipmentInterface) =>
                row.client.nombre + " " + row.client.ap_pat,
            sortable: true,
        },
        {
            name: "Fecha de envio",
            cell: (row: ShipmentInterface) => row.fecha_envio,
            sortable: true,
        },
        {
            name: "Fecha de Entrega",
            cell: (row: ShipmentInterface) => row.fecha_entrega,
            sortable: true,
        },
        {
            name: "Origen de envio",
            cell: (row: ShipmentInterface) => row.origen,
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
                    {vehicleId != null && (
                        <>
                            {row.status !== "pendiente" ? null : (
                                <button onClick={() => handleViewEnvio(row)}>
                                    <i className="bi bi-info-circle"></i>
                                </button>
                            )}
                            {row.status === "en_transito" && (
                                <Link href={route("driver.show.map", row.id)}>
                                    <i className="bi bi-map"></i>
                                </Link>
                            )}
                        </>
                    )}
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

    const closeModal = useCallback(() => {
        setConfirmingShow(false);
        setCargaData(null);
    }, []);

    const handleConfirm = async () => {
        if (cargaData !== null) {
            try {
                // Realiza la solicitud para cambiar el estado del envío
                await router.get(
                    route("driver.envios.status", cargaData.id),
                    {}
                );
            } catch (error) {
                toast.error("Error al cambiar el estado del envío");
            }
        } else {
            toast.error(
                "No hay un ID de envío seleccionado para cambiar el estado."
            );
        }
    };

    const handleCancelarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.envio !== null && data.vehicle !== null) {
            try {
                data.envio = cargaData?.id;
                // Realiza la solicitud para cambiar el estado del envío
                post(route("driver.envios.renuncia"));
                //toast.success("El estado del envío ha sido cambiado exitosamente.");
            } catch (error) {
                console.error("Error al cambiar el estado del envío:", error);
                toast.error("Error al cambiar el estado del envío");
            }
        } else {
            toast.error(
                "No hay un ID de envío seleccionado para cambiar el estado."
            );
        }
    };

    const { flash } = usePage().props;

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
            <Head title="Envios" />
            <div className="flex flex-col lg:flex-row items-center justify-between my-4">
                <h1 className="text-lg font-semibold text-gray-200">
                    Envios Asigandos
                </h1>
            </div>
            <DataTableComponent columns={columns} data={envios} />
            <Modal show={confirmingShow} onClose={closeModal}>
                <div className="p-6">
                    <h3 className="font-medium text-base text-gray-900">
                        Datos de la carga
                    </h3>
                    <div className="py-2 pl-4 space-y-1">
                        <p>
                            <strong>Origen: </strong>
                            {cargaData?.origen}
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {cargaData?.destino}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {cargaData?.fecha_entrega}
                        </p>
                    </div>
                    <form onSubmit={handleCancelarEnvio}>
                        <p className="text-orange-400">
                            Si renuncias, menciona del porque
                        </p>
                        <div>
                            <InputLabel
                                htmlFor="message"
                                value="Descripcion Corta"
                            />
                            <textarea
                                id="message"
                                rows={4}
                                className="mt-1 block w-full rounded-md"
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                value={data.message}
                                required
                            />
                            <InputError
                                className="mt-2"
                                message={errors.message}
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <DangerButton
                                type="button"
                                className="mt-4"
                                onClick={closeModal}
                            >
                                Cerrar
                            </DangerButton>
                            {cargaData?.status !== "pendiente" &&
                            vehicleId ? null : (
                                <>
                                    <PrimaryButton
                                        type="button"
                                        className="mt-4"
                                        onClick={handleConfirm}
                                    >
                                        Aceptar Carga
                                    </PrimaryButton>
                                    <SecondaryButton
                                        type="submit"
                                        className="mt-4"
                                    >
                                        Renunciar al envio
                                    </SecondaryButton>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>
        </Authenticated>
    );
}
