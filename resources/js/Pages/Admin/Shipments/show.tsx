import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

type Props = {
    datos: ShipmentInterface;
};

function show({ datos }: Props) {
    return (
        <Authenticated>
            <Head title="Show" />
            <Breadcrumb pageName="Show list" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gray-400 lg:col-span-1 rounded-lg p-6 text-gray-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h1 className="font-bold text-2xl mb-4 text-gray-800">
                        Información del Envío
                    </h1>
                    <div className="py-2 space-y-2 text-lg">
                        <p>
                            <strong>Cliente:</strong> {datos.full_name}
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
                            <strong>Matrícula de Vehículo:</strong>{" "}
                            {datos.matricula}
                        </p>
                        <p>
                            <strong>Notas:</strong> {datos.notas || "N/A"}
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
                                {" "}{datos.status}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="bg-gray-400 rounded-lg p-6 text-gray-600 shadow-md hover:shadow-lg transition-shadow duration-300 lg:col-span-2">
                    Listado de Reportes
                </div>
            </div>
        </Authenticated>
    );
}

export default show;
