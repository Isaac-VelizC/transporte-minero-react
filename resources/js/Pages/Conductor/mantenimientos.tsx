import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import Modal from "@/Components/Modal/Modal";
import DataTableComponent from "@/Components/Table";
import { MantenimientoInterface } from "@/interfaces/Mantenimiento";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Props = {
    mantenimientos: MantenimientoInterface[];
};

export default function mantenimientos({ mantenimientos }: Props) {
    const { flash } = usePage().props;
    const [openModalStatus, setOpenModalStatus] = useState(false);
    const { data, setData, patch, processing, reset, errors } = useForm({
        status: "",
    });
    const [dataSelect, setDataSelect] = useState<MantenimientoInterface>();
    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (_: MantenimientoInterface, index: number) => index + 1,
                width: "50px",
            },
            {
                name: "Matricula",
                cell: (row: MantenimientoInterface) => row.vehicle.matricula,
                sortable: true,
            },
            {
                name: "Modelo",
                cell: (row: MantenimientoInterface) => row.vehicle.modelo,
                sortable: true,
            },
            {
                name: "Fecha de mantenimiento",
                cell: (row: MantenimientoInterface) => row.fecha_inicio,
                sortable: true,
            },
            {
                name: "Fecha Realizada",
                cell: (row: MantenimientoInterface) =>
                    row.fecha_fin ? row.fecha_fin : "unknown",
                sortable: true,
            },
            {
                name: "Estado",
                cell: (row: MantenimientoInterface) => (
                    <span
                        className={`rounded-lg px-2 font-semibold py-1 border border-gray-600 bg-gray-800/5`}
                    >
                        {row.estado}
                    </span>
                ),
                width: "150px",
            },
            {
                cell: (row: MantenimientoInterface) =>
                    row.estado != "terminado" ? (
                        <button onClick={() => handleMantenimientoConfirm(row)}>
                            <i className="bi bi-check"></i>
                        </button>
                    ) : null,
                ignoreRowClick: true,
                width: "80px",
            },
        ],
        []
    );

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleMantenimientoConfirm = (row: MantenimientoInterface) => {
        setOpenModalStatus(true);
        setDataSelect(row);
    };

    const closeModal = () => {
        reset();
        setOpenModalStatus(false);
    };

    const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (dataSelect) {
                // Asegúrate de establecer el status antes de enviar
                await patch(route("driver.confirm.status", dataSelect.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        closeModal();
                    },
                    onError: () => {
                        toast.error(
                            "Error al registrar o actualizar el dispositivo"
                        );
                    },
                });
            }
        } catch (error) {
            console.error("Error al confirmar el mantenimiento:", error);
            toast.error("Error al confirmar el mantenimiento");
        }
    };

    return (
        <Authenticated>
            <Head title="Mantenimiento" />
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", path: "/dashboard" },
                    { name: "Mantenimientos" },
                ]}
            />
            <DataTableComponent columns={columns} data={mantenimientos} />
            <Modal show={openModalStatus} onClose={closeModal}>
                <form onSubmit={handleConfirm} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Cambiar estado de mantenimiento
                    </h2>
                    <div className="mt-6">
                        <InputLabel
                            htmlFor="status"
                            value="Cambair estado"
                            className="sr-only"
                        />
                        <SelectInput
                            isFocused
                            className="mt-1 block w-full"
                            required
                            onChange={(e) => setData("status", e.target.value)}
                            value={data.status || ""}
                        >
                            <option value="">Seleccionar Estado</option>
                            <option value="proceso">En proceso</option>
                            <option value="terminado">Terminado</option>
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton
                            type="button"
                            className="mt-4"
                            onClick={closeModal}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            className="mt-4"
                            disabled={processing}
                        >
                            Guardar
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </Authenticated>
    );
}
