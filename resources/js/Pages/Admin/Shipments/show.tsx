import { AccordionItem } from "@/Components/Accordeon";
import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Card from "@/Components/Cards/Card";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useCallback, useState } from "react";

type Props = {
    datos: ShipmentInterface;
    reportes: AltercationReportInterface[];
};

function show({ datos, reportes }: Props) {
    console.log(datos);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const handleToggle = useCallback(
        (index: number) => {
            setOpenIndex(openIndex === index ? null : index);
        },
        [openIndex]
    );
    return (
        <Authenticated>
            <Head title="Show" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Lista", path: "/envios" },
                    { name: `Codigo ${datos.id}` },
                ]}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h1 className="font-bold text-2xl mb-4 text-gray-800">
                        Información del Envío
                    </h1>
                    <div className="py-2 space-y-2 text-lg">
                        <p>
                            <strong>Cliente:</strong>{" "}
                            {datos.client.nombre +
                                " " +
                                datos.client.ap_pat +
                                " " +
                                datos.client.ap_mat}
                        </p>
                        <p>
                            <strong>Telefono del Cliente:</strong>{" "}
                            {datos.client.numero}
                        </p>
                        <p>
                            <strong>Origén:</strong> {datos.origen}
                        </p>
                        <p>
                            <strong>Destino:</strong> {datos.destino}
                        </p>
                        <p>
                            <strong>Fecha de Envío:</strong> {datos.fecha_envio}
                        </p>
                        <p>
                            <strong>Fecha de Entrega:</strong>{" "}
                            {datos.fecha_entrega}
                        </p>
                        <div>
                            <h3>Matrícula y Conductor</h3>
                            {datos.vehicle_schedules &&
                            datos.vehicle_schedules.length > 0 ? (
                                <ul>
                                    {datos.vehicle_schedules.map((item) => (
                                        <li key={item.id}>
                                            <strong>Camión:</strong>{" "}
                                            {item.vehicle?.matricula} <br />
                                            <strong>Conductor:</strong>{" "}
                                            {item.driver?.persona?.nombre ||
                                                "Nombre no disponible"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay vehículos disponibles.</p>
                            )}
                        </div>
                        <p>
                            <strong>Peso de la Carga:</strong> {datos.peso}{" "}
                            Toneladas
                        </p>
                        <p>
                            <strong>Costo por Tonelada:</strong>{" "}
                            {datos.sub_total}bs.
                        </p>
                        <p>
                            <strong>Total de envio:</strong> {datos.total}bs.
                        </p>
                        <p>
                            <strong>Status:</strong>
                            <span
                                className={
                                    datos.status === "Delivered"
                                        ? "text-green-600 capitalize"
                                        : "text-red-600 capitalize"
                                }
                            >
                                {" "}
                                {datos.status}
                            </span>
                        </p>
                        <p>
                            <strong>Notas:</strong> {datos.notas || "N/A"}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center font-bold text-lg">
                        <h1>Listado de Reportes</h1>
                    </div>
                    {reportes.length > 0 ? (
                        reportes.map((item, index) => (
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

export default show;
