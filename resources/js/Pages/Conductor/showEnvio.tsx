import Accordion from "@/Components/Accordeon";
import LinkButton from "@/Components/Buttons/LinkButton";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Card from "@/Components/Card";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

type Props = {
    dataCarga: ShipmentInterface;
};

export default function showEnvio({ dataCarga }: Props) {
    const [dateSelect, setDataSelect] = useState();
    const initialData = useMemo(
        () =>
            dateSelect || {
                id: null,
                notas: "",
            },
        [dateSelect]
    );
    const { data, setData, post, patch, errors, processing } =
        useForm(initialData);
    return (
        <Authenticated>
            <Head title="Show" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <h1 className="font-semibold text-sm md:text-lg pb-3">
                            Información del envio de carga
                        </h1>
                        <Link
                            href={route("driver.show.map", dataCarga.id)}
                            className="flex items-center space-x-2 border border-gray-200 p-3 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 hover:text-gray-700"
                        >
                            <i className="bi bi-map"></i>
                        </Link>
                    </div>
                    <div className="pl-4 space-y-1">
                        <p>
                            <strong>Cliente: </strong>
                            {dataCarga.full_name} t.
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
                            <strong>Notas: </strong>
                            {dataCarga.notas}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {dataCarga.fecha_entrega}
                        </p>
                    </div>
                    <form className="sm:p-6">
                        <h2 className="text-lg font-semibold">
                            Reportar un altercado
                        </h2>
                        <div>
                            <InputLabel
                                htmlFor="notas"
                                value="Descripción de altercado"
                            />
                            <textarea
                                id="notas"
                                rows={4}
                                className="mt-1 block w-full rounded-md"
                                onChange={(e) =>
                                    setData("notas", e.target.value)
                                }
                                value={data.notas}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.notas}
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <PrimaryButton type="submit">
                                Reportar Altercado
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
                <Card>
                    <Accordion />
                </Card>
            </div>
        </Authenticated>
    );
}
