import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import { DeviceInterface } from "@/interfaces/Device";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useMemo, useState } from "react";
import FormModal from "./formModal";
import { VehicleInterface } from "@/interfaces/Vehicle";

type Props = {
    vehicles: VehicleInterface[];
    devices: DeviceInterface[];
};

export default function index({ devices, vehicles }: Props) {
    const [showModalForm, setShowModalForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [dataSelect, setDataSelect] = useState<DeviceInterface | null>(null);

    const columns = useMemo(
        () => [
            {
                name: "Numero Serial",
                cell: (row: DeviceInterface) => row.num_serial,
            },
            {
                name: "Nombre del Dispositivo",
                cell: (row: DeviceInterface) => row.name_device,
                sortable: true,
            },
            {
                name: "Tipo de Dispositivo",
                cell: (row: DeviceInterface) => row.type,
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: DeviceInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 text-white ${
                            row.status === "activo"
                                ? "bg-green-400"
                                : row.status === "asignado"
                                ? "bg-orange-400"
                                : "bg-red-400"
                        } `}
                    >
                        {row.status}
                    </span>
                ),
            },
            {
                name: "Acciones",
                cell: (row: DeviceInterface) => (
                    <div className="flex gap-4">
                        <button onClick={() => handleEdit(row)}>
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        []
    );

    const handleEdit = (row: DeviceInterface) => {
        setIsEditing(true);
        setDataSelect(row);
        setShowModalForm(true);
    };

    const handleCreate = () => {
        setIsEditing(false);
        setDataSelect(null);
        setShowModalForm(true);
    };

    const closeModal = () => {
        setShowModalForm(false);
        setDataSelect(null);
    };

    return (
        <Authenticated>
            <Head title="Devices" />
            <div className="flex justify-end my-10 gap-3">
                <PrimaryButton type="button" onClick={handleCreate}>
                    Nuevo
                </PrimaryButton>
            </div>
            <DataTableComponent columns={columns} data={devices} />
            <FormModal
                show={showModalForm}
                onClose={closeModal}
                device={dataSelect || undefined}
                vehicles={vehicles}
                isEditing={isEditing}
            />
        </Authenticated>
    );
}
