import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import Card from "@/Components/Card";
import { AltercationReportInterface } from "@/interfaces/AltercationReport";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

type Props = {
    datos: ShipmentInterface;
    reportes: AltercationReportInterface[];
};

function show({ datos, reportes }: Props) {
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
                            <strong>Destino:</strong> {datos.destino}
                        </p>
                        <p>
                            <strong>Fecha de Envío:</strong> {datos.fecha_envio}
                        </p>
                        <p>
                            <strong>Fecha de Entrega:</strong>{" "}
                            {datos.fecha_entrega}
                        </p>
                        <p>
                            <strong>Conductor de Vehículo:</strong>{" "}
                            {datos.conductor.nombre +
                                " " +
                                datos.conductor.ap_pat}{" "}
                            - {datos.conductor.numero}
                        </p>
                        <p>
                            <strong>Matrícula de Vehículo:</strong>{" "}
                            {datos.vehicle.matricula}
                        </p>
                        <p>
                            <strong>Peso de la Carga:</strong> {datos.peso}{" "}
                            Toneladas
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
                    <h1>Listado de Reportes</h1>
                    {reportes.map((item) => (
                        <div key={item.id}>
                            <p>{item.fecha}</p>
                        </div>
                    ))}
                </Card>
            </div>
        </Authenticated>
    );
}

export default show;
