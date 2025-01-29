import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import DataTableComponent from "@/Components/Table";
import { DeviceInterface } from "@/interfaces/Device";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";
import FormModal from "./formModal";
import { VehicleInterface } from "@/interfaces/Vehicle";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import toast from "react-hot-toast";

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
                        <button onClick={() => handleUpdateStorage(row.id)}>
                            <i className="bi bi-shield"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
            },
        ],
        []
    );

    const handleUpdateStorage = async (row: number) => {
        try {
            // Cargar FingerprintJS y obtener el ID del dispositivo
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const deviceId = result.visitorId;

            // Asegurarse de que el visorID se establezca antes de continuar
            if (!deviceId) {
                throw new Error(
                    "No se pudo obtener el ID del dispositivo, intenta nuevamente."
                );
            }
            localStorage.setItem("deviceId", deviceId);
            // Ejecutar la acción correspondiente
            const response = await axios.put(
                route("devices.update.storage", row),
                { visorID: deviceId }
            );

            if (response.data.status === "success") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || "Error inesperado.");
                toast.error(response.data.erros.message || "Error inesperado.");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message); // Ahora TypeScript sabe que 'error' es un objeto Error
            } else {
                console.log("Error desconocido"); // Manejo de otros tipos de errores
            }
        }
    };

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
