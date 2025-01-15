import { AccordionItem } from "@/Components/Accordeon";
import Card from "@/Components/Cards/Card";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import LinkButton from "@/Components/Buttons/LinkButton";

type Props = {
    dataCarga: ShipmentInterface;
    altercados: AltercationReportInterface[];
};

export default function showEnvio({ dataCarga, altercados }: Props) {
    const [devicePermiso, setDevicePermiso] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { flash } = usePage().props;
    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex(openIndex === index ? null : index);
        },
        [openIndex]
    );

    useEffect(() => {
        const loadFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const deviceId = result.visitorId;
            if (deviceId === dataCarga.vehicle.device?.visorID) {
                setDevicePermiso(true);
                console.log("Permitido");
            } else {
                setDevicePermiso(false);
                console.log("No permitido");
            }
        };

        loadFingerprint(); // Llama a la función asíncrona
    }, [dataCarga]); // Agrega dataCarga como dependencia si se espera que cambie

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
            <Head title="Show" />
            {devicePermiso ? (
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
                                <strong>Notas: </strong>
                                {dataCarga.notas}
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-16">
                            <Link
                                href={route("create.altercation", dataCarga.id)}
                                className="bg-white rounded-md px-4 py-1"
                            >
                                Registrar altercado
                            </Link>
                        </div>
                    </Card>
                    <Card>
                        <div className="py-4 text-center">
                            <h1 className="font-bold text-lg">
                                Altercados registrados en el transcurso del
                                envio
                            </h1>
                        </div>
                        {altercados.length > 0 ? (
                            altercados.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    title={item.fecha}
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
            ) : (
                <Card classNames="flex justify-center items-center w-full h-80">
                    <div className="text-center space-y-14">
                        <h1 className="text-xl">El Dispositivo no esta registrado</h1>
                        <LinkButton href="driver.envios.list">Volver</LinkButton>
                    </div>
                </Card>
            )}
        </Authenticated>
    );
}
