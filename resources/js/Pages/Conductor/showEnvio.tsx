import { AccordionItem } from "@/Components/Accordeon";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import Card from "@/Components/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    dataCarga: ShipmentInterface;
    altercados: AltercationReportInterface[];
};

export default function showEnvio({ dataCarga, altercados }: Props) {
    const [dateSelect, setDataSelect] = useState();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const initialData = useMemo(
        () =>
            dateSelect || {
                id: null,
                driver_id: dataCarga.conductor.driver?.id,
                car_id: dataCarga.vehicle.id,
                envio_id: dataCarga.id,
                description: "",
            },
        [dateSelect]
    );

    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex(openIndex === index ? null : index);
        },
        [openIndex]
    );

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const action = isEditing && data.id ? patch : post;
        const routeName =
            isEditing && data.id
                ? "mantenimiento.update"
                : "driver.store.altercado";
        action(route(routeName, `${data?.id}`), {
            onSuccess: ({ props: { flash } }) => {
                reset()
                if (flash?.success) toast.success(flash.success);
                console.log("exito");
            },
        });
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
                            <strong>Notas: </strong>
                            {dataCarga.notas}
                        </p>
                    </div>
                    <form className="sm:p-6" onSubmit={handleSubmit}>
                        <h2 className="text-lg font-semibold">
                            Reportar un altercado
                        </h2>
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Descripción de altercado"
                            />
                            <textarea
                                id="description"
                                rows={4}
                                className="mt-1 block w-full rounded-md"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                value={data.description}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.description}
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <SecondaryButton
                                type="button"
                                onClick={() => reset()}
                            >
                                Cancelar
                            </SecondaryButton>

                            <PrimaryButton
                                type="submit"
                                className="ms-3"
                                disabled={processing}
                            >
                                {processing
                                    ? "Processing..."
                                    : "Reportar Altercado"}
                            </PrimaryButton>
                        </div>
                    </form>
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
        </Authenticated>
    );
}
