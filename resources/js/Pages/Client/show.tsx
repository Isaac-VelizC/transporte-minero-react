import Card from "@/Components/Card";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

type Props = {
    envio: ShipmentInterface;
};

export default function show({ envio }: Props) {
    return (
        <Authenticated>
            <Head title="Show Envio" />
                <Card>
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <h1 className="font-semibold text-sm md:text-lg pb-3">
                            Información del envio de carga
                        </h1>
                        <Link href={route("driver.show.map", envio.id)}>
                            <i className="bi bi-map"></i>
                        </Link>
                    </div>
                    <div className="pl-4 space-y-1">
                        <p>
                            <strong>Cliente: </strong>
                            {envio.client.nombre + " " + envio.client.ap_pat}
                        </p>
                        <p>
                            <strong>Peso en toneldas: </strong>
                            {envio.peso} t.
                        </p>
                        <p>
                            <strong>Destino: </strong>
                            {envio.destino}
                        </p>
                        <p>
                            <strong>Fecha de Entrega: </strong>
                            {envio.fecha_entrega}
                        </p>
                        <p>
                            <strong>Notas: </strong>
                            {envio.notas}
                        </p>
                    </div>
                </Card>
                <br />
                <Card>
                    <div className="py-4 text-center">
                        <h1 className="font-bold text-lg">
                            Rastreo del pedido
                        </h1>
                    </div>
                </Card>
        </Authenticated>
    );
}
