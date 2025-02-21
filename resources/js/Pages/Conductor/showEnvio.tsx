import { AccordionItem } from "@/Components/Accordeon";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Card from "@/Components/Cards/Card";
import Modal from "@/Components/Modal/Modal";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    dataCarga: ShipmentInterface;
    altercados: AltercationReportInterface[];
    device_id: number | null;
};

export default function showEnvio({ dataCarga, altercados }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [confirmingShow, setConfirmingShow] = useState(false);
    const { flash } = usePage().props;

    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex(openIndex === index ? null : index);
        },
        [openIndex]
    );

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleViewEnvio = useCallback(() => {
        setConfirmingShow(true);
    }, []);

    const closeModal = useCallback(() => {
        setConfirmingShow(false);
    }, []);

    const handleConfirm = async () => {
        try {
            await router.patch(route("client.envios.status", dataCarga.id), {
                preserveScroll: true,
            });
            closeModal();
        } catch (error) {
            toast.error("Error al cancelar el envío");
        }
    };

    return (
        <Authenticated>
            <Head title="Show" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <h1 className="font-semibold text-sm md:text-lg pb-3">
                            Información del envio de carga
                        </h1>
                        <Link href={route("driver.show.map", dataCarga.id)}>
                            <i className="bi bi-map"></i>
                        </Link>
                    </div>
                    <div className="pl-4 space-y-1">
                        <p>
                            <strong>Cliente: </strong>
                            {dataCarga.client.nombre +
                                " " +
                                dataCarga.client.ap_pat}
                        </p>
                        <p>
                            <strong>Telefono Cliente: </strong>
                            {dataCarga.client.numero}
                        </p>
                        <p>
                            <strong>Peso en toneldas: </strong>
                            {dataCarga.peso} t.
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {dataCarga.destino}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {dataCarga.fecha_entrega}
                        </p>
                        <p>
                            <strong>Estado: </strong>
                            {dataCarga.status}
                        </p>
                        
                        <p>
                            <strong>Notas: </strong>
                            {dataCarga.notas}
                        </p>
                    </div>
                    <div className="flex items-center justify-center h-16 gap-4">
                        <Link
                            href={route("create.altercation", dataCarga.id)}
                            className="bg-white rounded-md px-4 py-1"
                        >
                            Reportar
                        </Link>
                        {dataCarga?.status === "en_transito" ? (
                            <PrimaryButton
                                type="button"
                                onClick={handleViewEnvio}
                            >
                                Confirmar Entrega
                            </PrimaryButton>
                        ) : null}
                    </div>
                </Card>
                <Card>
                    <div className="py-4 text-center">
                        <h1 className="font-bold text-lg">
                            Altercados registrados en el transcurso del envio
                        </h1>
                    </div>
                    {altercados.length > 0 ? (
                        altercados.map((item, index) => (
                            <AccordionItem
                                key={index}
                                title={`${item.tipo_altercado} ${item.fecha}`}
                                content={item.description}
                                isOpen={openIndex === index}
                                onToggle={() => handleToggle(index)}
                            />
                        ))
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="font-semibold text-sm">
                                No hay registro de altercados
                            </p>
                        </div>
                    )}
                </Card>
            </div>
            <Modal show={confirmingShow} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h1 className="font-medium text-base text-gray-900">
                        Esta seguro de confirmar la entrega
                    </h1>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={closeModal}
                        >
                            Cancel
                        </SecondaryButton>
                        {dataCarga?.status === "en_transito" ? (
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
        </Authenticated>
    );
}
