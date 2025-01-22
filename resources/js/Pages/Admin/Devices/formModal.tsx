import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import InputError from "@/Components/Forms/InputError";
import InputLabel from "@/Components/Forms/InputLabel";
import SelectInput from "@/Components/Forms/SelectInput";
import TextInput from "@/Components/Forms/TextInput";
import Modal from "@/Components/Modal/Modal";
import { DeviceInterface } from "@/interfaces/Device";
import { VehicleInterface } from "@/interfaces/Vehicle";
import { useForm } from "@inertiajs/react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

type Props = {
    show: boolean;
    onClose: () => void;
    vehicles: VehicleInterface[];
    device?: DeviceInterface;
    isEditing: boolean;
};

const FormModal: React.FC<Props> = ({ show, onClose, device, isEditing }) => {
    const initialData = device || {
        id: null,
        num_serial: "",
        visorID: "",
        name_device: "",
        type: "",
        status: "",
    };

    const { data, setData, post, patch, errors, processing, reset } =
        useForm(initialData);

    useEffect(() => {
        setData(initialData);
    }, [device]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Cargar FingerprintJS y obtener el ID del dispositivo
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const deviceId = result.visitorId;

            // Asegurarse de que el visorID se establezca antes de continuar
            if (!deviceId) {
                throw new Error(
                    "No se pudo obtener el ID del dispositivo, Intentalo nuevamente"
                );
            }
            data.visorID = deviceId;
            // Asegúrate de que el estado esté actualizado antes de continuar
            await new Promise((resolve) => setTimeout(resolve, 0)); // Espera un ciclo de renderizado

            // Determinar la acción y los parámetros según si se está editando o creando
            const isUpdate = isEditing && data?.id;
            const action = isUpdate ? patch : post;
            const routeName = isUpdate ? "devices.update" : "devices.create";
            const routeParams = isUpdate ? data.id : undefined;

            // Ejecutar la acción correspondiente
            await action(route(routeName, routeParams), {
                onSuccess: ({ props: { flash } }) => {
                    onClose();
                    reset();
                    if (flash?.success) toast.success(flash.success);
                    if (flash?.error) toast.error(flash.error);
                },
                onError: () => {
                    toast.error(
                        "Error al registrar o actualizar el dispositivo"
                    );
                },
            });
        } catch (error) {
            // Manejo de errores más específico
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(
                    "No se pudo obtener la información del dispositivo"
                );
            }
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="p-6" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold text-gray-900">
                    {isEditing
                        ? "Editar informacion del dispositivo"
                        : "Registrar nuevo dispositivo"}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 sm:gap-4">
                    <div>
                        <InputLabel
                            htmlFor="num_serial"
                            value="Numero Serial"
                        />
                        <TextInput
                            id="num_serial"
                            className="mt-1 block w-full"
                            value={data.num_serial}
                            onChange={(e) =>
                                setData("num_serial", e.target.value)
                            }
                            required
                        />
                        <InputError
                            className="mt-2"
                            message={errors.num_serial}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="name_device"
                            value="Nombre del Dispositivo"
                        />
                        <TextInput
                            id="name_device"
                            className="mt-1 block w-full"
                            value={data.name_device}
                            onChange={(e) =>
                                setData("name_device", e.target.value)
                            }
                            required
                            isFocused
                        />
                        <InputError
                            className="mt-2"
                            message={errors.name_device}
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="type" value="Tipo de SO" />
                        <SelectInput
                            required
                            className="mt-1 block w-full"
                            onChange={(e) => setData("type", e.target.value)}
                            value={data.type || ""}
                        >
                            <option value="" disabled>
                                Seleccionar SO
                            </option>
                            <option value="Android">Android</option>
                            <option value="IOS">IOS</option>
                        </SelectInput>
                        <InputError className="mt-2" message={errors.type} />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="status"
                            value="Estado del Dispositivo"
                        />
                        <SelectInput
                            isFocused
                            required
                            className="mt-1 block w-full"
                            onChange={(e) => setData("status", e.target.value)}
                            value={data.status || ""}
                        >
                            <option value="" disabled>
                                Seleccionar estado
                            </option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </SelectInput>
                        <InputError className="mt-2" message={errors.status} />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={onClose}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton
                        type="submit"
                        className="ms-3"
                        disabled={processing}
                    >
                        {processing
                            ? "Processing..."
                            : isEditing
                            ? "Guardar cambios"
                            : "Registrar"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default FormModal;
