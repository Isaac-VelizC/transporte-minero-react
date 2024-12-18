import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Card from "@/Components/Card";
import { ShipmentInterface } from "@/interfaces/Shipment";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useCallback } from "react";

type Props = {
    data: ShipmentInterface;
};

export default function showEnvio({ data }: Props) {

    return (
        <Authenticated>
            <Head title="Show" />
            
        </Authenticated>
    );
}
