import { AccordionItem } from "@/Components/Accordeon";
import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Card from "@/Components/Cards/Card";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useCallback, useState } from "react";

type Props = {
    altercations: AltercationReportInterface[];
};

export default function altercations({ altercations }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex(openIndex === index ? null : index);
        },
        [openIndex]
    );

    return (
        <Authenticated>
            <Head title="Altercados" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Envios", path: "/envios" },
                    { name: "Lista de Envios" },
                ]}
            />
            <Card>
                {altercations.length > 0 ? (
                    altercations.map((item, index) => (
                        <div className="border-b">
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer"
                                onClick={() => handleToggle(index)}
                            >
                                <div className="flex justify-end items-center gap-4">
                                    <h3 className="text-lg font-semibold">
                                        {item.driver.persona.nombre}{" "}
                                        {item.driver.persona.ap_pat}{" "}
                                        {item.driver.persona.ap_mat}
                                    </h3>
                                    <span className="text-sm font-normal">
                                        {item.fecha}
                                    </span>
                                </div>
                                <span>{openIndex === index ? "-" : "+"}</span>
                            </div>
                            {openIndex === index && (
                                <div className="p-4 bg-gray-100 rounded-lg">
                                    <div>
                                        <h2>
                                            <strong>Matricula</strong>{" "}
                                            {item.vehiculo.matricula}
                                        </h2>
                                        <h3><strong>Tipo de alerta</strong> {item.tipo_altercado}</h3>
                                        <p className="text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="font-semibold text-sm">
                            No hay registro de altercados
                        </p>
                    </div>
                )}
            </Card>
        </Authenticated>
    );
}
